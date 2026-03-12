<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AttendanceRecordController extends Controller
{
    private const MODULE_KEY = 'attendance_records';

    private const PAGE_ROOT = 'AttendanceRecords';

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $query = AttendanceRecord::query()
            ->with(['employee']);

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('work_date', 'like', "%{$search}%")
                    ->orWhere('clock_in', 'like', "%{$search}%")
                    ->orWhere('clock_out', 'like', "%{$search}%")
                    ->orWhere('minutes_worked', 'like', "%{$search}%")
                    ->orWhere('exception_status', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('employee', function (Builder $employeeQuery) use ($search) {
                        $employeeQuery
                            ->where('staff_number', 'like', "%{$search}%")
                            ->orWhere('first_name', 'like', "%{$search}%")
                            ->orWhere('middle_name', 'like', "%{$search}%")
                            ->orWhere('surname', 'like', "%{$search}%");
                    });
            });
        }

        $records = $query
            ->orderByDesc('work_date')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        $records->getCollection()->transform(function (AttendanceRecord $record) {
            if ($record->relationLoaded('employee') && $record->employee) {
                $record->employee->append('full_name');
            }

            return $record;
        });

        return Inertia::render(self::PAGE_ROOT.'/Index', [
            'module' => $this->moduleMeta(),
            'records' => $records,
            'filters' => [
                'search' => $search,
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

        AttendanceRecord::create($validated);

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name').' created successfully.');
    }

    public function show(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        if ($record->relationLoaded('employee') && $record->employee) {
            $record->employee->append('full_name');
        }

        return Inertia::render(self::PAGE_ROOT.'/Show', [
            'module' => $this->moduleMeta(),
            'record' => $record,
        ]);
    }

    public function edit(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        if ($record->relationLoaded('employee') && $record->employee) {
            $record->employee->append('full_name');
        }

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
            abort(500, 'Module configuration missing for key: '.self::MODULE_KEY);
        }

        return $config;
    }

    private function validationRules(?Model $record = null): array
    {
        $fields = Arr::get($this->moduleConfig(), 'fields', []);
        $rules = [];

        foreach ($fields as $name => $field) {
            $fieldRules = $field['rules'] ?? ['nullable'];

            if (($field['unique'] ?? false) === true) {
                $table = (new AttendanceRecord)->getTable();
                $fieldRules[] = Rule::unique($table, $name)->ignore($record?->getKey());
            }

            $rules[$name] = $fieldRules;
        }

        return $rules;
    }

    private function findOrFail(string $id): AttendanceRecord
    {
        return AttendanceRecord::query()
            ->with(['employee'])
            ->findOrFail($id);
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
