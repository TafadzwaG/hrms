<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\JobRequisition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CandidateProfileController extends Controller
{
    private const MODULE_KEY = 'candidate_profiles';

    private const PAGE_ROOT = 'CandidateProfiles';

    public function index(Request $request)
    {
        $search = $request->string('search')->toString();

        $query = CandidateProfile::query()
            ->with('requisition');

        if ($search !== '') {
            $query->where(function (Builder $builder) use ($search) {
                $builder
                    ->where('requisition_code', 'like', "%{$search}%")
                    ->orWhere('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('stage', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('requisition', function (Builder $requisitionQuery) use ($search) {
                        $requisitionQuery
                            ->where('requisition_code', 'like', "%{$search}%")
                            ->orWhere('title', 'like', "%{$search}%")
                            ->orWhere('department', 'like', "%{$search}%")
                            ->orWhere('hiring_manager', 'like', "%{$search}%");
                    });
            });
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
            ],
        ]);
    }

    public function create(Request $request)
    {
        $selectedRequisitionCode = $request->string('requisition_code')->toString();

        return Inertia::render(self::PAGE_ROOT.'/Create', [
            'module' => $this->moduleMeta(),
            'record' => null,
            'requisitions' => $this->requisitionOptions(),
            'selected_requisition_code' => $selectedRequisitionCode !== '' ? $selectedRequisitionCode : null,
            'stages' => $this->candidateStages(),
            'statuses' => $this->candidateStatuses(),
        ]);
    }

    public function createForRequisition(JobRequisition $jobRequisition)
    {
        return Inertia::render(self::PAGE_ROOT.'/Create', [
            'module' => $this->moduleMeta(),
            'record' => null,
            'requisitions' => $this->requisitionOptions(),
            'selected_requisition_code' => $jobRequisition->requisition_code,
            'stages' => $this->candidateStages(),
            'statuses' => $this->candidateStatuses(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->validationRules());

        $candidate = CandidateProfile::create($validated);

        return redirect()
            ->to('/'.Arr::get($this->moduleConfig(), 'slug').'/'.$candidate->id)
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
            'requisitions' => $this->requisitionOptions(),
            'selected_requisition_code' => $record->requisition_code,
            'stages' => $this->candidateStages(),
            'statuses' => $this->candidateStatuses(),
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

            if ($name === 'requisition_code') {
                $fieldRules[] = Rule::exists((new JobRequisition)->getTable(), 'requisition_code');
            }

            if (($field['unique'] ?? false) === true) {
                $table = (new CandidateProfile)->getTable();
                $fieldRules[] = Rule::unique($table, $name)->ignore($record?->getKey());
            }

            $rules[$name] = $fieldRules;
        }

        return $rules;
    }

    private function findOrFail(string $id): CandidateProfile
    {
        return CandidateProfile::query()
            ->with('requisition')
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

    private function requisitionOptions(): array
    {
        return JobRequisition::query()
            ->orderByDesc('id')
            ->get(['id', 'requisition_code', 'title', 'department', 'status', 'hiring_manager'])
            ->map(function (JobRequisition $requisition) {
                return [
                    'id' => $requisition->id,
                    'requisition_code' => $requisition->requisition_code,
                    'title' => $requisition->title,
                    'department' => $requisition->department,
                    'status' => $requisition->status,
                    'hiring_manager' => $requisition->hiring_manager,
                    'label' => $requisition->requisition_code.' - '.$requisition->title,
                ];
            })
            ->values()
            ->all();
    }

    private function candidateStages(): array
    {
        return [
            'Applied',
            'Screening',
            'Interview',
            'Assessment',
            'Offer',
            'Hired',
            'Rejected',
        ];
    }

    private function candidateStatuses(): array
    {
        return [
            'Active',
            'On Hold',
            'Shortlisted',
            'Rejected',
            'Hired',
            'Withdrawn',
        ];
    }
}
