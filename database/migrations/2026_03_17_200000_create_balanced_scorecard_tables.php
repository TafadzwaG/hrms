<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Create performance_cycles table
        Schema::create('performance_cycles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status', 32)->default('draft');
            $table->boolean('self_assessment_enabled')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->unique(['organization_id', 'title']);
            $table->index('organization_id');
            $table->index('status');
        });

        // 2. Create kpi_library table
        Schema::create('kpi_library', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->string('name', 255);
            $table->string('code', 50)->nullable();
            $table->string('perspective', 32);
            $table->text('description')->nullable();
            $table->string('target_type', 32);
            $table->decimal('default_target', 12, 2)->nullable();
            $table->decimal('default_weight', 5, 2)->nullable();
            $table->string('unit', 50)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->unique(['organization_id', 'name']);
            $table->index('organization_id');
            $table->index('perspective');
            $table->index('is_active');
        });

        // 3. Create scorecard_templates table
        Schema::create('scorecard_templates', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('scope_type', 32)->nullable();
            $table->string('scope_value', 255)->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->unique(['organization_id', 'name']);
            $table->index('organization_id');
            $table->index('is_active');
        });

        // 4. Create scorecard_template_items table
        Schema::create('scorecard_template_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('scorecard_template_id');
            $table->unsignedBigInteger('kpi_library_id')->nullable();
            $table->string('perspective', 32);
            $table->string('objective', 500);
            $table->string('kpi_name', 255);
            $table->string('target_type', 32)->default('numeric');
            $table->decimal('target_value', 12, 2)->nullable();
            $table->decimal('weight', 5, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('scorecard_template_id')->references('id')->on('scorecard_templates')->onDelete('cascade');
            $table->foreign('kpi_library_id')->references('id')->on('kpi_library')->onDelete('set null');
            $table->index('scorecard_template_id');
            $table->index('perspective');
        });

        // 5. Create employee_scorecards table
        Schema::create('employee_scorecards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('performance_cycle_id');
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('scorecard_template_id')->nullable();
            $table->string('status', 32)->default('draft');
            $table->decimal('overall_score', 5, 2)->nullable();
            $table->string('overall_rating', 32)->nullable();
            $table->decimal('financial_score', 5, 2)->nullable();
            $table->decimal('customer_score', 5, 2)->nullable();
            $table->decimal('internal_process_score', 5, 2)->nullable();
            $table->decimal('learning_growth_score', 5, 2)->nullable();
            $table->timestamp('self_assessment_completed_at')->nullable();
            $table->timestamp('manager_review_completed_at')->nullable();
            $table->timestamp('finalized_at')->nullable();
            $table->unsignedBigInteger('finalized_by')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('performance_cycle_id')->references('id')->on('performance_cycles')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('scorecard_template_id')->references('id')->on('scorecard_templates')->onDelete('set null');
            $table->unique(['performance_cycle_id', 'employee_id']);
            $table->index('organization_id');
            $table->index('employee_id');
            $table->index('status');
        });

        // 6. Create employee_scorecard_items table
        Schema::create('employee_scorecard_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_scorecard_id');
            $table->unsignedBigInteger('kpi_library_id')->nullable();
            $table->string('perspective', 32);
            $table->string('objective', 500);
            $table->string('kpi_name', 255);
            $table->string('target_type', 32)->default('numeric');
            $table->decimal('target_value', 12, 2)->nullable();
            $table->decimal('actual_value', 12, 2)->nullable();
            $table->decimal('score', 5, 2)->nullable();
            $table->decimal('weight', 5, 2)->default(0);
            $table->decimal('self_assessment_score', 5, 2)->nullable();
            $table->text('self_assessment_comment')->nullable();
            $table->decimal('manager_score', 5, 2)->nullable();
            $table->text('manager_comment')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->foreign('employee_scorecard_id')->references('id')->on('employee_scorecards')->onDelete('cascade');
            $table->foreign('kpi_library_id')->references('id')->on('kpi_library')->onDelete('set null');
            $table->index('employee_scorecard_id');
            $table->index('perspective');
        });

        // 7. Create performance_comments table
        Schema::create('performance_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_scorecard_id');
            $table->unsignedBigInteger('user_id');
            $table->text('comment');
            $table->string('type', 32)->default('general');
            $table->timestamps();

            $table->foreign('employee_scorecard_id')->references('id')->on('employee_scorecards')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('employee_scorecard_id');
            $table->index('type');
        });

        // 8. Create performance_evidence table
        Schema::create('performance_evidence', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('employee_scorecard_id');
            $table->unsignedBigInteger('employee_scorecard_item_id')->nullable();
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('uploaded_by')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('employee_scorecard_id')->references('id')->on('employee_scorecards')->onDelete('cascade');
            $table->foreign('employee_scorecard_item_id')->references('id')->on('employee_scorecard_items')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
            $table->index('organization_id');
            $table->index('employee_scorecard_id');
        });

        // 9. Create performance_improvement_plans table
        Schema::create('performance_improvement_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('employee_scorecard_id');
            $table->unsignedBigInteger('employee_id');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->text('objectives')->nullable();
            $table->text('support_required')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status', 32)->default('active');
            $table->text('outcome')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('employee_scorecard_id')->references('id')->on('employee_scorecards')->onDelete('cascade');
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->index('organization_id');
            $table->index('employee_id');
            $table->index('status');
        });

        // 10. Alter performance_reviews table to add new columns and foreign keys
        Schema::table('performance_reviews', function (Blueprint $table) {
            if (! Schema::hasColumn('performance_reviews', 'performance_cycle_id')) {
                $table->unsignedBigInteger('performance_cycle_id')->nullable()->after('organization_id');
            }
            if (! Schema::hasColumn('performance_reviews', 'employee_scorecard_id')) {
                $table->unsignedBigInteger('employee_scorecard_id')->nullable()->after('performance_cycle_id');
            }
        });

        Schema::table('performance_reviews', function (Blueprint $table) {
            if (Schema::hasColumn('performance_reviews', 'performance_cycle_id')) {
                $table->foreign('performance_cycle_id')->references('id')->on('performance_cycles')->onDelete('set null');
            }
            if (Schema::hasColumn('performance_reviews', 'employee_scorecard_id')) {
                $table->foreign('employee_scorecard_id')->references('id')->on('employee_scorecards')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        // Revert performance_reviews alterations first
        Schema::table('performance_reviews', function (Blueprint $table) {
            if (Schema::hasColumn('performance_reviews', 'employee_scorecard_id')) {
                $table->dropForeign(['employee_scorecard_id']);
                $table->dropColumn('employee_scorecard_id');
            }
            if (Schema::hasColumn('performance_reviews', 'performance_cycle_id')) {
                $table->dropForeign(['performance_cycle_id']);
                $table->dropColumn('performance_cycle_id');
            }
        });

        // Drop tables in reverse order
        Schema::dropIfExists('performance_improvement_plans');
        Schema::dropIfExists('performance_evidence');
        Schema::dropIfExists('performance_comments');
        Schema::dropIfExists('employee_scorecard_items');
        Schema::dropIfExists('employee_scorecards');
        Schema::dropIfExists('scorecard_template_items');
        Schema::dropIfExists('scorecard_templates');
        Schema::dropIfExists('kpi_library');
        Schema::dropIfExists('performance_cycles');
    }
};
