<?php

namespace App\Http\Controllers;

use App\Models\PayrollExport;
use App\Models\Timesheet;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\XLSX\Writer;

class PayrollExportController extends Controller
{
    private const MODULE_KEY = 'payroll_exports';

    private const PAGE_ROOT = 'PayrollExports';

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = PayrollExport::query();

        $searchable = Arr::get($this->moduleConfig(), 'searchable', ['export_version', 'file_reference', 'notes']);

        if ($search !== '' && ! empty($searchable)) {
            $query->where(function (Builder $builder) use ($search, $searchable) {
                foreach ($searchable as $idx => $column) {
                    if ($idx === 0) {
                        $builder->where($column, 'like', "%{$search}%");
                    } else {
                        $builder->orWhere($column, 'like', "%{$search}%");
                    }
                }
            });
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        $records = $query
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render(self::PAGE_ROOT.'/Index', [
            'module' => $this->moduleMeta(),
            'records' => $records,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            // Added stats to match the frontend metrics UI
            'stats' => [
                'total' => PayrollExport::count(),
                'completed' => PayrollExport::where('status', 'Completed')->count(),
                'failed' => PayrollExport::where('status', 'Failed')->count(),
                'latest' => PayrollExport::latest('exported_at')->first(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render(self::PAGE_ROOT.'/Create', [
            'module' => $this->moduleMeta(),
            'record' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        PayrollExport::create($validated);

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name').' created successfully.');
    }

    public function show(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        return Inertia::render(self::PAGE_ROOT.'/Show', [
            'module' => $this->moduleMeta(),
            'record' => $record,
        ]);
    }

    public function edit(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        return Inertia::render(self::PAGE_ROOT.'/Edit', [
            'module' => $this->moduleMeta(),
            'record' => $record,
        ]);
    }

    public function update(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $validated = $request->validate($this->validationRules($record));
        $record->update($validated);

        $slug = Arr::get($this->moduleConfig(), 'slug');

        return redirect()
            ->to('/'.$slug.'/'.$record->id)
            ->with('success', Arr::get($this->moduleConfig(), 'name').' updated successfully.');
    }

    public function destroy(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));
        $record->delete();

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name').' deleted successfully.');
    }

    // --------------------------------------------------------
    // ACTION BUTTON METHODS (Excel, PDF, Automation, Retries)
    // --------------------------------------------------------

    /**
     * Download an empty template for manual payroll imports using OpenSpout.
     */
    public function downloadTemplate()
    {
        $writer = new Writer;
        $writer->openToBrowser('payroll_import_template.xlsx');

        // Header Row
        $row = Row::fromValues(['Staff Number', 'First Name', 'Surname', 'Regular Hours', 'Overtime Hours', 'Allowances', 'Deductions', 'Notes']);
        $writer->addRow($row);

        // Example Data Row
        $writer->addRow(Row::fromValues(['EMP-001', 'John', 'Doe', '80', '5.5', '150.00', '0.00', 'Sample Data']));

        $writer->close();
        exit;
    }

    /**
     * Run automation to generate a new export for the current period.
     */
    public function runAutomation()
    {
        // Determine current cycle (1st to 15th, or 16th to end of month)
        $now = now();
        $start = $now->copy()->startOfMonth();
        $end = $now->day <= 15 ? $now->copy()->startOfMonth()->addDays(14) : $now->copy()->endOfMonth();

        // Create the Export Record
        $export = PayrollExport::create([
            'period_start' => $start,
            'period_end' => $end,
            'export_version' => 'v'.date('Y.m.d'),
            'status' => 'Processing',
            'notes' => 'Automated cycle run',
        ]);

        // In a real scenario, you would dispatch a Job here.
        // For demonstration, we simulate instant completion.
        $export->update([
            'status' => 'Completed',
            'exported_at' => now(),
            'file_reference' => 'EX-'.date('Y-md').'-'.str_pad($export->id, 3, '0', STR_PAD_LEFT),
        ]);

        return redirect()->back()->with('success', 'Payroll automation completed successfully.');
    }

    /**
     * Bulk retry all failed exports.
     */
    public function retryFailed()
    {
        $failedExports = PayrollExport::where('status', 'Failed')->get();

        if ($failedExports->isEmpty()) {
            return redirect()->back()->with('info', 'No failed exports to retry.');
        }

        foreach ($failedExports as $export) {
            $export->update([
                'status' => 'Processing',
                'notes' => 'Retrying...',
            ]);
            // Dispatch your export job here...
        }

        return redirect()->back()->with('success', 'Failed exports queued for retry.');
    }

    /**
     * Download a specific Payroll Export as an Excel file using OpenSpout.
     */
    public function downloadExport(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $writer = new Writer;
        $fileName = $record->file_reference ? $record->file_reference.'.xlsx' : 'payroll_export_'.$record->id.'.xlsx';
        $writer->openToBrowser($fileName);

        // Define Headers
        $writer->addRow(Row::fromValues([
            'Staff Number',
            'Name',
            'Period Start',
            'Period End',
            'Total Minutes',
            'Overtime Minutes',
            'Timesheet Status',
        ]));

        // Fetch corresponding timesheets for this period
        $timesheets = Timesheet::with('employee')
            ->where('period_start', '>=', $record->period_start)
            ->where('period_end', '<=', $record->period_end)
            ->where('status', 'Approved') // Only export approved timesheets
            ->get();

        foreach ($timesheets as $ts) {
            $writer->addRow(Row::fromValues([
                $ts->employee?->staff_number ?? 'N/A',
                $ts->employee?->full_name ?? 'N/A',
                $ts->period_start?->format('Y-m-d'),
                $ts->period_end?->format('Y-m-d'),
                $ts->total_minutes,
                $ts->overtime_minutes,
                $ts->status,
            ]));
        }

        $writer->close();
        exit;
    }

    /**
     * Download a PDF Summary of the Payroll Export using DomPDF.
     */
    public function downloadPdfSummary(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $timesheets = Timesheet::with('employee')
            ->where('period_start', '>=', $record->period_start)
            ->where('period_end', '<=', $record->period_end)
            ->get();

        $data = [
            'record' => $record,
            'timesheets' => $timesheets,
            'total_hours' => intdiv($timesheets->sum('total_minutes'), 60),
            'total_overtime' => intdiv($timesheets->sum('overtime_minutes'), 60),
        ];

        // Assuming you have a view at resources/views/pdf/payroll_summary.blade.php
        // Create this blade file to format the data nicely
        $pdf = Pdf::loadView('pdf.payroll_summary', $data);

        return $pdf->download("Payroll_Summary_{$record->file_reference}.pdf");
    }

    // --------------------------------------------------------
    // INTERNAL HELPERS
    // --------------------------------------------------------

    private function moduleMeta(): array
    {
        $config = $this->moduleConfig();
        $fields = Arr::get($config, 'fields', []);

        $defaultIndex = collect($fields)
            ->filter(fn (array $field) => (bool) ($field['index'] ?? false))
            ->keys()
            ->values()
            ->all();

        return [
            'slug' => Arr::get($config, 'slug'),
            'name' => Arr::get($config, 'name'),
            'description' => Arr::get($config, 'description'),
            'fields' => collect($fields)->map(function (array $field, string $name) {
                return [
                    'name' => $name,
                    'label' => $field['label'] ?? ucwords(str_replace('_', ' ', $name)),
                    'type' => $field['type'] ?? 'text',
                    'placeholder' => $field['placeholder'] ?? null,
                    'options' => $field['options'] ?? [],
                    'index' => (bool) ($field['index'] ?? false),
                ];
            })->values(),
            'index_columns' => Arr::get($config, 'index_columns', $defaultIndex),
        ];
    }

    private function moduleConfig(): array
    {
        $config = config('hrms_modules.'.self::MODULE_KEY, []);

        if (! is_array($config) || empty($config)) {
            // Provide a fallback if config is not fully set up
            return [
                'slug' => 'payroll-exports',
                'name' => 'Payroll Exports',
                'description' => 'Manage Payroll Export Files',
                'searchable' => ['export_version', 'file_reference', 'notes'],
            ];
        }

        return $config;
    }

    private function validationRules(?Model $record = null): array
    {
        return [
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'export_version' => ['nullable', 'string'],
            'status' => ['required', 'string'],
            'file_reference' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }

    private function findOrFail(string $id): PayrollExport
    {
        return PayrollExport::query()->findOrFail($id);
    }

    private function resolveRouteRecordId(Request $request): string
    {
        $parameters = $request->route()?->parameters() ?? [];

        foreach ($parameters as $value) {
            if ($value instanceof Model) {
                return (string) $value->getKey();
            }

            if (is_scalar($value)) {
                return (string) $value;
            }
        }

        abort(404, 'Record not found.');
    }
}
