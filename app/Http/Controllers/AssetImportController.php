<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetCategory;
use App\Models\AssetLocation;
use App\Models\AssetVendor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Reader\XLSX\Reader as XlsxReader;
use OpenSpout\Writer\XLSX\Writer as XlsxWriter;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AssetImportController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Assets/Import', [
            'template_url' => '/assets/import/template',
        ]);
    }

    public function template(): StreamedResponse
    {
        $headers = [
            'Asset Tag',
            'Name',
            'Category',
            'Serial Number',
            'Description',
            'Purchase Date (YYYY-MM-DD)',
            'Purchase Price',
            'Currency',
            'Vendor',
            'Warranty Expiry (YYYY-MM-DD)',
            'Warranty Notes',
            'Depreciation Method',
            'Useful Life Years',
            'Depreciation Rate %',
            'Salvage Value',
            'Book Value',
            'Location',
            'Status',
            'Condition',
            'Barcode',
            'Notes',
        ];

        $examples = [
            'AST-001',
            'Dell Latitude 5520',
            'Computers',
            'SN-123456',
            'Intel i5, 16GB RAM',
            '2024-01-15',
            '1200.00',
            'USD',
            'Dell Inc.',
            '2026-01-15',
            '3-year on-site warranty',
            'straight_line',
            '5',
            '20.00',
            '100.00',
            '900.00',
            'Head Office',
            'available',
            'new',
            '',
            '',
        ];

        $tmpPath = tempnam(sys_get_temp_dir(), 'assets_template_') . '.xlsx';

        $writer = new XlsxWriter();
        $writer->openToFile($tmpPath);

        $headerStyle = (new Style())->setFontBold();
        $writer->addRow(Row::fromValues($headers, $headerStyle));
        $writer->addRow(Row::fromValues($examples));

        $writer->close();

        return response()->streamDownload(function () use ($tmpPath) {
            readfile($tmpPath);
            @unlink($tmpPath);
        }, 'assets_import_template.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->getPathname();

        // Build lookup maps
        $categories = AssetCategory::query()
            ->select(['id', 'name'])
            ->get()
            ->keyBy(fn ($c) => strtolower(trim($c->name)));

        $vendors = AssetVendor::query()
            ->select(['id', 'name'])
            ->get()
            ->keyBy(fn ($v) => strtolower(trim($v->name)));

        $locations = AssetLocation::query()
            ->select(['id', 'name'])
            ->get()
            ->keyBy(fn ($l) => strtolower(trim($l->name)));

        $organizationId = auth()->user()?->current_organization_id;
        $userId = auth()->id();

        $imported = 0;
        $skipped = 0;
        $errors = [];
        $rowNumber = 0;

        $reader = new XlsxReader();
        $reader->open($path);

        foreach ($reader->getSheetIterator() as $sheet) {
            foreach ($sheet->getRowIterator() as $row) {
                $rowNumber++;

                // Skip header and example rows
                if ($rowNumber <= 2) {
                    continue;
                }

                $cells = $row->getCells();
                $values = array_map(fn ($cell) => trim((string) $cell->getValue()), $cells);

                // Pad to expected column count
                while (count($values) < 21) {
                    $values[] = '';
                }

                [
                    $assetTag, $name, $categoryName, $serialNumber, $description,
                    $purchaseDate, $purchasePrice, $currency, $vendorName,
                    $warrantyExpiry, $warrantyNotes, $depreciationMethod,
                    $usefulLifeYears, $depreciationRate, $salvageValue, $bookValue,
                    $locationName, $status, $condition, $barcode, $notes,
                ] = $values;

                // Skip blank rows
                if ($assetTag === '' && $name === '') {
                    continue;
                }

                // Validate required fields
                if ($assetTag === '' || $name === '') {
                    $errors[] = "Row {$rowNumber}: Asset Tag and Name are required.";
                    $skipped++;
                    continue;
                }

                // Resolve category (required)
                $category = $categories->get(strtolower($categoryName));
                if (! $category) {
                    $errors[] = "Row {$rowNumber}: Category \"{$categoryName}\" not found.";
                    $skipped++;
                    continue;
                }

                // Check duplicate asset tag within org
                if (Asset::query()->where('organization_id', $organizationId)->where('asset_tag', $assetTag)->exists()) {
                    $errors[] = "Row {$rowNumber}: Asset Tag \"{$assetTag}\" already exists.";
                    $skipped++;
                    continue;
                }

                $vendor = $vendorName !== '' ? $vendors->get(strtolower($vendorName)) : null;
                $location = $locationName !== '' ? $locations->get(strtolower($locationName)) : null;

                $resolvedStatus = in_array($status, Asset::STATUSES, true) ? $status : 'available';
                $resolvedCondition = in_array($condition, Asset::CONDITIONS, true) ? $condition : 'new';

                Asset::create([
                    'organization_id' => $organizationId,
                    'asset_tag' => $assetTag,
                    'name' => $name,
                    'asset_category_id' => $category->id,
                    'serial_number' => $serialNumber ?: null,
                    'description' => $description ?: null,
                    'purchase_date' => $this->parseDate($purchaseDate),
                    'purchase_price' => is_numeric($purchasePrice) ? $purchasePrice : null,
                    'currency' => $currency ?: 'USD',
                    'asset_vendor_id' => $vendor?->id,
                    'warranty_expiry_date' => $this->parseDate($warrantyExpiry),
                    'warranty_notes' => $warrantyNotes ?: null,
                    'depreciation_method' => in_array($depreciationMethod, Asset::DEPRECIATION_METHODS, true) ? $depreciationMethod : null,
                    'useful_life_years' => is_numeric($usefulLifeYears) ? (int) $usefulLifeYears : null,
                    'depreciation_rate' => is_numeric($depreciationRate) ? $depreciationRate : null,
                    'salvage_value' => is_numeric($salvageValue) ? $salvageValue : null,
                    'book_value' => is_numeric($bookValue) ? $bookValue : null,
                    'asset_location_id' => $location?->id,
                    'status' => $resolvedStatus,
                    'condition' => $resolvedCondition,
                    'barcode' => $barcode ?: null,
                    'notes' => $notes ?: null,
                    'created_by' => $userId,
                    'updated_by' => $userId,
                ]);

                $imported++;
            }

            // Only process first sheet
            break;
        }

        $reader->close();

        $message = "Import complete: {$imported} asset(s) imported, {$skipped} skipped.";

        return redirect('/assets')->with('success', $message)->with('import_errors', $errors);
    }

    private function parseDate(string $value): ?string
    {
        if ($value === '') {
            return null;
        }

        try {
            return \Carbon\Carbon::parse($value)->toDateString();
        } catch (\Throwable) {
            return null;
        }
    }
}
