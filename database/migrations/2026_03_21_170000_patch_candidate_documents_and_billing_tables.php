<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidate_resumes', function (Blueprint $table): void {
            if (! Schema::hasColumn('candidate_resumes', 'document_type')) {
                $table->string('document_type', 50)->default('resume')->after('file_name');
            }

            if (! Schema::hasColumn('candidate_resumes', 'description')) {
                $table->text('description')->nullable()->after('file_path');
            }

            if (! Schema::hasColumn('candidate_resumes', 'uploaded_by')) {
                $table->foreignId('uploaded_by')->nullable()->after('is_primary')->constrained('users')->nullOnDelete();
            }
        });

        Schema::table('vacancy_applications', function (Blueprint $table): void {
            $table->unique(['vacancy_id', 'candidate_profile_id'], 'vacancy_candidate_unique');
        });

        Schema::create('subscription_plans', function (Blueprint $table): void {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->string('currency', 10)->default('USD');
            $table->string('billing_interval', 20)->default('monthly');
            $table->unsignedInteger('seat_limit')->nullable();
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('company_billing_profiles', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->cascadeOnDelete();
            $table->string('billing_name');
            $table->string('billing_email');
            $table->string('billing_phone')->nullable();
            $table->text('billing_address')->nullable();
            $table->string('tax_number')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique('company_profile_id');
        });

        Schema::create('company_subscriptions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->cascadeOnDelete();
            $table->foreignId('subscription_plan_id')->constrained('subscription_plans')->restrictOnDelete();
            $table->string('status', 30)->default('active');
            $table->unsignedInteger('seats')->default(1);
            $table->decimal('amount', 12, 2);
            $table->string('currency', 10)->default('USD');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('renews_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['company_profile_id', 'status']);
        });

        Schema::create('company_invoices', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('company_profile_id')->constrained('company_profiles')->cascadeOnDelete();
            $table->foreignId('company_subscription_id')->nullable()->constrained('company_subscriptions')->nullOnDelete();
            $table->string('invoice_number')->unique();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 10)->default('USD');
            $table->string('status', 30)->default('paid');
            $table->string('description')->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('due_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['company_profile_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_invoices');
        Schema::dropIfExists('company_subscriptions');
        Schema::dropIfExists('company_billing_profiles');
        Schema::dropIfExists('subscription_plans');

        Schema::table('vacancy_applications', function (Blueprint $table): void {
            $table->dropUnique('vacancy_candidate_unique');
        });

        Schema::table('candidate_resumes', function (Blueprint $table): void {
            if (Schema::hasColumn('candidate_resumes', 'uploaded_by')) {
                $table->dropConstrainedForeignId('uploaded_by');
            }

            if (Schema::hasColumn('candidate_resumes', 'document_type')) {
                $table->dropColumn('document_type');
            }

            if (Schema::hasColumn('candidate_resumes', 'description')) {
                $table->dropColumn('description');
            }
        });
    }
};
