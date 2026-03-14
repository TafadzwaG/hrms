<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Timesheet;
use App\Support\Audit\AuditContext;
use App\Support\Audit\AuditLogger;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TimesheetController extends Controller
{
    private const PAGE_ROOT = 'Timesheets';

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $query = Timesheet::query()
            ->with($this->timesheetRelations());

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('status', 'like', "%{$search}%")
                    ->orWhere('approved_by', 'like', "%{$search}%")
                    ->orWhereHas('employee', function (Builder $employeeQuery) use ($search) {
                        $employeeQuery
                            ->where('staff_number', 'like', "%{$search}%")
                            ->orWhere('first_name', 'like', "%{$search}%")
                            ->orWhere('middle_name', 'like', "%{$search}%")
                            ->orWhere('surname', 'like', "%{$search}%");
                    });
            });
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        $records = $query
            ->orderByDesc('period_start')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        $records->getCollection()->transform(function (Timesheet $timesheet) {
            return $this->decorateTimesheet($timesheet);
        });

        return Inertia::render(self::PAGE_ROOT.'/Index', [
            'records' => $records,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'stats' => $this->buildIndexStats(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function create()
    {
        return Inertia::render(self::PAGE_ROOT.'/Create', [
            'employees' => $this->employeeOptions(),
            'statusOptions' => $this->statusOptions(),
            'defaults' => [
                'employee_id' => '',
                'period_start' => '',
                'period_end' => '',
                'total_minutes' => 0,
                'overtime_minutes' => 0,
                'status' => 'Pending',
                'approved_by' => '',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        Timesheet::create($validated);

        return redirect()
            ->to('/timesheets')
            ->with('success', 'Timesheet created successfully.');
    }

    public function show(Request $request)
    {
        $record = $this->decorateTimesheet(
            $this->findOrFail($this->resolveRouteRecordId($request))
        );

        return Inertia::render(self::PAGE_ROOT.'/Show', [
            'record' => $record,
            'summary' => $this->buildShowSummary($record),
            'employeeHistory' => $this->buildEmployeeHistory($record),
        ]);
    }

    public function edit(Request $request)
    {
        $record = $this->decorateTimesheet(
            $this->findOrFail($this->resolveRouteRecordId($request))
        );

        return Inertia::render(self::PAGE_ROOT.'/Edit', [
            'record' => $record,
            'employees' => $this->employeeOptions(),
            'statusOptions' => $this->statusOptions(),
        ]);
    }

    public function update(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        $validated = $request->validate($this->validationRules($record));
        $record->update($validated);

        return redirect()
            ->to('/timesheets/'.$record->id)
            ->with('success', 'Timesheet updated successfully.');
    }

    public function destroy(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));
        $record->delete();

        return redirect()
            ->to('/timesheets')
            ->with('success', 'Timesheet deleted successfully.');
    }

    public function approve(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));
        $before = [
            'status' => $record->status,
            'approved_by' => $record->approved_by,
        ];

        AuditContext::withoutAuditing(function () use ($record, $request): void {
            $record->update([
                'status' => 'Approved',
                'approved_by' => $this->actorName($request),
            ]);
        });

        app(AuditLogger::class)->logCustom('approve', $record, [
            'module' => 'timesheets',
            'category' => 'workflow',
            'description' => 'Approved timesheet.',
            'old_values' => $before,
            'new_values' => [
                'status' => $record->status,
                'approved_by' => $record->approved_by,
            ],
        ]);

        return redirect()
            ->to('/timesheets/'.$record->id)
            ->with('success', 'Timesheet approved successfully.');
    }

    public function reject(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));
        $before = [
            'status' => $record->status,
            'approved_by' => $record->approved_by,
        ];

        AuditContext::withoutAuditing(function () use ($record, $request): void {
            $record->update([
                'status' => 'Rejected',
                'approved_by' => $this->actorName($request),
            ]);
        });

        app(AuditLogger::class)->logCustom('reject', $record, [
            'module' => 'timesheets',
            'category' => 'workflow',
            'description' => 'Rejected timesheet.',
            'old_values' => $before,
            'new_values' => [
                'status' => $record->status,
                'approved_by' => $record->approved_by,
            ],
        ]);

        return redirect()
            ->to('/timesheets/'.$record->id)
            ->with('success', 'Timesheet rejected successfully.');
    }

    private function validationRules(?Model $record = null): array
    {
        return [
            'employee_id' => ['required', 'exists:employees,id'],
            'period_start' => ['required', 'date'],
            'period_end' => ['required', 'date', 'after_or_equal:period_start'],
            'total_minutes' => ['required', 'integer', 'min:0'],
            'overtime_minutes' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', 'string', 'max:255'],
            'approved_by' => ['nullable', 'string', 'max:255'],
        ];
    }

    private function findOrFail(string $id): Timesheet
    {
        return Timesheet::query()
            ->with($this->timesheetRelations())
            ->findOrFail($id);
    }

    private function timesheetRelations(): array
    {
        return [
            'employee',
            'employee.user',
            'employee.orgUnit',
            'employee.location',
            'employee.position',
            'employee.manager',
        ];
    }

    private function decorateTimesheet(Timesheet $timesheet): Timesheet
    {
        if ($timesheet->relationLoaded('employee') && $timesheet->employee) {
            $timesheet->employee->append('full_name');

            if ($timesheet->employee->relationLoaded('manager') && $timesheet->employee->manager) {
                $timesheet->employee->manager->append('full_name');
            }
        }

        return $timesheet;
    }

    private function employeeOptions()
    {
        return Employee::query()
            ->with(['position', 'orgUnit'])
            ->orderBy('first_name')
            ->orderBy('surname')
            ->get([
                'id',
                'staff_number',
                'first_name',
                'middle_name',
                'surname',
                'position_id',
                'org_unit_id',
            ])
            ->map(function (Employee $employee) {
                $employee->append('full_name');

                return [
                    'id' => $employee->id,
                    'staff_number' => $employee->staff_number,
                    'full_name' => $employee->full_name,
                    'position' => $employee->position?->name ?? $employee->position?->title,
                    'department' => $employee->orgUnit?->name,
                ];
            })
            ->values();
    }

    private function statusOptions(): array
    {
        return [
            'Pending',
            'Approved',
            'Rejected',
            'Submitted',
            'Draft',
        ];
    }

    private function buildIndexStats(): array
    {
        return [
            'total' => Timesheet::query()->count(),
            'pending' => Timesheet::query()->where('status', 'Pending')->count(),
            'approved' => Timesheet::query()->where('status', 'Approved')->count(),
            'rejected' => Timesheet::query()->where('status', 'Rejected')->count(),
            'total_minutes' => (int) Timesheet::query()->sum('total_minutes'),
            'overtime_minutes' => (int) Timesheet::query()->sum('overtime_minutes'),
        ];
    }

    private function buildShowSummary(Timesheet $record): array
    {
        $periodStart = $record->period_start
            ? Carbon::parse($record->period_start)
            : null;

        $periodEnd = $record->period_end
            ? Carbon::parse($record->period_end)
            : null;

        return [
            'total_minutes' => (int) $record->total_minutes,
            'overtime_minutes' => (int) $record->overtime_minutes,
            'total_hours_text' => $this->minutesToHoursText((int) $record->total_minutes),
            'overtime_hours_text' => $this->minutesToHoursText((int) $record->overtime_minutes),
            'period_days' => $periodStart && $periodEnd
                ? $periodStart->diffInDays($periodEnd) + 1
                : 0,
            'period_label' => $periodStart && $periodEnd
                ? $periodStart->format('M d, Y').' - '.$periodEnd->format('M d, Y')
                : 'N/A',
        ];
    }

    private function buildEmployeeHistory(Timesheet $record): array
    {
        $history = Timesheet::query()
            ->where('employee_id', $record->employee_id)
            ->where('id', '!=', $record->id)
            ->orderByDesc('period_start')
            ->limit(5)
            ->get();

        return $history->map(function (Timesheet $item) {
            return [
                'id' => $item->id,
                'period_start' => $item->period_start?->format('Y-m-d'),
                'period_end' => $item->period_end?->format('Y-m-d'),
                'status' => $item->status,
                'total_minutes' => (int) $item->total_minutes,
                'overtime_minutes' => (int) $item->overtime_minutes,
                'total_hours_text' => $this->minutesToHoursText((int) $item->total_minutes),
            ];
        })->values()->all();
    }

    private function minutesToHoursText(int $minutes): string
    {
        $hours = intdiv($minutes, 60);
        $mins = $minutes % 60;

        if ($hours > 0 && $mins > 0) {
            return "{$hours}h {$mins}m";
        }

        if ($hours > 0) {
            return "{$hours}h";
        }

        return "{$mins}m";
    }

    private function actorName(Request $request): string
    {
        return (string) ($request->user()?->name ?? 'HR Admin');
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

    public function bulkUpload()
    {
        $preview = session('timesheets_bulk_preview', $this->sampleBulkPreview());

        return Inertia::render('Timesheets/BulkUpload', [
            'preview' => $preview,
        ]);
    }

    public function previewBulk(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt'],
        ]);

        $preview = $this->buildBulkPreviewFromCsv($validated['file']->getRealPath());

        session(['timesheets_bulk_preview' => $preview]);

        return redirect()
            ->to('/timesheets/bulk-upload')
            ->with('success', 'Batch preview generated successfully.');
    }

    public function processBulk(Request $request)
    {
        $preview = session('timesheets_bulk_preview');

        if (! $preview || empty($preview['rows'])) {
            return redirect()
                ->to('/timesheets/bulk-upload')
                ->with('error', 'No batch preview found to process.');
        }

        $processed = 0;
        $skipped = 0;
        $batchId = (string) Str::uuid();

        AuditContext::withBatch($batchId, function () use ($preview, &$processed, &$skipped): void {
            foreach ($preview['rows'] as $row) {
                if (! ($row['is_valid'] ?? false) || empty($row['employee_id'])) {
                    $skipped++;

                    continue;
                }

                Timesheet::updateOrCreate(
                    [
                        'employee_id' => $row['employee_id'],
                        'period_start' => $row['period_start'],
                        'period_end' => $row['period_end'],
                    ],
                    [
                        'total_minutes' => (int) $row['total_minutes'],
                        'overtime_minutes' => (int) $row['overtime_minutes'],
                        'status' => $row['status'] ?: 'Submitted',
                        'approved_by' => null,
                    ]
                );

                $processed++;
            }
        });

        session()->forget('timesheets_bulk_preview');

        app(AuditLogger::class)->logCustom('bulk_upload', null, [
            'module' => 'timesheets',
            'category' => 'bulk',
            'description' => 'Processed timesheet bulk upload batch.',
            'metadata' => [
                'processed' => $processed,
                'skipped' => $skipped,
            ],
            'batch_id' => $batchId,
        ]);

        return redirect()
            ->to('/timesheets')
            ->with('success', "Batch processed successfully. {$processed} record(s) saved, {$skipped} skipped.");
    }

    public function discardBulk()
    {
        session()->forget('timesheets_bulk_preview');

        return redirect()
            ->to('/timesheets/bulk-upload')
            ->with('success', 'Batch discarded successfully.');
    }

    public function downloadBulkTemplate()
    {
        $headers = [
            'staff_number',
            'period_start',
            'period_end',
            'total_minutes',
            'overtime_minutes',
            'status',
        ];

        $sampleRows = [
            ['PRV-001', '2023-10-01', '2023-10-07', '2400', '0', 'Submitted'],
            ['PRV-003', '2023-10-01', '2023-10-07', '2100', '60', 'Pending'],
        ];

        return Response::streamDownload(function () use ($headers, $sampleRows) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            foreach ($sampleRows as $row) {
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, 'timesheet_batch_template.csv', [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function buildBulkPreviewFromCsv(string $path): array
    {
        $handle = fopen($path, 'r');

        if ($handle === false) {
            throw ValidationException::withMessages([
                'file' => 'Unable to read the uploaded CSV file.',
            ]);
        }

        $rawHeaders = fgetcsv($handle);

        if (! $rawHeaders) {
            fclose($handle);

            throw ValidationException::withMessages([
                'file' => 'The uploaded CSV file is empty.',
            ]);
        }

        $headers = array_map(function ($header) {
            $header = preg_replace('/^\xEF\xBB\xBF/', '', (string) $header);

            return $this->normalizeBulkHeader($header);
        }, $rawHeaders);

        $required = [
            'staff_number',
            'period_start',
            'period_end',
            'total_minutes',
            'overtime_minutes',
            'status',
        ];

        $missing = array_values(array_diff($required, $headers));

        if (! empty($missing)) {
            fclose($handle);

            throw ValidationException::withMessages([
                'file' => 'Missing required columns: '.implode(', ', $missing),
            ]);
        }

        $rows = [];
        $line = 1;

        while (($data = fgetcsv($handle)) !== false) {
            $line++;

            $mapped = [];
            foreach ($headers as $index => $header) {
                $mapped[$header] = trim((string) ($data[$index] ?? ''));
            }

            if (collect($mapped)->every(fn ($value) => $value === '')) {
                continue;
            }

            $employee = Employee::query()
                ->with(['position', 'orgUnit'])
                ->where('staff_number', $mapped['staff_number'] ?? '')
                ->first();

            $errors = [];
            $start = null;
            $end = null;

            if (! $employee) {
                $errors[] = 'Unknown staff number.';
            }

            try {
                $start = Carbon::parse($mapped['period_start']);
            } catch (\Throwable $e) {
                $errors[] = 'Invalid start date.';
            }

            try {
                $end = Carbon::parse($mapped['period_end']);
            } catch (\Throwable $e) {
                $errors[] = 'Invalid end date.';
            }

            $totalMinutes = (int) ($mapped['total_minutes'] ?? 0);
            $overtimeMinutes = (int) ($mapped['overtime_minutes'] ?? 0);

            if ($start && $end && $end->lt($start)) {
                $errors[] = 'End date must be after or equal to start date.';
            }

            if ($totalMinutes < 0) {
                $errors[] = 'Regular minutes cannot be negative.';
            }

            if ($overtimeMinutes < 0) {
                $errors[] = 'Overtime minutes cannot be negative.';
            }

            $rows[] = [
                'line' => count($rows) + 1,
                'employee_id' => $employee?->id,
                'employee_name' => $employee?->full_name ?? 'Unknown Employee',
                'staff_number' => $mapped['staff_number'] ?? '',
                'period_start' => $start?->toDateString(),
                'period_end' => $end?->toDateString(),
                'period_start_label' => $start?->format('M j, Y') ?? ($mapped['period_start'] ?: '-'),
                'period_end_label' => $end?->format('M j, Y') ?? ($mapped['period_end'] ?: 'MISSING END DATE'),
                'total_minutes' => $totalMinutes,
                'overtime_minutes' => $overtimeMinutes,
                'status' => $mapped['status'] ?: 'Submitted',
                'is_valid' => empty($errors),
                'error' => implode(' ', $errors),
            ];
        }

        fclose($handle);

        return [
            'rows' => $rows,
            'summary' => [
                'total' => count($rows),
                'ready' => collect($rows)->where('is_valid', true)->count(),
                'errors' => collect($rows)->where('is_valid', false)->count(),
            ],
            'has_uploaded_batch' => true,
        ];
    }

    private function normalizeBulkHeader(string $header): string
    {
        return strtolower(
            trim(
                str_replace([' ', '-'], '_', $header)
            )
        );
    }

    private function sampleBulkPreview(): array
    {
        return [
            'rows' => [
                [
                    'line' => 1,
                    'employee_id' => null,
                    'employee_name' => 'John Doe',
                    'staff_number' => 'PRV-001',
                    'period_start' => '2023-10-01',
                    'period_end' => '2023-10-07',
                    'period_start_label' => 'Oct 1, 2023',
                    'period_end_label' => 'Oct 7, 2023',
                    'total_minutes' => 2400,
                    'overtime_minutes' => 0,
                    'status' => 'Submitted',
                    'is_valid' => true,
                    'error' => '',
                ],
                [
                    'line' => 2,
                    'employee_id' => null,
                    'employee_name' => 'Robert Brown',
                    'staff_number' => 'PRV-003',
                    'period_start' => '2023-10-01',
                    'period_end' => null,
                    'period_start_label' => 'Oct 1, 2023',
                    'period_end_label' => 'MISSING END DATE',
                    'total_minutes' => 2100,
                    'overtime_minutes' => 0,
                    'status' => 'Pending',
                    'is_valid' => false,
                    'error' => 'Missing or invalid end date.',
                ],
                [
                    'line' => 3,
                    'employee_id' => null,
                    'employee_name' => 'Alice White',
                    'staff_number' => 'PRV-004',
                    'period_start' => '2023-10-01',
                    'period_end' => '2023-10-07',
                    'period_start_label' => 'Oct 1, 2023',
                    'period_end_label' => 'Oct 7, 2023',
                    'total_minutes' => 2400,
                    'overtime_minutes' => 0,
                    'status' => 'Submitted',
                    'is_valid' => true,
                    'error' => '',
                ],
            ],
            'summary' => [
                'total' => 3,
                'ready' => 2,
                'errors' => 1,
            ],
            'has_uploaded_batch' => false,
        ];
    }
}
