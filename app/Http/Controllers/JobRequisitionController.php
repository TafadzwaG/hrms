<?php

namespace App\Http\Controllers;

use App\Models\JobRequisition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JobRequisitionController extends Controller
{
    private const MODULE_KEY = 'job_requisitions';

    private const PAGE_ROOT = 'JobRequisitions';

    public function index(Request $request)
    {
        // 1. Retrieve filter values from the request
        $search = $request->string('search')->toString();
        $department = $request->string('department')->toString();
        $status = $request->string('status')->toString();

        $query = JobRequisition::query();

        // 2. Apply Search Filter
        $searchable = Arr::get($this->moduleConfig(), 'searchable', []);
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

        // 3. Apply Department Filter
        if ($department !== '' && $department !== 'all') {
            $query->where('department', $department);
        }

        // 4. Apply Status Filter
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
                'department' => $department, // Passed back to React
                'status' => $status,         // Passed back to React
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

        JobRequisition::create($validated);

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
                $table = (new JobRequisition)->getTable();
                $fieldRules[] = Rule::unique($table, $name)->ignore($record?->getKey());
            }

            $rules[$name] = $fieldRules;
        }

        return $rules;
    }

    private function findOrFail(string $id): JobRequisition
    {
        return JobRequisition::query()->findOrFail($id);
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
