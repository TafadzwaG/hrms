<?php

namespace App\Http\Controllers\Reports;

use App\Models\Benefit;
use App\Models\EmployeeBenefitDependant;
use App\Models\EmployeeBenefitEnrollment;
use Illuminate\Http\Request;

class BenefitReportController extends BaseReportController
{
    public function register(Request $request)
    {
        return $this->downloadRegisterReport($request, Benefit::class, 'benefit-register', [
            'id', 'code', 'name', 'category', 'benefit_type',
            'taxable', 'cash_benefit', 'employer_funded', 'employee_funded',
            'shared_contribution', 'active', 'effective_from', 'effective_to',
        ]);
    }

    public function activeEnrollments(Request $request)
    {
        $rows = EmployeeBenefitEnrollment::query()
            ->with(['employee:id,first_name,surname,staff_number', 'benefit:id,name,code,category', 'plan:id,name,code'])
            ->where('status', 'active')
            ->orderByDesc('effective_date')
            ->get()
            ->map(function (EmployeeBenefitEnrollment $e) {
                return [
                    'employee_staff_number' => $e->employee?->staff_number,
                    'employee_name' => $e->employee?->full_name,
                    'benefit_code' => $e->benefit?->code,
                    'benefit_name' => $e->benefit?->name,
                    'category' => $e->benefit?->category,
                    'plan_name' => $e->plan?->name,
                    'effective_date' => optional($e->effective_date)->toDateString(),
                    'end_date' => optional($e->end_date)->toDateString(),
                    'employee_contribution' => $e->employee_contribution,
                    'employer_contribution' => $e->employer_contribution,
                    'status' => $e->status,
                ];
            })->all();

        return $this->exportRows($request, 'active-benefit-enrollments', [
            'employee_staff_number', 'employee_name', 'benefit_code', 'benefit_name',
            'category', 'plan_name', 'effective_date', 'end_date',
            'employee_contribution', 'employer_contribution', 'status',
        ], $rows);
    }

    public function byDepartment(Request $request)
    {
        $rows = EmployeeBenefitEnrollment::query()
            ->with(['employee:id,first_name,surname,staff_number,department_id', 'employee.department:id,name', 'benefit:id,name,code'])
            ->where('status', 'active')
            ->orderBy('created_at')
            ->get()
            ->map(function (EmployeeBenefitEnrollment $e) {
                return [
                    'department' => $e->employee?->department?->name ?? 'Unassigned',
                    'employee_staff_number' => $e->employee?->staff_number,
                    'employee_name' => $e->employee?->full_name,
                    'benefit_code' => $e->benefit?->code,
                    'benefit_name' => $e->benefit?->name,
                    'employee_contribution' => $e->employee_contribution,
                    'employer_contribution' => $e->employer_contribution,
                ];
            })->all();

        return $this->exportRows($request, 'benefit-enrollments-by-department', [
            'department', 'employee_staff_number', 'employee_name',
            'benefit_code', 'benefit_name',
            'employee_contribution', 'employer_contribution',
        ], $rows);
    }

    public function employerContributions(Request $request)
    {
        $rows = EmployeeBenefitEnrollment::query()
            ->with(['employee:id,first_name,surname,staff_number', 'benefit:id,name,code,category'])
            ->where('status', 'active')
            ->whereNotNull('employer_contribution')
            ->where('employer_contribution', '>', 0)
            ->orderByDesc('employer_contribution')
            ->get()
            ->map(function (EmployeeBenefitEnrollment $e) {
                return [
                    'employee_staff_number' => $e->employee?->staff_number,
                    'employee_name' => $e->employee?->full_name,
                    'benefit_code' => $e->benefit?->code,
                    'benefit_name' => $e->benefit?->name,
                    'category' => $e->benefit?->category,
                    'employer_contribution' => $e->employer_contribution,
                    'effective_date' => optional($e->effective_date)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'employer-contributions', [
            'employee_staff_number', 'employee_name', 'benefit_code', 'benefit_name',
            'category', 'employer_contribution', 'effective_date',
        ], $rows);
    }

    public function employeeContributions(Request $request)
    {
        $rows = EmployeeBenefitEnrollment::query()
            ->with(['employee:id,first_name,surname,staff_number', 'benefit:id,name,code,category'])
            ->where('status', 'active')
            ->whereNotNull('employee_contribution')
            ->where('employee_contribution', '>', 0)
            ->orderByDesc('employee_contribution')
            ->get()
            ->map(function (EmployeeBenefitEnrollment $e) {
                return [
                    'employee_staff_number' => $e->employee?->staff_number,
                    'employee_name' => $e->employee?->full_name,
                    'benefit_code' => $e->benefit?->code,
                    'benefit_name' => $e->benefit?->name,
                    'category' => $e->benefit?->category,
                    'employee_contribution' => $e->employee_contribution,
                    'effective_date' => optional($e->effective_date)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'employee-contributions', [
            'employee_staff_number', 'employee_name', 'benefit_code', 'benefit_name',
            'category', 'employee_contribution', 'effective_date',
        ], $rows);
    }

    public function dependants(Request $request)
    {
        $rows = EmployeeBenefitDependant::query()
            ->with([
                'enrollment:id,employee_id,benefit_id',
                'enrollment.employee:id,first_name,surname,staff_number',
                'enrollment.benefit:id,name,code',
            ])
            ->orderBy('full_name')
            ->get()
            ->map(function (EmployeeBenefitDependant $d) {
                return [
                    'employee_staff_number' => $d->enrollment?->employee?->staff_number,
                    'employee_name' => $d->enrollment?->employee?->full_name,
                    'benefit_name' => $d->enrollment?->benefit?->name,
                    'dependant_name' => $d->full_name,
                    'relationship' => $d->relationship,
                    'date_of_birth' => optional($d->date_of_birth)->toDateString(),
                    'national_id' => $d->national_id,
                    'status' => $d->status,
                    'effective_date' => optional($d->effective_date)->toDateString(),
                    'end_date' => optional($d->end_date)->toDateString(),
                ];
            })->all();

        return $this->exportRows($request, 'benefit-dependants', [
            'employee_staff_number', 'employee_name', 'benefit_name',
            'dependant_name', 'relationship', 'date_of_birth',
            'national_id', 'status', 'effective_date', 'end_date',
        ], $rows);
    }

    public function byCost(Request $request)
    {
        $rows = EmployeeBenefitEnrollment::query()
            ->join('benefits', 'employee_benefit_enrollments.benefit_id', '=', 'benefits.id')
            ->where('employee_benefit_enrollments.status', 'active')
            ->selectRaw('benefits.category, benefits.name as benefit_name, count(*) as enrollment_count, sum(employee_benefit_enrollments.employer_contribution) as total_employer, sum(employee_benefit_enrollments.employee_contribution) as total_employee')
            ->groupBy('benefits.category', 'benefits.name')
            ->orderByDesc('total_employer')
            ->get()
            ->map(function ($row) {
                return [
                    'category' => $row->category,
                    'benefit_name' => $row->benefit_name,
                    'enrollment_count' => $row->enrollment_count,
                    'total_employer_contribution' => round((float) $row->total_employer, 2),
                    'total_employee_contribution' => round((float) $row->total_employee, 2),
                    'total_cost' => round((float) $row->total_employer + (float) $row->total_employee, 2),
                ];
            })->all();

        return $this->exportRows($request, 'benefit-cost-by-category', [
            'category', 'benefit_name', 'enrollment_count',
            'total_employer_contribution', 'total_employee_contribution', 'total_cost',
        ], $rows);
    }

    public function expiredSuspended(Request $request)
    {
        $rows = EmployeeBenefitEnrollment::query()
            ->with(['employee:id,first_name,surname,staff_number', 'benefit:id,name,code,category'])
            ->whereIn('status', ['expired', 'suspended', 'terminated'])
            ->orderByDesc('updated_at')
            ->get()
            ->map(function (EmployeeBenefitEnrollment $e) {
                return [
                    'employee_staff_number' => $e->employee?->staff_number,
                    'employee_name' => $e->employee?->full_name,
                    'benefit_code' => $e->benefit?->code,
                    'benefit_name' => $e->benefit?->name,
                    'category' => $e->benefit?->category,
                    'status' => $e->status,
                    'effective_date' => optional($e->effective_date)->toDateString(),
                    'end_date' => optional($e->end_date)->toDateString(),
                    'employee_contribution' => $e->employee_contribution,
                    'employer_contribution' => $e->employer_contribution,
                ];
            })->all();

        return $this->exportRows($request, 'expired-suspended-enrollments', [
            'employee_staff_number', 'employee_name', 'benefit_code', 'benefit_name',
            'category', 'status', 'effective_date', 'end_date',
            'employee_contribution', 'employer_contribution',
        ], $rows);
    }
}
