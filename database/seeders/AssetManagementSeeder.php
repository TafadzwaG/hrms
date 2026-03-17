<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\AssetAssignment;
use App\Models\AssetCategory;
use App\Models\AssetDocument;
use App\Models\AssetLocation;
use App\Models\AssetMaintenanceRecord;
use App\Models\AssetStatusHistory;
use App\Models\AssetVendor;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AssetManagementSeeder extends Seeder
{
    public function run(): void
    {
        $faker = fake();

        $defaultOrganizationId = Schema::hasTable('organizations')
            ? DB::table('organizations')->orderBy('id')->value('id')
            : null;

        if (! $defaultOrganizationId) {
            $this->command?->warn('No organization found. Seed organizations first.');
            return;
        }

        $employees = Employee::query()
            ->where('organization_id', $defaultOrganizationId)
            ->where('status', 'ACTIVE')
            ->pluck('id')
            ->all();

        if (empty($employees)) {
            $this->command?->warn('No active employees found. Seed employees first.');
            return;
        }

        $adminUser = User::query()
            ->where('current_organization_id', $defaultOrganizationId)
            ->first();

        $adminUserId = $adminUser?->id;

        DB::transaction(function () use ($faker, $defaultOrganizationId, $employees, $adminUserId) {
            $now = now();

            // ── Asset Categories ──────────────────────────────────────
            $categories = $this->seedCategories($defaultOrganizationId, $now);
            $this->command?->info('Seeded ' . count($categories) . ' asset categories.');

            // ── Asset Vendors ─────────────────────────────────────────
            $vendors = $this->seedVendors($defaultOrganizationId, $faker, $now);
            $this->command?->info('Seeded ' . count($vendors) . ' asset vendors.');

            // ── Asset Locations ───────────────────────────────────────
            $locations = $this->seedLocations($defaultOrganizationId, $now);
            $this->command?->info('Seeded ' . count($locations) . ' asset locations.');

            // ── Assets ───────────────────────────────────────────────
            $assets = $this->seedAssets(
                $defaultOrganizationId,
                $categories,
                $vendors,
                $locations,
                $adminUserId,
                $faker,
                $now
            );
            $this->command?->info('Seeded ' . count($assets) . ' assets.');

            // ── Asset Assignments ────────────────────────────────────
            $assignedCount = $this->seedAssignments(
                $defaultOrganizationId,
                $assets,
                $employees,
                $adminUserId,
                $faker,
                $now
            );
            $this->command?->info('Created ' . $assignedCount . ' asset assignments.');

            // ── Maintenance Records ──────────────────────────────────
            $maintenanceCount = $this->seedMaintenanceRecords(
                $defaultOrganizationId,
                $assets,
                $vendors,
                $adminUserId,
                $faker,
                $now
            );
            $this->command?->info('Created ' . $maintenanceCount . ' maintenance records.');
        });

        $this->command?->info('AssetManagementSeeder completed successfully.');
    }

    // ── Categories ───────────────────────────────────────────────────

    private function seedCategories(int $organizationId, $now): array
    {
        $topLevel = [
            [
                'name' => 'IT Equipment',
                'code' => 'IT',
                'description' => 'Information technology hardware and peripherals',
                'depreciation_method' => 'straight_line',
                'useful_life_years' => 3,
                'depreciation_rate' => 33.3333,
                'children' => [
                    ['name' => 'Laptops', 'code' => 'IT-LAP', 'useful_life_years' => 3, 'depreciation_rate' => 33.3333],
                    ['name' => 'Desktops', 'code' => 'IT-DSK', 'useful_life_years' => 4, 'depreciation_rate' => 25.0000],
                    ['name' => 'Monitors', 'code' => 'IT-MON', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Printers', 'code' => 'IT-PRN', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Network Equipment', 'code' => 'IT-NET', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Servers', 'code' => 'IT-SRV', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                ],
            ],
            [
                'name' => 'Office Furniture',
                'code' => 'FUR',
                'description' => 'Office desks, chairs, cabinets, and fittings',
                'depreciation_method' => 'straight_line',
                'useful_life_years' => 10,
                'depreciation_rate' => 10.0000,
                'children' => [
                    ['name' => 'Desks', 'code' => 'FUR-DSK', 'useful_life_years' => 10, 'depreciation_rate' => 10.0000],
                    ['name' => 'Chairs', 'code' => 'FUR-CHR', 'useful_life_years' => 7, 'depreciation_rate' => 14.2857],
                    ['name' => 'Cabinets & Shelving', 'code' => 'FUR-CAB', 'useful_life_years' => 10, 'depreciation_rate' => 10.0000],
                    ['name' => 'Conference Tables', 'code' => 'FUR-CNF', 'useful_life_years' => 10, 'depreciation_rate' => 10.0000],
                ],
            ],
            [
                'name' => 'Vehicles',
                'code' => 'VEH',
                'description' => 'Company vehicles, motorcycles, and fleet',
                'depreciation_method' => 'declining_balance',
                'useful_life_years' => 5,
                'depreciation_rate' => 20.0000,
                'children' => [
                    ['name' => 'Sedans', 'code' => 'VEH-SED', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'SUVs & Trucks', 'code' => 'VEH-SUV', 'useful_life_years' => 6, 'depreciation_rate' => 16.6667],
                    ['name' => 'Motorcycles', 'code' => 'VEH-MOT', 'useful_life_years' => 4, 'depreciation_rate' => 25.0000],
                ],
            ],
            [
                'name' => 'Office Equipment',
                'code' => 'OEQ',
                'description' => 'General office equipment and appliances',
                'depreciation_method' => 'straight_line',
                'useful_life_years' => 5,
                'depreciation_rate' => 20.0000,
                'children' => [
                    ['name' => 'Projectors', 'code' => 'OEQ-PRJ', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Photocopiers', 'code' => 'OEQ-COP', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Air Conditioners', 'code' => 'OEQ-AC', 'useful_life_years' => 8, 'depreciation_rate' => 12.5000],
                    ['name' => 'Whiteboards & Displays', 'code' => 'OEQ-DSP', 'useful_life_years' => 7, 'depreciation_rate' => 14.2857],
                ],
            ],
            [
                'name' => 'Communication Equipment',
                'code' => 'COM',
                'description' => 'Phones, radios, and communication devices',
                'depreciation_method' => 'straight_line',
                'useful_life_years' => 3,
                'depreciation_rate' => 33.3333,
                'children' => [
                    ['name' => 'Desk Phones', 'code' => 'COM-DSK', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Mobile Phones', 'code' => 'COM-MOB', 'useful_life_years' => 2, 'depreciation_rate' => 50.0000],
                    ['name' => 'Two-Way Radios', 'code' => 'COM-RAD', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                ],
            ],
            [
                'name' => 'Safety & Security',
                'code' => 'SEC',
                'description' => 'Security cameras, alarms, fire equipment',
                'depreciation_method' => 'straight_line',
                'useful_life_years' => 7,
                'depreciation_rate' => 14.2857,
                'children' => [
                    ['name' => 'CCTV Cameras', 'code' => 'SEC-CAM', 'useful_life_years' => 5, 'depreciation_rate' => 20.0000],
                    ['name' => 'Fire Extinguishers', 'code' => 'SEC-FIR', 'useful_life_years' => 10, 'depreciation_rate' => 10.0000],
                    ['name' => 'Access Control Systems', 'code' => 'SEC-ACS', 'useful_life_years' => 7, 'depreciation_rate' => 14.2857],
                ],
            ],
        ];

        $categoryIds = [];

        foreach ($topLevel as $parent) {
            $children = $parent['children'] ?? [];
            unset($parent['children']);

            $parentCategory = AssetCategory::query()->updateOrCreate(
                ['organization_id' => $organizationId, 'code' => $parent['code']],
                array_merge($parent, [
                    'organization_id' => $organizationId,
                    'parent_id' => null,
                    'depreciation_method' => $parent['depreciation_method'] ?? 'straight_line',
                ])
            );

            $categoryIds[] = $parentCategory->id;

            foreach ($children as $child) {
                $childCategory = AssetCategory::query()->updateOrCreate(
                    ['organization_id' => $organizationId, 'code' => $child['code']],
                    [
                        'organization_id' => $organizationId,
                        'parent_id' => $parentCategory->id,
                        'name' => $child['name'],
                        'code' => $child['code'],
                        'description' => null,
                        'depreciation_method' => $parent['depreciation_method'] ?? 'straight_line',
                        'useful_life_years' => $child['useful_life_years'],
                        'depreciation_rate' => $child['depreciation_rate'],
                    ]
                );

                $categoryIds[] = $childCategory->id;
            }
        }

        return $categoryIds;
    }

    // ── Vendors ──────────────────────────────────────────────────────

    private function seedVendors(int $organizationId, $faker, $now): array
    {
        $vendorData = [
            ['name' => 'Computers Warehouse Zim', 'code' => 'CWZ', 'contact_person' => 'Tendai Moyo', 'email' => 'sales@cwz.co.zw', 'phone' => '+263 4 702 456'],
            ['name' => 'Office World Zimbabwe', 'code' => 'OWZ', 'contact_person' => 'Grace Mutasa', 'email' => 'orders@officeworld.co.zw', 'phone' => '+263 4 251 800'],
            ['name' => 'Zimoco (Pvt) Ltd', 'code' => 'ZIM', 'contact_person' => 'Peter Gumbo', 'email' => 'fleet@zimoco.co.zw', 'phone' => '+263 4 486 781'],
            ['name' => 'iStar Technologies', 'code' => 'IST', 'contact_person' => 'Blessing Chirume', 'email' => 'info@istar.co.zw', 'phone' => '+263 4 338 992'],
            ['name' => 'Safeguard Security Systems', 'code' => 'SSS', 'contact_person' => 'Moses Dube', 'email' => 'projects@safeguard.co.zw', 'phone' => '+263 4 756 100'],
            ['name' => 'Dell Technologies Africa', 'code' => 'DELL', 'contact_person' => 'Support Team', 'email' => 'support@dell.com', 'phone' => '+27 11 709 6000'],
            ['name' => 'HP Zimbabwe', 'code' => 'HPZ', 'contact_person' => 'Sales Desk', 'email' => 'zim.sales@hp.com', 'phone' => '+263 4 250 700'],
            ['name' => 'National Furniture Manufacturers', 'code' => 'NFM', 'contact_person' => 'James Sibanda', 'email' => 'sales@nfm.co.zw', 'phone' => '+263 9 881 234'],
        ];

        $vendorIds = [];

        foreach ($vendorData as $data) {
            $vendor = AssetVendor::query()->updateOrCreate(
                ['organization_id' => $organizationId, 'code' => $data['code']],
                array_merge($data, [
                    'organization_id' => $organizationId,
                    'address' => $faker->address(),
                    'website' => 'https://www.' . strtolower(str_replace(' ', '', $data['name'])) . '.co.zw',
                    'notes' => null,
                    'is_active' => true,
                ])
            );

            $vendorIds[] = $vendor->id;
        }

        return $vendorIds;
    }

    // ── Locations ────────────────────────────────────────────────────

    private function seedLocations(int $organizationId, $now): array
    {
        $locationData = [
            ['name' => 'Head Office - Main Building', 'code' => 'HQ-MAIN', 'building' => 'Main Building', 'floor' => 'Ground', 'room' => null, 'address' => '15 Samora Machel Ave, Harare'],
            ['name' => 'Head Office - IT Server Room', 'code' => 'HQ-SRVR', 'building' => 'Main Building', 'floor' => 'Basement', 'room' => 'B-01', 'address' => '15 Samora Machel Ave, Harare'],
            ['name' => 'Head Office - 1st Floor', 'code' => 'HQ-1F', 'building' => 'Main Building', 'floor' => '1st Floor', 'room' => null, 'address' => '15 Samora Machel Ave, Harare'],
            ['name' => 'Head Office - 2nd Floor', 'code' => 'HQ-2F', 'building' => 'Main Building', 'floor' => '2nd Floor', 'room' => null, 'address' => '15 Samora Machel Ave, Harare'],
            ['name' => 'Head Office - Boardroom', 'code' => 'HQ-BRD', 'building' => 'Main Building', 'floor' => '3rd Floor', 'room' => 'Boardroom A', 'address' => '15 Samora Machel Ave, Harare'],
            ['name' => 'Bulawayo Branch', 'code' => 'BYO-BR', 'building' => 'Bulawayo Office', 'floor' => 'Ground', 'room' => null, 'address' => '8 Fort Street, Bulawayo'],
            ['name' => 'Warehouse - Msasa', 'code' => 'WH-MSA', 'building' => 'Msasa Warehouse', 'floor' => 'Ground', 'room' => null, 'address' => '24 Seke Road, Msasa, Harare'],
            ['name' => 'Training Centre', 'code' => 'TRN-CTR', 'building' => 'Training Centre', 'floor' => 'Ground', 'room' => 'Lab 1', 'address' => '10 Enterprise Road, Harare'],
            ['name' => 'Vehicle Yard', 'code' => 'VEH-YRD', 'building' => null, 'floor' => null, 'room' => null, 'address' => '15 Samora Machel Ave, Harare (Rear Parking)'],
        ];

        $locationIds = [];

        foreach ($locationData as $data) {
            $location = AssetLocation::query()->updateOrCreate(
                ['organization_id' => $organizationId, 'code' => $data['code']],
                array_merge($data, [
                    'organization_id' => $organizationId,
                    'description' => null,
                    'is_active' => true,
                ])
            );

            $locationIds[] = $location->id;
        }

        return $locationIds;
    }

    // ── Assets ───────────────────────────────────────────────────────

    private function seedAssets(
        int   $organizationId,
        array $categoryIds,
        array $vendorIds,
        array $locationIds,
        ?int  $adminUserId,
        $faker,
        $now
    ): array {
        // Fetch child categories by code for realistic assignment
        $catByCode = AssetCategory::query()
            ->where('organization_id', $organizationId)
            ->pluck('id', 'code')
            ->all();

        $assetDefinitions = [
            // ── IT Equipment ──
            ['tag' => 'IT-LAP-001', 'name' => 'Dell Latitude 5540 Laptop', 'category' => 'IT-LAP', 'vendor' => 'DELL', 'price' => 1200.00, 'condition' => 'new', 'status' => 'available'],
            ['tag' => 'IT-LAP-002', 'name' => 'Dell Latitude 5540 Laptop', 'category' => 'IT-LAP', 'vendor' => 'DELL', 'price' => 1200.00, 'condition' => 'new', 'status' => 'available'],
            ['tag' => 'IT-LAP-003', 'name' => 'HP EliteBook 840 G10', 'category' => 'IT-LAP', 'vendor' => 'HPZ', 'price' => 1350.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'IT-LAP-004', 'name' => 'HP EliteBook 840 G10', 'category' => 'IT-LAP', 'vendor' => 'HPZ', 'price' => 1350.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'IT-LAP-005', 'name' => 'Lenovo ThinkPad T14s', 'category' => 'IT-LAP', 'vendor' => 'CWZ', 'price' => 1150.00, 'condition' => 'fair', 'status' => 'in_maintenance'],
            ['tag' => 'IT-DSK-001', 'name' => 'Dell OptiPlex 7010 Desktop', 'category' => 'IT-DSK', 'vendor' => 'DELL', 'price' => 850.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'IT-DSK-002', 'name' => 'HP ProDesk 400 G9 Desktop', 'category' => 'IT-DSK', 'vendor' => 'HPZ', 'price' => 780.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'IT-MON-001', 'name' => 'Dell P2422H 24" Monitor', 'category' => 'IT-MON', 'vendor' => 'DELL', 'price' => 280.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'IT-MON-002', 'name' => 'Dell P2422H 24" Monitor', 'category' => 'IT-MON', 'vendor' => 'DELL', 'price' => 280.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'IT-MON-003', 'name' => 'HP E27 G5 27" Monitor', 'category' => 'IT-MON', 'vendor' => 'HPZ', 'price' => 350.00, 'condition' => 'new', 'status' => 'available'],
            ['tag' => 'IT-PRN-001', 'name' => 'HP LaserJet Pro MFP 4101fdn', 'category' => 'IT-PRN', 'vendor' => 'HPZ', 'price' => 520.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'IT-PRN-002', 'name' => 'Brother MFC-L5710DW', 'category' => 'IT-PRN', 'vendor' => 'CWZ', 'price' => 480.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'IT-NET-001', 'name' => 'Cisco Catalyst 2960 Switch', 'category' => 'IT-NET', 'vendor' => 'IST', 'price' => 2200.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'IT-SRV-001', 'name' => 'Dell PowerEdge R750xs Server', 'category' => 'IT-SRV', 'vendor' => 'DELL', 'price' => 8500.00, 'condition' => 'good', 'status' => 'available'],

            // ── Furniture ──
            ['tag' => 'FUR-DSK-001', 'name' => 'Executive L-Shape Desk', 'category' => 'FUR-DSK', 'vendor' => 'NFM', 'price' => 450.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'FUR-DSK-002', 'name' => 'Standard Office Desk 1.2m', 'category' => 'FUR-DSK', 'vendor' => 'NFM', 'price' => 220.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'FUR-DSK-003', 'name' => 'Standard Office Desk 1.2m', 'category' => 'FUR-DSK', 'vendor' => 'NFM', 'price' => 220.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'FUR-CHR-001', 'name' => 'Herman Miller Aeron Chair', 'category' => 'FUR-CHR', 'vendor' => 'OWZ', 'price' => 890.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'FUR-CHR-002', 'name' => 'Ergonomic Task Chair', 'category' => 'FUR-CHR', 'vendor' => 'OWZ', 'price' => 320.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'FUR-CHR-003', 'name' => 'Ergonomic Task Chair', 'category' => 'FUR-CHR', 'vendor' => 'OWZ', 'price' => 320.00, 'condition' => 'fair', 'status' => 'available'],
            ['tag' => 'FUR-CAB-001', 'name' => '4-Drawer Filing Cabinet', 'category' => 'FUR-CAB', 'vendor' => 'NFM', 'price' => 180.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'FUR-CNF-001', 'name' => 'Boardroom Table 12-Seater', 'category' => 'FUR-CNF', 'vendor' => 'NFM', 'price' => 1500.00, 'condition' => 'good', 'status' => 'available'],

            // ── Vehicles ──
            ['tag' => 'VEH-SED-001', 'name' => 'Toyota Corolla 2024 (AAH 1234)', 'category' => 'VEH-SED', 'vendor' => 'ZIM', 'price' => 28000.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'VEH-SUV-001', 'name' => 'Toyota Hilux D/Cab 2023 (AAJ 5678)', 'category' => 'VEH-SUV', 'vendor' => 'ZIM', 'price' => 45000.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'VEH-SUV-002', 'name' => 'Isuzu D-Max 2022 (ABM 9012)', 'category' => 'VEH-SUV', 'vendor' => 'ZIM', 'price' => 38000.00, 'condition' => 'fair', 'status' => 'in_maintenance'],
            ['tag' => 'VEH-MOT-001', 'name' => 'Honda CRF250 Motorcycle', 'category' => 'VEH-MOT', 'vendor' => 'ZIM', 'price' => 4500.00, 'condition' => 'good', 'status' => 'available'],

            // ── Office Equipment ──
            ['tag' => 'OEQ-PRJ-001', 'name' => 'Epson EB-FH52 Projector', 'category' => 'OEQ-PRJ', 'vendor' => 'CWZ', 'price' => 780.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'OEQ-COP-001', 'name' => 'Konica Minolta BizHub C300i', 'category' => 'OEQ-COP', 'vendor' => 'OWZ', 'price' => 4200.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'OEQ-AC-001', 'name' => 'Samsung 18000BTU Split AC', 'category' => 'OEQ-AC', 'vendor' => 'IST', 'price' => 950.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'OEQ-AC-002', 'name' => 'Samsung 24000BTU Split AC', 'category' => 'OEQ-AC', 'vendor' => 'IST', 'price' => 1200.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'OEQ-DSP-001', 'name' => '75" Samsung Smart Display', 'category' => 'OEQ-DSP', 'vendor' => 'CWZ', 'price' => 1800.00, 'condition' => 'new', 'status' => 'available'],

            // ── Communication ──
            ['tag' => 'COM-MOB-001', 'name' => 'Samsung Galaxy A54 5G', 'category' => 'COM-MOB', 'vendor' => 'IST', 'price' => 380.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'COM-MOB-002', 'name' => 'Samsung Galaxy A54 5G', 'category' => 'COM-MOB', 'vendor' => 'IST', 'price' => 380.00, 'condition' => 'good', 'status' => 'assigned'],
            ['tag' => 'COM-DSK-001', 'name' => 'Yealink T54W IP Phone', 'category' => 'COM-DSK', 'vendor' => 'IST', 'price' => 250.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'COM-RAD-001', 'name' => 'Motorola Talkabout T82 Radio Set', 'category' => 'COM-RAD', 'vendor' => 'SSS', 'price' => 120.00, 'condition' => 'good', 'status' => 'available'],

            // ── Security ──
            ['tag' => 'SEC-CAM-001', 'name' => 'Hikvision DS-2CD2143G2 4MP Camera', 'category' => 'SEC-CAM', 'vendor' => 'SSS', 'price' => 180.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'SEC-CAM-002', 'name' => 'Hikvision DS-2CD2143G2 4MP Camera', 'category' => 'SEC-CAM', 'vendor' => 'SSS', 'price' => 180.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'SEC-FIR-001', 'name' => '9kg DCP Fire Extinguisher', 'category' => 'SEC-FIR', 'vendor' => 'SSS', 'price' => 65.00, 'condition' => 'good', 'status' => 'available'],
            ['tag' => 'SEC-ACS-001', 'name' => 'ZKTeco ProFace X Biometric', 'category' => 'SEC-ACS', 'vendor' => 'SSS', 'price' => 650.00, 'condition' => 'good', 'status' => 'available'],

            // ── Retired / Disposed ──
            ['tag' => 'IT-LAP-R01', 'name' => 'Dell Latitude 5520 (Retired)', 'category' => 'IT-LAP', 'vendor' => 'DELL', 'price' => 900.00, 'condition' => 'poor', 'status' => 'retired'],
            ['tag' => 'IT-PRN-R01', 'name' => 'HP LaserJet Pro M404 (Disposed)', 'category' => 'IT-PRN', 'vendor' => 'HPZ', 'price' => 350.00, 'condition' => 'non_functional', 'status' => 'disposed'],
            ['tag' => 'FUR-CHR-R01', 'name' => 'Old Task Chair (Disposed)', 'category' => 'FUR-CHR', 'vendor' => 'OWZ', 'price' => 150.00, 'condition' => 'non_functional', 'status' => 'disposed'],
        ];

        $vendorByCode = AssetVendor::query()
            ->where('organization_id', $organizationId)
            ->pluck('id', 'code')
            ->all();

        $assetIds = [];

        foreach ($assetDefinitions as $def) {
            $categoryId = $catByCode[$def['category']] ?? $categoryIds[0];
            $vendorId = $vendorByCode[$def['vendor']] ?? null;
            $locationId = $locationIds[array_rand($locationIds)];

            $purchaseDate = $faker->dateTimeBetween('-3 years', '-1 month');
            $warrantyYears = in_array($def['status'], ['retired', 'disposed']) ? 1 : $faker->numberBetween(1, 3);
            $warrantyExpiry = (clone $purchaseDate)->modify("+{$warrantyYears} years");

            $category = AssetCategory::find($categoryId);
            $usefulLife = $category?->useful_life_years ?? 5;
            $depRate = $category?->depreciation_rate ?? 20.0000;
            $salvage = round($def['price'] * 0.1, 2);

            // Calculate simple book value based on age
            $ageYears = max(0, now()->diffInDays($purchaseDate) / 365);
            $annualDep = ($def['price'] - $salvage) / max($usefulLife, 1);
            $bookValue = max($salvage, round($def['price'] - ($annualDep * $ageYears), 2));

            $asset = Asset::withoutGlobalScopes()->updateOrCreate(
                ['organization_id' => $organizationId, 'asset_tag' => $def['tag']],
                [
                    'organization_id' => $organizationId,
                    'asset_category_id' => $categoryId,
                    'asset_vendor_id' => $vendorId,
                    'asset_location_id' => $locationId,
                    'asset_tag' => $def['tag'],
                    'serial_number' => strtoupper($faker->bothify('??##??##??')),
                    'name' => $def['name'],
                    'description' => null,
                    'status' => $def['status'],
                    'condition' => $def['condition'],
                    'purchase_date' => $purchaseDate->format('Y-m-d'),
                    'purchase_price' => $def['price'],
                    'currency' => 'USD',
                    'warranty_expiry_date' => $warrantyExpiry->format('Y-m-d'),
                    'warranty_notes' => null,
                    'depreciation_method' => $category?->depreciation_method ?? 'straight_line',
                    'useful_life_years' => $usefulLife,
                    'depreciation_rate' => $depRate,
                    'salvage_value' => $salvage,
                    'book_value' => $bookValue,
                    'barcode' => null,
                    'image_path' => null,
                    'notes' => null,
                    'metadata' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ]
            );

            $assetIds[] = $asset->id;

            // Create initial status history entry
            AssetStatusHistory::query()->updateOrCreate(
                ['asset_id' => $asset->id, 'to_status' => 'available', 'from_status' => null],
                [
                    'asset_id' => $asset->id,
                    'from_status' => null,
                    'to_status' => 'available',
                    'reason' => 'Asset registered',
                    'changed_by' => $adminUserId,
                ]
            );

            // Add extra status history for non-available assets
            if ($def['status'] !== 'available') {
                AssetStatusHistory::query()->firstOrCreate(
                    ['asset_id' => $asset->id, 'to_status' => $def['status']],
                    [
                        'asset_id' => $asset->id,
                        'from_status' => 'available',
                        'to_status' => $def['status'],
                        'reason' => match ($def['status']) {
                            'assigned' => 'Assigned to employee',
                            'in_maintenance' => 'Sent for maintenance',
                            'retired' => 'End of useful life',
                            'disposed' => 'Disposed of - non-functional',
                            default => 'Status change',
                        },
                        'changed_by' => $adminUserId,
                    ]
                );
            }
        }

        return $assetIds;
    }

    // ── Assignments ──────────────────────────────────────────────────

    private function seedAssignments(
        int   $organizationId,
        array $assetIds,
        array $employeeIds,
        ?int  $adminUserId,
        $faker,
        $now
    ): int {
        $assignedAssets = Asset::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->where('status', 'assigned')
            ->get();

        $count = 0;
        $empIndex = 0;

        foreach ($assignedAssets as $asset) {
            $employeeId = $employeeIds[$empIndex % count($employeeIds)];
            $empIndex++;

            $assignedAt = $faker->dateTimeBetween('-2 years', '-1 month');

            AssetAssignment::query()->firstOrCreate(
                ['asset_id' => $asset->id, 'status' => 'active'],
                [
                    'organization_id' => $organizationId,
                    'asset_id' => $asset->id,
                    'employee_id' => $employeeId,
                    'assigned_by' => $adminUserId,
                    'returned_to' => null,
                    'assigned_at' => $assignedAt,
                    'expected_return_date' => (clone $assignedAt)->modify('+1 year')->format('Y-m-d'),
                    'returned_at' => null,
                    'condition_on_assignment' => $asset->condition,
                    'condition_on_return' => null,
                    'notes' => 'Assigned for daily use',
                    'return_notes' => null,
                    'status' => 'active',
                ]
            );

            $count++;
        }

        // Also create some historical (returned) assignments
        $availableAssets = Asset::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->where('status', 'available')
            ->inRandomOrder()
            ->limit(5)
            ->get();

        foreach ($availableAssets as $asset) {
            $employeeId = $employeeIds[array_rand($employeeIds)];
            $assignedAt = $faker->dateTimeBetween('-3 years', '-6 months');
            $returnedAt = $faker->dateTimeBetween($assignedAt, '-1 month');

            AssetAssignment::query()->firstOrCreate(
                ['asset_id' => $asset->id, 'status' => 'returned'],
                [
                    'organization_id' => $organizationId,
                    'asset_id' => $asset->id,
                    'employee_id' => $employeeId,
                    'assigned_by' => $adminUserId,
                    'returned_to' => $adminUserId,
                    'assigned_at' => $assignedAt,
                    'expected_return_date' => null,
                    'returned_at' => $returnedAt,
                    'condition_on_assignment' => 'good',
                    'condition_on_return' => $asset->condition,
                    'notes' => 'Previous assignment',
                    'return_notes' => 'Returned in good condition',
                    'status' => 'returned',
                ]
            );

            $count++;
        }

        return $count;
    }

    // ── Maintenance Records ──────────────────────────────────────────

    private function seedMaintenanceRecords(
        int   $organizationId,
        array $assetIds,
        array $vendorIds,
        ?int  $adminUserId,
        $faker,
        $now
    ): int {
        $maintenanceAssets = Asset::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->where('status', 'in_maintenance')
            ->get();

        $count = 0;

        // Active maintenance for in_maintenance assets
        foreach ($maintenanceAssets as $asset) {
            AssetMaintenanceRecord::query()->firstOrCreate(
                ['asset_id' => $asset->id, 'status' => 'in_progress'],
                [
                    'organization_id' => $organizationId,
                    'asset_id' => $asset->id,
                    'maintenance_type' => $faker->randomElement(['corrective', 'preventive']),
                    'title' => 'Ongoing maintenance - ' . $asset->name,
                    'description' => 'Repair and diagnostic work in progress.',
                    'vendor_id' => !empty($vendorIds) ? $vendorIds[array_rand($vendorIds)] : null,
                    'performed_by' => $faker->name(),
                    'cost' => $faker->randomFloat(2, 50, 500),
                    'currency' => 'USD',
                    'scheduled_date' => $faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
                    'started_at' => $faker->dateTimeBetween('-2 weeks', 'now'),
                    'completed_at' => null,
                    'next_maintenance_date' => $faker->dateTimeBetween('+3 months', '+6 months')->format('Y-m-d'),
                    'status' => 'in_progress',
                    'notes' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ]
            );

            $count++;
        }

        // Completed maintenance for some random assets
        $randomAssets = Asset::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->whereIn('status', ['available', 'assigned'])
            ->inRandomOrder()
            ->limit(8)
            ->get();

        foreach ($randomAssets as $asset) {
            $scheduledDate = $faker->dateTimeBetween('-6 months', '-1 month');
            $startedAt = (clone $scheduledDate)->modify('+' . $faker->numberBetween(0, 3) . ' days');
            $completedAt = (clone $startedAt)->modify('+' . $faker->numberBetween(1, 7) . ' days');

            AssetMaintenanceRecord::query()->firstOrCreate(
                ['asset_id' => $asset->id, 'status' => 'completed'],
                [
                    'organization_id' => $organizationId,
                    'asset_id' => $asset->id,
                    'maintenance_type' => $faker->randomElement(AssetMaintenanceRecord::TYPES),
                    'title' => $faker->randomElement([
                        'Routine inspection',
                        'Annual servicing',
                        'Preventive maintenance',
                        'Component replacement',
                        'Firmware update',
                        'Calibration check',
                        'Battery replacement',
                        'Deep cleaning',
                    ]) . ' - ' . $asset->name,
                    'description' => 'Completed without issues.',
                    'vendor_id' => !empty($vendorIds) ? $vendorIds[array_rand($vendorIds)] : null,
                    'performed_by' => $faker->name(),
                    'cost' => $faker->randomFloat(2, 25, 300),
                    'currency' => 'USD',
                    'scheduled_date' => $scheduledDate->format('Y-m-d'),
                    'started_at' => $startedAt,
                    'completed_at' => $completedAt,
                    'next_maintenance_date' => $faker->dateTimeBetween('+1 month', '+12 months')->format('Y-m-d'),
                    'status' => 'completed',
                    'notes' => 'All checks passed.',
                    'created_by' => $adminUserId,
                    'updated_by' => $adminUserId,
                ]
            );

            $count++;
        }

        // Scheduled (future) maintenance for a few assets
        $upcomingAssets = Asset::withoutGlobalScopes()
            ->where('organization_id', $organizationId)
            ->whereIn('status', ['available', 'assigned'])
            ->inRandomOrder()
            ->limit(4)
            ->get();

        foreach ($upcomingAssets as $asset) {
            AssetMaintenanceRecord::query()->firstOrCreate(
                ['asset_id' => $asset->id, 'status' => 'scheduled'],
                [
                    'organization_id' => $organizationId,
                    'asset_id' => $asset->id,
                    'maintenance_type' => 'preventive',
                    'title' => 'Scheduled preventive maintenance - ' . $asset->name,
                    'description' => 'Upcoming routine maintenance.',
                    'vendor_id' => !empty($vendorIds) ? $vendorIds[array_rand($vendorIds)] : null,
                    'performed_by' => null,
                    'cost' => null,
                    'currency' => 'USD',
                    'scheduled_date' => $faker->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
                    'started_at' => null,
                    'completed_at' => null,
                    'next_maintenance_date' => null,
                    'status' => 'scheduled',
                    'notes' => null,
                    'created_by' => $adminUserId,
                    'updated_by' => null,
                ]
            );

            $count++;
        }

        return $count;
    }
}
