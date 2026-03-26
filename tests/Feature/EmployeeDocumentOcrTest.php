<?php

use App\Jobs\ProcessOcrDocument;
use App\Models\Document;
use App\Models\Employee;
use App\Models\OcrResult;
use App\Models\Organization;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Services\Ocr\OcrClient;
use App\Services\Ocr\OcrParser;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function employeeOcrOrganization(): Organization
{
    return Organization::query()->firstOrCreate(
        ['slug' => 'employee-ocr-tenant'],
        [
            'name' => 'Employee OCR Tenant',
            'code' => 'EOCR',
            'status' => 'ACTIVE',
            'timezone' => 'Africa/Johannesburg',
        ],
    );
}

function grantEmployeeOcrPermissions(User $user, array $permissionNames, string $roleCode = 'HR_ADMIN'): Organization
{
    $permissionIds = collect($permissionNames)
        ->map(function (string $name) {
            $module = str($name)->before('.')->toString();

            return Permission::query()->firstOrCreate(
                ['name' => $name],
                [
                    'module' => $module,
                    'label' => str($name)->replace(['.', '_'], ' ')->headline()->toString(),
                    'description' => 'Generated for employee OCR feature coverage.',
                ],
            )->id;
        })
        ->all();

    $role = Role::query()->firstOrCreate(
        ['code' => $roleCode],
        [
            'name' => str($roleCode)->replace('_', ' ')->title()->toString(),
            'description' => 'Temporary role for employee OCR tests.',
        ],
    );

    $role->permissions()->sync($permissionIds);

    $organization = employeeOcrOrganization();

    $user->attachToOrganization($organization);
    $user->syncRoles([$role->id], $organization->id);
    $user->forceFill([
        'current_organization_id' => $organization->id,
    ])->saveQuietly();

    return $organization;
}

function createEmployeeForOcr(Organization $organization, array $attributes = [], ?User $user = null): Employee
{
    return Employee::query()->create(array_merge([
        'organization_id' => $organization->id,
        'user_id' => $user?->id,
        'staff_number' => 'EMP-'.fake()->unique()->numerify('####'),
        'first_name' => fake()->firstName(),
        'surname' => fake()->lastName(),
        'national_id' => fake()->unique()->numerify('##-######-A-##'),
        'gender' => 'Male',
        'marital_status' => 'Single',
        'status' => 'ACTIVE',
    ], $attributes));
}

function createDocumentTypeForOcr(Organization $organization, string $code = 'OCR_DOC'): int
{
    return DB::table('document_types')->insertGetId([
        'organization_id' => $organization->id,
        'code' => $code,
        'name' => 'OCR Document',
        'retention_policy' => '7 years',
        'sensitivity_level' => 'MEDIUM',
        'created_at' => now(),
        'updated_at' => now(),
    ]);
}

function createEmployeeDocumentForOcr(Employee $employee, array $attributes = []): Document
{
    $document = new Document();
    $document->forceFill(array_merge([
        'organization_id' => $employee->organization_id,
        'owner_employee_id' => $employee->id,
        'document_type_id' => createDocumentTypeForOcr(
            Organization::query()->findOrFail($employee->organization_id),
            'OCR_'.fake()->unique()->numerify('###'),
        ),
        'title' => 'Employee OCR Document',
        'file_uri' => 'documents/employees/'.$employee->id.'/ocr/sample.pdf',
        'access_policy' => 'internal',
        'metadata_json' => [
            'storage_disk' => 'local',
            'original_name' => 'sample.pdf',
            'mime_type' => 'application/pdf',
        ],
    ], $attributes));
    $document->save();

    return $document;
}

test('employee OCR upload stores privately and queues processing', function () {
    Storage::fake('local');
    Queue::fake();

    $viewer = User::factory()->create();
    $organization = grantEmployeeOcrPermissions($viewer, [
        'employees.view',
        'documents.create',
        'documents.view',
    ]);
    $this->actingAs($viewer);

    $employee = createEmployeeForOcr($organization, [
        'first_name' => 'Alicia',
        'surname' => 'Reader',
    ]);
    $documentTypeId = createDocumentTypeForOcr($organization);

    $this->post("/employees/{$employee->id}/documents", [
        'document_type_id' => $documentTypeId,
        'title' => 'Passport OCR',
        'file' => UploadedFile::fake()->create('passport.pdf', 48, 'application/pdf'),
        'access_policy' => 'internal',
        'process_ocr' => true,
        'language' => 'en',
        'engine' => 'paddleocr',
    ])->assertRedirect();

    $document = Document::query()->firstOrFail();

    expect($document->ocr_status)->toBe('queued');
    expect(data_get($document->metadata_json, 'storage_disk'))->toBe('local');

    Storage::disk('local')->assertExists($document->file_uri);
    Queue::assertPushed(ProcessOcrDocument::class, fn (ProcessOcrDocument $job) => $job->documentId === $document->id);
});

test('employee OCR pages render and employee show exposes OCR status', function () {
    $viewer = User::factory()->create();
    $organization = grantEmployeeOcrPermissions($viewer, [
        'employees.view',
        'documents.view',
    ]);
    $this->actingAs($viewer);

    $employee = createEmployeeForOcr($organization, [
        'first_name' => 'Betty',
        'surname' => 'Scanner',
    ]);
    $document = createEmployeeDocumentForOcr($employee, [
        'organization_id' => $organization->id,
        'title' => 'National ID OCR',
        'ocr_status' => 'completed',
        'ocr_engine' => 'paddleocr',
        'ocr_language' => 'en',
        'ocr_page_count' => 1,
        'ocr_avg_confidence' => 0.9645,
        'ocr_processed_at' => now(),
        'ocr_full_text' => 'Employee Name: Betty Scanner',
        'ocr_raw_json' => ['success' => true],
        'ocr_metadata_json' => ['processing_ms' => 1422],
    ]);

    OcrResult::query()->create([
        'organization_id' => $organization->id,
        'document_id' => $document->id,
        'page_number' => 1,
        'text' => 'Employee Name: Betty Scanner',
        'confidence' => 0.9645,
        'raw_json' => ['lines' => []],
    ]);

    $this->get("/employees/{$employee->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Show')
            ->where('employee.documents.0.ocr_status', 'completed')
            ->where('employee.documents.0.ocr_page_count', 1)
            ->where('employee.links.document_index', "/employees/{$employee->id}/documents"));

    $this->get("/employees/{$employee->id}/documents")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Documents/Index')
            ->where('stats.completed', 1));

    $this->get("/employees/{$employee->id}/documents/{$document->id}")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Documents/Show')
            ->where('document.ocr_status', 'completed')
            ->where('document.ocr_results.0.page_number', 1));

    $this->get("/employees/{$employee->id}/documents/{$document->id}/ocr")
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Employees/Documents/OcrResult')
            ->where('document.ocr_status', 'completed')
            ->where('document.ocr_full_text', 'Employee Name: Betty Scanner'));
});

test('failed OCR documents can be retried', function () {
    Queue::fake();

    $viewer = User::factory()->create();
    $organization = grantEmployeeOcrPermissions($viewer, [
        'employees.view',
        'documents.view',
        'documents.create',
    ]);
    $this->actingAs($viewer);

    $employee = createEmployeeForOcr($organization);
    $document = createEmployeeDocumentForOcr($employee, [
        'organization_id' => $organization->id,
        'ocr_status' => 'failed',
        'ocr_error_message' => 'OCR service timeout',
    ]);

    OcrResult::query()->create([
        'organization_id' => $organization->id,
        'document_id' => $document->id,
        'page_number' => 1,
        'text' => 'Old OCR result',
        'confidence' => 0.4,
        'raw_json' => ['stale' => true],
    ]);

    $this->post("/employees/{$employee->id}/documents/{$document->id}/ocr/retry")
        ->assertRedirect("/employees/{$employee->id}/documents/{$document->id}");

    $document->refresh();

    expect($document->ocr_status)->toBe('queued');
    expect($document->ocr_error_message)->toBeNull();
    expect($document->ocrResults()->count())->toBe(0);
    Queue::assertPushed(ProcessOcrDocument::class, fn (ProcessOcrDocument $job) => $job->documentId === $document->id);
});

test('employee scoped users cannot access another employees OCR documents', function () {
    $viewer = User::factory()->create();
    $organization = grantEmployeeOcrPermissions($viewer, [
        'employees.view',
        'documents.view',
    ], 'EMPLOYEE');
    $this->actingAs($viewer);

    $ownEmployee = createEmployeeForOcr($organization, ['user_id' => $viewer->id]);
    $targetEmployee = createEmployeeForOcr($organization, ['first_name' => 'Other']);
    $document = createEmployeeDocumentForOcr($targetEmployee, [
        'organization_id' => $organization->id,
        'ocr_status' => 'completed',
    ]);

    $this->get("/employees/{$targetEmployee->id}/documents")->assertNotFound();
    $this->get("/employees/{$targetEmployee->id}/documents/{$document->id}")->assertNotFound();
    $this->get("/employees/{$targetEmployee->id}/documents/{$document->id}/ocr")->assertNotFound();

    expect($ownEmployee->id)->not->toBe($targetEmployee->id);
});

test('process OCR document job persists OCR results on success', function () {
    Storage::fake('local');
    config()->set('services.ocr.url', 'https://ocr.test');
    config()->set('services.ocr.token', 'secret');

    $organization = employeeOcrOrganization();
    $employee = createEmployeeForOcr($organization);
    Storage::disk('local')->put('documents/employees/'.$employee->id.'/ocr/success.pdf', 'fake-pdf');

    $document = createEmployeeDocumentForOcr($employee, [
        'organization_id' => $organization->id,
        'file_uri' => 'documents/employees/'.$employee->id.'/ocr/success.pdf',
        'ocr_status' => 'queued',
    ]);

    Http::fake([
        'https://ocr.test/*' => Http::response([
            'success' => true,
            'engine' => 'paddleocr',
            'language' => 'en',
            'pages' => [
                [
                    'page' => 1,
                    'text' => 'Employee Name: Success',
                    'confidence' => 0.94,
                    'lines' => [
                        [
                            'text' => 'Employee Name: Success',
                            'confidence' => 0.97,
                            'bbox' => [12, 44, 380, 72],
                        ],
                    ],
                ],
            ],
            'full_text' => 'Employee Name: Success',
            'processing_ms' => 1834,
        ], 200),
    ]);

    $job = new ProcessOcrDocument($document->id);
    $job->handle(app(OcrClient::class), app(OcrParser::class));

    $document->refresh();

    expect($document->ocr_status)->toBe('completed');
    expect($document->ocr_page_count)->toBe(1);
    expect($document->ocr_full_text)->toBe('Employee Name: Success');
    expect($document->ocrResults()->count())->toBe(1);
});

test('process OCR document job records failure details', function () {
    Storage::fake('local');
    config()->set('services.ocr.url', 'https://ocr.test');
    config()->set('services.ocr.token', 'secret');

    $organization = employeeOcrOrganization();
    $employee = createEmployeeForOcr($organization);
    Storage::disk('local')->put('documents/employees/'.$employee->id.'/ocr/failure.pdf', 'fake-pdf');

    $document = createEmployeeDocumentForOcr($employee, [
        'organization_id' => $organization->id,
        'file_uri' => 'documents/employees/'.$employee->id.'/ocr/failure.pdf',
        'ocr_status' => 'queued',
    ]);

    Http::fake([
        'https://ocr.test/*' => Http::response([
            'message' => 'OCR engine unavailable',
        ], 500),
    ]);

    $job = new ProcessOcrDocument($document->id);

    try {
        $job->handle(app(OcrClient::class), app(OcrParser::class));
    } catch (Throwable $exception) {
        $job->failed($exception);
    }

    $document->refresh();

    expect($document->ocr_status)->toBe('failed');
    expect($document->ocr_error_message)->toContain('OCR engine unavailable');
});
