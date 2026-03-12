<?php

namespace App\Http\Controllers;

use App\Models\OrgUnit;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PositionController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'department_id' => $request->string('department_id')->toString(),
            'status' => $request->string('status')->toString(), // all|active|inactive
        ];

        $query = Position::query()
            ->with(['orgUnit:id,name,type'])
            ->withCount('employees')
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('code', 'like', "%{$s}%")
                  ->orWhere('description', 'like', "%{$s}%");
            });
        }

        if (!empty($filters['department_id'])) {
            $query->where('org_unit_id', (int)$filters['department_id']);
        }

        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query->where('is_active', $filters['status'] === 'active');
        }

        $positions = $query->paginate(15)->withQueryString()->through(function (Position $p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'code' => $p->code,
                'description' => $p->description,
                'is_active' => (bool)$p->is_active,
                'employees_count' => $p->employees_count ?? 0,
                'org_unit' => $p->orgUnit ? [
                    'id' => $p->orgUnit->id,
                    'name' => $p->orgUnit->name,
                    'type' => $p->orgUnit->type,
                ] : null,
                'created_at' => optional($p->created_at)->toDateTimeString(),
                'updated_at' => optional($p->updated_at)->toDateTimeString(),
            ];
        });

        $departments = OrgUnit::query()
            ->select(['id','name','type'])
            ->where('type', 'DEPARTMENT')
            ->orderBy('name')
            ->get();

        return Inertia::render('Positions/Index', [
            'positions' => $positions,
            'filters' => $filters,
            'departments' => $departments,
        ]);
    }

    public function create()
    {
        $departments = OrgUnit::query()
            ->select(['id','name','type'])
            ->where('type', 'DEPARTMENT')
            ->orderBy('name')
            ->get();

        return Inertia::render('Positions/Create', [
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validatePosition($request);

        $position = Position::create($data);

        return redirect()
            ->to("/positions/{$position->id}")
            ->with('success', 'Position created successfully.');
    }

    public function show(Position $position)
    {
        $position->load([
            'orgUnit:id,name,type',
            'employees:id,first_name,surname,staff_number,position_id',
        ]);

        return Inertia::render('Positions/Show', [
            'position' => [
                'id' => $position->id,
                'name' => $position->name,
                'code' => $position->code,
                'description' => $position->description,
                'is_active' => (bool)$position->is_active,
                'org_unit' => $position->orgUnit ? [
                    'id' => $position->orgUnit->id,
                    'name' => $position->orgUnit->name,
                    'type' => $position->orgUnit->type,
                ] : null,
                'employees_count' => $position->employees->count(),
                'employees' => $position->employees->take(20)->map(fn ($e) => [
                    'id' => $e->id,
                    'staff_number' => $e->staff_number,
                    'full_name' => trim($e->first_name.' '.$e->surname),
                ])->values(),
                'created_at' => optional($position->created_at)->toDateTimeString(),
                'updated_at' => optional($position->updated_at)->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Position $position)
    {
        $departments = OrgUnit::query()
            ->select(['id','name','type'])
            ->where('type', 'DEPARTMENT')
            ->orderBy('name')
            ->get();

        return Inertia::render('Positions/Edit', [
            'position' => [
                'id' => $position->id,
                'name' => $position->name,
                'code' => $position->code,
                'description' => $position->description,
                'is_active' => (bool)$position->is_active,
                'org_unit_id' => $position->org_unit_id,
            ],
            'departments' => $departments,
        ]);
    }

    public function update(Request $request, Position $position)
    {
        $data = $this->validatePosition($request, $position->id);

        $position->update($data);

        return redirect()
            ->to("/positions/{$position->id}")
            ->with('success', 'Position updated successfully.');
    }

    public function destroy(Position $position)
    {
        if ($position->employees()->exists()) {
            return back()->withErrors([
                'delete' => 'Cannot delete this position because it is assigned to employees.',
            ]);
        }

        $position->delete();

        return redirect()
            ->to('/positions')
            ->with('success', 'Position deleted successfully.');
    }

    // ---------------------------
    // Upload / Import
    // ---------------------------

    public function upload()
    {
        return Inertia::render('Positions/Upload');
    }

    public function downloadTemplate(): StreamedResponse
    {
        $filename = 'positions_template.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () {
            $out = fopen('php://output', 'w');

            fputcsv($out, [
                'name',           // required
                'code',           // optional unique
                'org_unit_id',    // optional (department id)
                'description',    // optional
                'is_active',      // optional 1/0
            ]);

            // Example row (org_unit_id left blank on purpose)
            fputcsv($out, ['Software Developer', 'IT-DEV', '', 'Build and maintain systems', 1]);

            fclose($out);
        }, 200, $headers);
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $path = $request->file('file')->getRealPath();

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
            $idx = array_flip($header);

            foreach (['name'] as $col) {
                if (!array_key_exists($col, $idx)) {
                    fclose($handle);
                    throw new \RuntimeException("Missing required column: {$col}");
                }
            }

            while (($row = fgetcsv($handle)) !== false) {
                $name = trim($row[$idx['name']] ?? '');
                if ($name === '') {
                    $skipped++;
                    continue;
                }

                $code = trim($row[$idx['code']] ?? '') ?: null;
                $orgUnitIdRaw = trim($row[$idx['org_unit_id']] ?? '');
                $orgUnitId = $orgUnitIdRaw !== '' ? (int)$orgUnitIdRaw : null;

                // if provided, ensure it exists
                if ($orgUnitId && !OrgUnit::whereKey($orgUnitId)->exists()) {
                    $orgUnitId = null; // safe fallback
                }

                $description = trim($row[$idx['description']] ?? '') ?: null;
                $isActiveRaw = trim($row[$idx['is_active']] ?? '');
                $isActive = $isActiveRaw === '' ? true : (bool)((int)$isActiveRaw);

                $payload = [
                    'name' => $name,
                    'code' => $code,
                    'org_unit_id' => $orgUnitId,
                    'description' => $description,
                    'is_active' => $isActive,
                ];

                // Upsert rule:
                // - if code provided -> upsert by code
                // - else -> upsert by (name + org_unit_id)
                if ($code) {
                    $existing = Position::where('code', $code)->first();
                    if ($existing) {
                        $existing->update($payload);
                        $updated++;
                    } else {
                        Position::create($payload);
                        $created++;
                    }
                } else {
                    $existing = Position::where('name', $name)
                        ->where('org_unit_id', $orgUnitId)
                        ->first();

                    if ($existing) {
                        $existing->update($payload);
                        $updated++;
                    } else {
                        Position::create($payload);
                        $created++;
                    }
                }
            }

            fclose($handle);
        });

        return redirect()
            ->to('/positions')
            ->with('success', "Import completed. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
    }

    private function validatePosition(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:128'],
            'code' => ['nullable', 'string', 'max:64', 'unique:positions,code' . ($ignoreId ? ',' . $ignoreId : '')],
            'org_unit_id' => ['nullable', 'integer', 'exists:org_units,id'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}