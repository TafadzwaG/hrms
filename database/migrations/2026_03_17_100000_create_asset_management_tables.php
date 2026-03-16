<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asset_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('asset_categories')->nullOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->text('description')->nullable();
            $table->string('depreciation_method', 50)->nullable();
            $table->unsignedSmallInteger('useful_life_years')->nullable();
            $table->decimal('depreciation_rate', 8, 4)->nullable();
            $table->timestamps();

            $table->unique(['organization_id', 'code']);
            $table->index('organization_id');
            $table->index('parent_id');
        });

        Schema::create('asset_vendors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->string('contact_person')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('website')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['organization_id', 'code']);
            $table->index('organization_id');
        });

        Schema::create('asset_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('code', 50)->nullable();
            $table->text('address')->nullable();
            $table->string('building')->nullable();
            $table->string('floor', 50)->nullable();
            $table->string('room', 100)->nullable();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['organization_id', 'code']);
            $table->index('organization_id');
        });

        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('asset_category_id')->constrained('asset_categories')->restrictOnDelete();
            $table->foreignId('asset_vendor_id')->nullable()->constrained('asset_vendors')->nullOnDelete();
            $table->foreignId('asset_location_id')->nullable()->constrained('asset_locations')->nullOnDelete();
            $table->string('asset_tag', 100);
            $table->string('serial_number')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status', 50)->default('available');
            $table->string('condition', 50)->default('new');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 15, 2)->nullable();
            $table->string('currency', 10)->nullable();
            $table->date('warranty_expiry_date')->nullable();
            $table->text('warranty_notes')->nullable();
            $table->string('depreciation_method', 50)->nullable();
            $table->unsignedSmallInteger('useful_life_years')->nullable();
            $table->decimal('depreciation_rate', 8, 4)->nullable();
            $table->decimal('salvage_value', 15, 2)->nullable();
            $table->decimal('book_value', 15, 2)->nullable();
            $table->string('barcode')->nullable();
            $table->string('image_path', 500)->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'asset_tag']);
            $table->index('organization_id');
            $table->index('asset_category_id');
            $table->index('asset_vendor_id');
            $table->index('asset_location_id');
            $table->index('status');
            $table->index('condition');
            $table->index('purchase_date');
            $table->index('warranty_expiry_date');
        });

        Schema::create('asset_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained('employees')->restrictOnDelete();
            $table->foreignId('assigned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('returned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('assigned_at');
            $table->date('expected_return_date')->nullable();
            $table->timestamp('returned_at')->nullable();
            $table->string('condition_on_assignment', 50)->nullable();
            $table->string('condition_on_return', 50)->nullable();
            $table->text('notes')->nullable();
            $table->text('return_notes')->nullable();
            $table->string('status', 50)->default('active');
            $table->timestamps();

            $table->index('organization_id');
            $table->index('asset_id');
            $table->index('employee_id');
            $table->index('status');
            $table->index('assigned_at');
        });

        Schema::create('asset_maintenance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('maintenance_type', 50);
            $table->string('title');
            $table->text('description')->nullable();
            $table->foreignId('vendor_id')->nullable()->constrained('asset_vendors')->nullOnDelete();
            $table->string('performed_by')->nullable();
            $table->decimal('cost', 15, 2)->nullable();
            $table->string('currency', 10)->nullable();
            $table->date('scheduled_date')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->date('next_maintenance_date')->nullable();
            $table->string('status', 50)->default('scheduled');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('organization_id');
            $table->index('asset_id');
            $table->index('maintenance_type');
            $table->index('status');
            $table->index('scheduled_date');
        });

        Schema::create('asset_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path', 500);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->string('document_type', 50)->default('other');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('organization_id');
            $table->index('asset_id');
        });

        Schema::create('asset_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained('assets')->cascadeOnDelete();
            $table->string('from_status', 50)->nullable();
            $table->string('to_status', 50);
            $table->text('reason')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('asset_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asset_status_history');
        Schema::dropIfExists('asset_documents');
        Schema::dropIfExists('asset_maintenance_records');
        Schema::dropIfExists('asset_assignments');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('asset_locations');
        Schema::dropIfExists('asset_vendors');
        Schema::dropIfExists('asset_categories');
    }
};
