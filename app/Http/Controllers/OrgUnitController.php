<?php

namespace App\Http\Controllers;

use App\Models\OrgUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrgUnitController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'type'   => $request->string('type')->toString(),
        ];

        $query = OrgUnit::query()
            ->with(['parent:id,name,type'])
            ->withCount('children')
            ->orderBy('type')
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('code', 'like', "%{$s}%")
                  ->orWhere('cost_center', 'like', "%{$s}%");
            });
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        $orgUnits = $query->paginate(15)->withQueryString()->through(function (OrgUnit $ou) {
            return [
                'id' => $ou->id,
                'name' => $ou->name,
                'type' => $ou->type,
                'code' => $ou->code,
                'cost_center' => $ou->cost_center,
                'effective_from' => optional($ou->effective_from)->toDateString(),
                'effective_to' => optional($ou->effective_to)->toDateString(),
                'parent' => $ou->parent ? [
                    'id' => $ou->parent->id,
                    'name' => $ou->parent->name,
                    'type' => $ou->parent->type,
                ] : null,
                'children_count' => $ou->children_count,
                'created_at' => optional($ou->created_at)->toDateTimeString(),
            ];
        });

        return Inertia::render('OrgUnits/Index', [
            'orgUnits' => $orgUnits,
            'filters' => $filters,
            'types' => OrgUnit::TYPES,
        ]);
    }

    public function create()
    {
        $parents = OrgUnit::query()
            ->select(['id', 'name', 'type'])
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        return Inertia::render('OrgUnits/Create', [
            'parents' => $parents,
            'types' => OrgUnit::TYPES,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validateOrgUnit($request);

        // Prevent self-parenting (not possible on create, but safe)
        if (!empty($data['parent_id']) && (int)$data['parent_id'] === 0) {
            $data['parent_id'] = null;
        }

        $orgUnit = OrgUnit::create($data);

        return redirect()
            ->route('org-units.show', $orgUnit->id)
            ->with('success', 'Organization unit created successfully.');
    }

    public function show(OrgUnit $orgUnit)
    {
        $orgUnit->load([
            'parent:id,name,type',
            'children:id,name,type,parent_id,code,cost_center,effective_from,effective_to',
            'locations:id,name,timezone',
        ]);

        return Inertia::render('OrgUnits/Show', [
            'orgUnit' => [
                'id' => $orgUnit->id,
                'name' => $orgUnit->name,
                'type' => $orgUnit->type,
                'code' => $orgUnit->code,
                'cost_center' => $orgUnit->cost_center,
                'effective_from' => optional($orgUnit->effective_from)->toDateString(),
                'effective_to' => optional($orgUnit->effective_to)->toDateString(),
                'parent' => $orgUnit->parent ? [
                    'id' => $orgUnit->parent->id,
                    'name' => $orgUnit->parent->name,
                    'type' => $orgUnit->parent->type,
                ] : null,
                'children' => $orgUnit->children->map(fn ($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'type' => $c->type,
                    'code' => $c->code,
                ])->values(),
                'locations' => $orgUnit->locations->map(fn ($l) => [
                    'id' => $l->id,
                    'name' => $l->name,
                    'timezone' => $l->timezone,
                    'pivot' => [
                        'is_primary' => (bool)($l->pivot->is_primary ?? false),
                        'effective_from' => $l->pivot->effective_from ?? null,
                        'effective_to' => $l->pivot->effective_to ?? null,
                    ],
                ])->values(),
                'created_at' => optional($orgUnit->created_at)->toDateTimeString(),
                'updated_at' => optional($orgUnit->updated_at)->toDateTimeString(),
            ],
            'types' => OrgUnit::TYPES,
        ]);
    }

    public function edit(OrgUnit $orgUnit)
    {
        $parents = OrgUnit::query()
            ->select(['id', 'name', 'type'])
            ->where('id', '!=', $orgUnit->id)
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        return Inertia::render('OrgUnits/Edit', [
            'orgUnit' => [
                'id' => $orgUnit->id,
                'name' => $orgUnit->name,
                'type' => $orgUnit->type,
                'parent_id' => $orgUnit->parent_id,
                'code' => $orgUnit->code,
                'cost_center' => $orgUnit->cost_center,
                'effective_from' => optional($orgUnit->effective_from)->toDateString(),
                'effective_to' => optional($orgUnit->effective_to)->toDateString(),
            ],
            'parents' => $parents,
            'types' => OrgUnit::TYPES,
        ]);
    }

    public function update(Request $request, OrgUnit $orgUnit)
    {
        $data = $this->validateOrgUnit($request, $orgUnit->id);

        if (!empty($data['parent_id']) && (int)$data['parent_id'] === $orgUnit->id) {
            return back()->withErrors(['parent_id' => 'An org unit cannot be its own parent.']);
        }

        $orgUnit->update($data);

        return redirect()
            ->route('org-units.show', $orgUnit->id)
            ->with('success', 'Organization unit updated successfully.');
    }

    public function destroy(OrgUnit $orgUnit)
    {
        $childCount = $orgUnit->children()->count();
        if ($childCount > 0) {
            return back()->withErrors([
                'delete' => 'Cannot delete this org unit because it has child units. Move/delete children first.',
            ]);
        }

        $orgUnit->delete();

        return redirect()
            ->route('org-units.index')
            ->with('success', 'Organization unit deleted successfully.');
    }

    // ---------------------------
    // Upload / Import
    // ---------------------------

    public function upload()
    {
        return Inertia::render('OrgUnits/Upload', [
            'types' => OrgUnit::TYPES,
        ]);
    }

    public function downloadTemplate(): StreamedResponse
    {
        $filename = 'org_units_template.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () {
            $out = fopen('php://output', 'w');

            // Template columns
            fputcsv($out, [
                'name',
                'type',         // COMPANY | SBU | DEPARTMENT | TEAM
                'parent_code',  // optional: code of the parent org unit
                'code',         // optional unique code for this org unit
                'cost_center',  // optional
                'effective_from', // optional YYYY-MM-DD
                'effective_to',   // optional YYYY-MM-DD
            ]);

            // Example rows
            fputcsv($out, ['Providence Human Capital', 'COMPANY', '', 'PROV-HC', '', '', '']);
            fputcsv($out, ['ProCanteen', 'SBU', 'PROV-HC', 'PROC', '', '', '']);
            fputcsv($out, ['IT', 'DEPARTMENT', 'PROC', 'PROC-IT', '', '', '']);

            fclose($out);
        }, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();

        $created = 0;
        $updated = 0;
        $skipped = 0;

        DB::transaction(function () use ($path, &$created, &$updated, &$skipped) {
            $handle = fopen($path, 'r');
            if ($handle === false) {
                throw new \RuntimeException('Failed to open uploaded file.');
            }

            $header = fgetcsv($handle);
            if (!$header) {
                fclose($handle);
                throw new \RuntimeException('CSV file is empty.');
            }

            $header = array_map(fn ($h) => Str::of($h)->trim()->lower()->toString(), $header);

            $required = ['name', 'type'];
            foreach ($required as $col) {
                if (!in_array($col, $header, true)) {
                    fclose($handle);
                    throw new \RuntimeException("Missing required column: {$col}");
                }
            }

            $idx = array_flip($header);

            while (($row = fgetcsv($handle)) !== false) {
                $name = trim($row[$idx['name']] ?? '');
                $type = strtoupper(trim($row[$idx['type']] ?? ''));

                if ($name === '' || $type === '' || !in_array($type, OrgUnit::TYPES, true)) {
                    $skipped++;
                    continue;
                }

                $parentCode = trim($row[$idx['parent_code']] ?? '');
                $code = trim($row[$idx['code']] ?? '');
                $costCenter = trim($row[$idx['cost_center']] ?? '');
                $effectiveFrom = trim($row[$idx['effective_from']] ?? '');
                $effectiveTo = trim($row[$idx['effective_to']] ?? '');

                $parentId = null;
                if ($parentCode !== '') {
                    $parentId = OrgUnit::where('code', $parentCode)->value('id');
                }

                $payload = [
                    'name' => $name,
                    'type' => $type,
                    'parent_id' => $parentId,
                    'code' => $code !== '' ? $code : null,
                    'cost_center' => $costCenter !== '' ? $costCenter : null,
                    'effective_from' => $effectiveFrom !== '' ? $effectiveFrom : null,
                    'effective_to' => $effectiveTo !== '' ? $effectiveTo : null,
                ];

                // Upsert rule:
                // - If code provided: upsert by code
                // - Else: upsert by (parent_id + name + type)
                if (!empty($payload['code'])) {
                    $existing = OrgUnit::where('code', $payload['code'])->first();
                    if ($existing) {
                        $existing->update($payload);
                        $updated++;
                    } else {
                        OrgUnit::create($payload);
                        $created++;
                    }
                } else {
                    $existing = OrgUnit::where('parent_id', $payload['parent_id'])
                        ->where('name', $payload['name'])
                        ->where('type', $payload['type'])
                        ->first();

                    if ($existing) {
                        $existing->update($payload);
                        $updated++;
                    } else {
                        OrgUnit::create($payload);
                        $created++;
                    }
                }
            }

            fclose($handle);
        });

        return redirect()
            ->route('org-units.index')
            ->with('success', "Import completed. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
    }

    private function validateOrgUnit(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(OrgUnit::TYPES)],
            'parent_id' => ['nullable', 'integer', 'exists:org_units,id'],
            'code' => [
                'nullable',
                'string',
                'max:64',
                $this->tenantUniqueRule('org_units', 'code', $ignoreId),
            ],
            'cost_center' => ['nullable', 'string', 'max:255'],
            'effective_from' => ['nullable', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],

            // Optional: enforce uniqueness under same parent + type
            // (matches the unique index if you used it)
            // This stops duplicates like two "IT" departments under the same SBU.
            'name_unique_guard' => [
                function ($attribute, $value, $fail) use ($request, $ignoreId) {
                    $q = OrgUnit::query()
                        ->where('name', $request->input('name'))
                        ->where('type', $request->input('type'))
                        ->where('parent_id', $request->input('parent_id'));

                    if ($ignoreId) {
                        $q->where('id', '!=', $ignoreId);
                    }

                    if ($q->exists()) {
                        $fail('An org unit with the same name/type already exists under the selected parent.');
                    }
                }
            ],
        ]);
    }
}
