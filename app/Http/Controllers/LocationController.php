<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $filters = [
            'search'  => $request->string('search')->toString(),
            'country' => $request->string('country')->toString(),
        ];

        $query = Location::query()
            ->withCount('orgUnits')
            ->orderBy('name');

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('city', 'like', "%{$s}%")
                  ->orWhere('country', 'like', "%{$s}%")
                  ->orWhere('timezone', 'like', "%{$s}%")
                  ->orWhere('address_line1', 'like', "%{$s}%")
                  ->orWhere('address_line2', 'like', "%{$s}%");
            });
        }

        if (!empty($filters['country'])) {
            $query->where('country', $filters['country']);
        }

        $locations = $query
            ->paginate(15)
            ->withQueryString()
            ->through(function (Location $l) {
                return [
                    'id' => $l->id,
                    'name' => $l->name,
                    'timezone' => $l->timezone,
                    'address_line1' => $l->address_line1,
                    'address_line2' => $l->address_line2,
                    'city' => $l->city,
                    'state' => $l->state,
                    'country' => $l->country,
                    'postal_code' => $l->postal_code,
                    'latitude' => $l->latitude,
                    'longitude' => $l->longitude,
                    'org_units_count' => $l->org_units_count ?? 0,
                    'created_at' => optional($l->created_at)->toDateTimeString(),
                    'updated_at' => optional($l->updated_at)->toDateTimeString(),
                ];
            });

        $countries = Location::query()
            ->whereNotNull('country')
            ->where('country', '!=', '')
            ->distinct()
            ->orderBy('country')
            ->pluck('country')
            ->values();

        return Inertia::render('Locations/Index', [
            'locations' => $locations,
            'filters' => $filters,
            'countries' => $countries,
        ]);
    }

    public function create()
    {
        return Inertia::render('Locations/Create');
    }

    public function store(Request $request)
    {
        $data = $this->validateLocation($request);

        $location = Location::create($data);

        return redirect()
            ->to("/locations/{$location->id}")
            ->with('success', 'Location created successfully.');
    }

    public function show(Location $location)
    {
        $location->load([
            'orgUnits:id,name,type',
        ]);

        return Inertia::render('Locations/Show', [
            'location' => [
                'id' => $location->id,
                'name' => $location->name,
                'timezone' => $location->timezone,
                'address_line1' => $location->address_line1,
                'address_line2' => $location->address_line2,
                'city' => $location->city,
                'state' => $location->state,
                'country' => $location->country,
                'postal_code' => $location->postal_code,
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,

                // Provide both list + count so your Show.tsx can use either
                'org_units_count' => $location->orgUnits->count(),
                'org_units' => $location->orgUnits->map(fn ($ou) => [
                    'id' => $ou->id,
                    'name' => $ou->name,
                    'type' => $ou->type,
                ])->values(),

                'created_at' => optional($location->created_at)->toDateTimeString(),
                'updated_at' => optional($location->updated_at)->toDateTimeString(),
            ],
        ]);
    }

    public function edit(Location $location)
    {
        return Inertia::render('Locations/Edit', [
            'location' => [
                'id' => $location->id,
                'name' => $location->name,
                'timezone' => $location->timezone,
                'address_line1' => $location->address_line1,
                'address_line2' => $location->address_line2,
                'city' => $location->city,
                'state' => $location->state,
                'country' => $location->country,
                'postal_code' => $location->postal_code,
                'latitude' => $location->latitude,
                'longitude' => $location->longitude,
            ],
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $data = $this->validateLocation($request);

        $location->update($data);

        return redirect()
            ->to("/locations/{$location->id}")
            ->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location)
    {
        if ($location->orgUnits()->exists()) {
            return back()->withErrors([
                'delete' => 'Cannot delete this location because it is linked to org units.',
            ]);
        }

        $location->delete();

        return redirect()
            ->to('/locations')
            ->with('success', 'Location deleted successfully.');
    }

    // ---------------------------
    // Upload / Import
    // ---------------------------

    public function upload()
    {
        return Inertia::render('Locations/Upload');
    }

    public function downloadTemplate(): StreamedResponse
    {
        $filename = 'locations_template.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () {
            $out = fopen('php://output', 'w');

            fputcsv($out, [
                'name',
                'timezone',
                'address_line1',
                'address_line2',
                'city',
                'state',
                'country',
                'postal_code',
                'latitude',
                'longitude',
            ]);

            // Example rows
            fputcsv($out, [
                'Harare HQ',
                'Africa/Harare',
                '123 Samora Machel Ave',
                '4th Floor',
                'Harare',
                '',
                'Zimbabwe',
                '',
                '-17.8252',
                '31.0335'
            ]);

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

            // Required columns
            foreach (['name', 'timezone'] as $col) {
                if (!array_key_exists($col, $idx)) {
                    fclose($handle);
                    throw new \RuntimeException("Missing required column: {$col}");
                }
            }

            while (($row = fgetcsv($handle)) !== false) {
                $name = trim($row[$idx['name']] ?? '');
                $timezone = trim($row[$idx['timezone']] ?? '');

                if ($name === '' || $timezone === '') {
                    $skipped++;
                    continue;
                }

                $payload = [
                    'name' => $name,
                    'timezone' => $timezone,
                    'address_line1' => trim($row[$idx['address_line1']] ?? '') ?: null,
                    'address_line2' => trim($row[$idx['address_line2']] ?? '') ?: null,
                    'city' => trim($row[$idx['city']] ?? '') ?: null,
                    'state' => trim($row[$idx['state']] ?? '') ?: null,
                    'country' => trim($row[$idx['country']] ?? '') ?: null,
                    'postal_code' => trim($row[$idx['postal_code']] ?? '') ?: null,
                    'latitude' => trim($row[$idx['latitude']] ?? '') ?: null,
                    'longitude' => trim($row[$idx['longitude']] ?? '') ?: null,
                ];

                // Upsert by name (recommended: make location name unique in your business rules)
                $existing = Location::where('name', $name)->first();
                if ($existing) {
                    $existing->update($payload);
                    $updated++;
                } else {
                    Location::create($payload);
                    $created++;
                }
            }

            fclose($handle);
        });

        return redirect()
            ->to('/locations')
            ->with('success', "Import completed. Created: {$created}, Updated: {$updated}, Skipped: {$skipped}.");
    }

    private function validateLocation(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'timezone' => ['required', 'string', 'max:64'],

            'address_line1' => ['nullable', 'string', 'max:255'],
            'address_line2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:128'],
            'state' => ['nullable', 'string', 'max:128'],
            'country' => ['nullable', 'string', 'max:128'],
            'postal_code' => ['nullable', 'string', 'max:32'],

            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
        ]);
    }
}