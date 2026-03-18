<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Alter candidate_profiles to add marketplace fields
        Schema::table('candidate_profiles', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('alt_phone')->nullable();
            $table->string('national_id')->nullable();
            $table->string('gender', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('location')->nullable();
            $table->string('headline')->nullable();
            $table->text('professional_summary')->nullable();
            $table->decimal('expected_salary', 15, 2)->nullable();
            $table->string('salary_currency', 10)->default('USD');
            $table->integer('years_experience')->nullable();
            $table->string('highest_education')->nullable();
            $table->string('profile_visibility_status', 50)->default('draft');
            $table->boolean('is_public')->default(false);
            $table->boolean('is_verified')->default(false);
            $table->decimal('listing_fee_amount', 10, 2)->default(1.00);
            $table->string('listing_fee_currency', 10)->default('USD');
            $table->timestamp('listing_activated_at')->nullable();
            $table->timestamp('listing_expires_at')->nullable();
            $table->json('metadata')->nullable();

            $table->index('user_id');
            $table->index('organization_id');
            $table->index('profile_visibility_status');
            $table->index('is_public');
        });

        // 2. Create candidate_resumes table
        Schema::create('candidate_resumes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_profile_id')->constrained('candidate_profiles')->cascadeOnDelete();
            $table->string('file_name');
            $table->string('file_path');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->boolean('is_primary')->default(false);
            $table->timestamp('uploaded_at')->nullable();
            $table->timestamps();

            $table->index('candidate_profile_id');
        });

        // 3. Create candidate_educations table
        Schema::create('candidate_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_profile_id')->constrained('candidate_profiles')->cascadeOnDelete();
            $table->string('institution');
            $table->string('qualification');
            $table->string('field_of_study')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->string('grade')->nullable();
            $table->timestamps();

            $table->index('candidate_profile_id');
        });

        // 4. Create candidate_experiences table
        Schema::create('candidate_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_profile_id')->constrained('candidate_profiles')->cascadeOnDelete();
            $table->string('employer_name');
            $table->string('job_title');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('currently_working')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('candidate_profile_id');
        });

        // 5. Create candidate_skills table
        Schema::create('candidate_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_profile_id')->constrained('candidate_profiles')->cascadeOnDelete();
            $table->string('name');
            $table->string('level', 50)->nullable();
            $table->integer('years_experience')->nullable();
            $table->timestamps();

            $table->index('candidate_profile_id');
        });

        // 6. Create company_profiles table
        Schema::create('company_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $table->string('company_name');
            $table->string('industry')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->string('website')->nullable();
            $table->text('address')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable();
            $table->string('status', 50)->default('draft');
            $table->timestamp('approved_at')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('owner_user_id');
            $table->index('organization_id');
            $table->index('status');
        });

        // 7. Create vacancies table
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->cascadeOnDelete();
            $table->string('title');
            $table->string('department')->nullable();
            $table->string('category')->nullable();
            $table->string('employment_type', 50);
            $table->string('work_mode', 50)->nullable();
            $table->string('location')->nullable();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->text('responsibilities')->nullable();
            $table->decimal('salary_min', 15, 2)->nullable();
            $table->decimal('salary_max', 15, 2)->nullable();
            $table->string('currency', 10)->default('USD');
            $table->date('application_deadline')->nullable();
            $table->string('status', 50)->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index('company_profile_id');
            $table->index('status');
            $table->index('category');
            $table->index('employment_type');
            $table->index('application_deadline');
        });

        // 8. Create vacancy_applications table
        Schema::create('vacancy_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained('vacancies')->cascadeOnDelete();
            $table->unsignedBigInteger('candidate_profile_id');
            $table->foreignId('resume_id')->nullable()->constrained('candidate_resumes')->nullOnDelete();
            $table->text('cover_letter')->nullable();
            $table->string('status', 50)->default('submitted');
            $table->timestamp('applied_at')->nullable();
            $table->timestamp('shortlisted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('candidate_profile_id', 'vacancy_app_candidate_fk')
                ->references('id')->on('candidate_profiles')->cascadeOnDelete();
            $table->index('vacancy_id');
            $table->index('candidate_profile_id', 'vacancy_app_candidate_idx');
            $table->index('status');
        });

        // 9. Create payments table
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payable_type');
            $table->unsignedBigInteger('payable_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('USD');
            $table->string('provider', 50);
            $table->string('provider_reference')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('status', 50)->default('pending');
            $table->timestamp('initiated_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('failed_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['payable_type', 'payable_id']);
            $table->index('user_id');
            $table->index('provider');
            $table->index('status');
            $table->index('provider_reference');
        });

        // 10. Create payment_webhook_logs table
        Schema::create('payment_webhook_logs', function (Blueprint $table) {
            $table->id();
            $table->string('provider', 50);
            $table->string('provider_reference')->nullable();
            $table->json('payload')->nullable();
            $table->boolean('processed')->default(false);
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index('provider');
            $table->index('provider_reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_webhook_logs');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('vacancy_applications');
        Schema::dropIfExists('vacancies');
        Schema::dropIfExists('company_profiles');
        Schema::dropIfExists('candidate_skills');
        Schema::dropIfExists('candidate_experiences');
        Schema::dropIfExists('candidate_educations');
        Schema::dropIfExists('candidate_resumes');

        Schema::table('candidate_profiles', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['organization_id']);
            $table->dropColumn([
                'user_id',
                'organization_id',
                'alt_phone',
                'national_id',
                'gender',
                'date_of_birth',
                'location',
                'headline',
                'professional_summary',
                'expected_salary',
                'salary_currency',
                'years_experience',
                'highest_education',
                'profile_visibility_status',
                'is_public',
                'is_verified',
                'listing_fee_amount',
                'listing_fee_currency',
                'listing_activated_at',
                'listing_expires_at',
                'metadata',
            ]);
        });
    }
};
