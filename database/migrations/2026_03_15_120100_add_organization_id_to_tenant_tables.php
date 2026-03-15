<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $tables = [
        'org_units',
        'locations',
        'positions',
        'employees',
        'document_types',
        'documents',
        'workflow_definitions',
        'leave_requests',
        'attendance_records',
        'timesheets',
        'payroll_exports',
        'job_requisitions',
        'candidate_profiles',
        'onboarding_tasks',
        'offboarding_tasks',
        'performance_reviews',
        'learning_courses',
        'audit_logs',
    ];

    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('organization_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('organizations')
                    ->nullOnDelete();
            });
        }

        $organizationId = (int) DB::table('organizations')->orderBy('id')->value('id');

        foreach ($this->tables as $tableName) {
            DB::table($tableName)
                ->whereNull('organization_id')
                ->update(['organization_id' => $organizationId]);
        }

        $this->replaceUniqueIndexes();
    }

    public function down(): void
    {
        $this->restoreUniqueIndexes();

        foreach (array_reverse($this->tables) as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropConstrainedForeignId('organization_id');
            });
        }
    }

    private function replaceUniqueIndexes(): void
    {
        Schema::table('org_units', function (Blueprint $table) {
            $table->dropUnique('org_units_parent_id_name_type_unique');
            $table->unique(['organization_id', 'parent_id', 'name', 'type'], 'org_units_org_parent_name_type_unique');
            $table->index(['organization_id', 'type']);
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_staff_number_unique');
            $table->unique(['organization_id', 'staff_number'], 'employees_org_staff_number_unique');
            $table->index(['organization_id', 'status']);
        });

        Schema::table('positions', function (Blueprint $table) {
            $table->dropUnique('positions_code_unique');
            $table->unique(['organization_id', 'code'], 'positions_org_code_unique');
            $table->index(['organization_id', 'is_active']);
        });

        Schema::table('document_types', function (Blueprint $table) {
            $table->dropUnique('document_types_code_unique');
            $table->unique(['organization_id', 'code'], 'document_types_org_code_unique');
            $table->index(['organization_id', 'sensitivity_level']);
        });

        Schema::table('job_requisitions', function (Blueprint $table) {
            $table->dropUnique('job_requisitions_requisition_code_unique');
            $table->unique(['organization_id', 'requisition_code'], 'job_requisitions_org_requisition_code_unique');
            $table->index(['organization_id', 'status']);
        });

        Schema::table('learning_courses', function (Blueprint $table) {
            $table->dropUnique('learning_courses_course_code_unique');
            $table->unique(['organization_id', 'course_code'], 'learning_courses_org_course_code_unique');
            $table->index(['organization_id', 'status']);
        });
    }

    private function restoreUniqueIndexes(): void
    {
        Schema::table('learning_courses', function (Blueprint $table) {
            $table->dropUnique('learning_courses_org_course_code_unique');
            $table->dropIndex(['organization_id', 'status']);
            $table->unique('course_code');
        });

        Schema::table('job_requisitions', function (Blueprint $table) {
            $table->dropUnique('job_requisitions_org_requisition_code_unique');
            $table->dropIndex(['organization_id', 'status']);
            $table->unique('requisition_code');
        });

        Schema::table('document_types', function (Blueprint $table) {
            $table->dropUnique('document_types_org_code_unique');
            $table->dropIndex(['organization_id', 'sensitivity_level']);
            $table->unique('code');
        });

        Schema::table('positions', function (Blueprint $table) {
            $table->dropUnique('positions_org_code_unique');
            $table->dropIndex(['organization_id', 'is_active']);
            $table->unique('code');
        });

        Schema::table('employees', function (Blueprint $table) {
            $table->dropUnique('employees_org_staff_number_unique');
            $table->dropIndex(['organization_id', 'status']);
            $table->unique('staff_number');
        });

        Schema::table('org_units', function (Blueprint $table) {
            $table->dropUnique('org_units_org_parent_name_type_unique');
            $table->dropIndex(['organization_id', 'type']);
            $table->unique(['parent_id', 'name', 'type']);
        });
    }
};
