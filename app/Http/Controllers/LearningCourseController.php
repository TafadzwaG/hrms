<?php

namespace App\Http\Controllers;

use App\Models\LearningCourse;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LearningCourseController extends Controller
{
    private const MODULE_KEY = 'learning_courses';

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();
        $config = $this->moduleConfig();

        $query = LearningCourse::query();

        $searchable = Arr::get($config, 'searchable', []);
        if ($search !== '' && !empty($searchable)) {
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

        $records = $query
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Modules/Index', [
            'module' => $this->moduleMeta(),
            'records' => $records,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Modules/Form', [
            'module' => $this->moduleMeta(),
            'mode' => 'create',
            'record' => null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        LearningCourse::create($validated);

        return redirect()
            ->to('/' . Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name') . ' created successfully.');
    }

    public function show(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        return Inertia::render('Modules/Show', [
            'module' => $this->moduleMeta(),
            'record' => $record,
        ]);
    }

    public function edit(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));

        return Inertia::render('Modules/Form', [
            'module' => $this->moduleMeta(),
            'mode' => 'edit',
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
            ->to('/' . $slug . '/' . $record->id)
            ->with('success', Arr::get($this->moduleConfig(), 'name') . ' updated successfully.');
    }

    public function destroy(Request $request)
    {
        $record = $this->findOrFail($this->resolveRouteRecordId($request));
        $record->delete();

        return redirect()
            ->to('/' . Arr::get($this->moduleConfig(), 'slug'))
            ->with('success', Arr::get($this->moduleConfig(), 'name') . ' deleted successfully.');
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
        $config = config('hrms_modules.' . self::MODULE_KEY, []);

        if (!is_array($config) || empty($config)) {
            abort(500, 'Module configuration missing for key: ' . self::MODULE_KEY);
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
                $table = (new LearningCourse())->getTable();
                $fieldRules[] = Rule::unique($table, $name)->ignore($record?->getKey());
            }

            $rules[$name] = $fieldRules;
        }

        return $rules;
    }

    private function findOrFail(string $id): Model
    {
        return LearningCourse::query()->findOrFail($id);
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