<?php

namespace App\Http\Controllers\Reports;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;

class EmployeeReportController extends BaseReportController
{
    public function masterList(Request $request)
    {
        return $this->downloadRegisterReport($request, Employee::class, 'employee-master-list', [
            'id', 'staff_number', 'first_name', 'middle_name', 'surname',
            'status', 'hire_date', 'termination_date', 'org_unit_id',
            'location_id', 'position_id', 'manager_id',
        ]);
    }

    public function activeInactive(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Employee::class, 'status', 'employee-active-inactive');
    }

    public function headcountByDepartment(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Employee::class, 'org_unit_id', 'employee-headcount-by-department');
    }

    public function headcountByLocation(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Employee::class, 'location_id', 'employee-headcount-by-location');
    }

    public function headcountByPosition(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Employee::class, 'position_id', 'employee-headcount-by-position');
    }

    public function headcountByManager(Request $request)
    {
        return $this->downloadGroupedCountReport($request, Employee::class, 'manager_id', 'employee-headcount-by-manager');
    }

    public function newHiresByMonth(Request $request)
    {
        return $this->downloadDateTrendReport($request, Employee::class, 'hire_date', 'employee-new-hires-by-month');
    }

    public function terminationsByMonth(Request $request)
    {
        return $this->downloadDateTrendReport($request, Employee::class, 'termination_date', 'employee-terminations-by-month');
    }

    public function tenure(Request $request)
    {
        $rows = Employee::query()->get([
            ...$this->existingColumns(Employee::class, ['staff_number', 'first_name', 'middle_name', 'surname', 'hire_date', 'status']),
        ])->map(function (Employee $employee) {
            $fullName = trim(collect([$employee->first_name, $employee->middle_name, $employee->surname])->filter()->implode(' '));
            $hireDate = $employee->hire_date ? Carbon::parse($employee->hire_date) : null;

            return [
                'staff_number' => $employee->staff_number,
                'full_name' => $fullName,
                'hire_date' => $hireDate?->toDateString(),
                'tenure_days' => $hireDate ? $hireDate->diffInDays(now()) : null,
                'tenure_years' => $hireDate ? round($hireDate->diffInDays(now()) / 365, 2) : null,
                'status' => $employee->status,
            ];
        })->all();

        return $this->exportRows($request, 'employee-tenure-report', [
            'staff_number', 'full_name', 'hire_date', 'tenure_days', 'tenure_years', 'status',
        ], $rows);
    }

    public function birthdays(Request $request)
    {
        $rows = Employee::query()->get(
            $this->existingColumns(Employee::class, ['staff_number', 'first_name', 'middle_name', 'surname', 'date_of_birth', 'status'])
        )->filter(fn (Employee $employee) => ! empty($employee->date_of_birth))
            ->map(function (Employee $employee) {
                $dob = Carbon::parse($employee->date_of_birth);

                return [
                    'staff_number' => $employee->staff_number,
                    'full_name' => trim(collect([$employee->first_name, $employee->middle_name, $employee->surname])->filter()->implode(' ')),
                    'date_of_birth' => $dob->toDateString(),
                    'birthday_month_day' => $dob->format('m-d'),
                    'status' => $employee->status,
                ];
            })
            ->sortBy('birthday_month_day')
            ->values()
            ->all();

        return $this->exportRows($request, 'employee-birthday-report', [
            'staff_number', 'full_name', 'date_of_birth', 'birthday_month_day', 'status',
        ], $rows);
    }

    public function missingProfileFields(Request $request)
    {
        return $this->downloadMissingValuesReport(
            $request,
            Employee::class,
            ['staff_number', 'first_name', 'surname', 'hire_date', 'status'],
            'employee-missing-profile-fields',
            ['id', 'staff_number', 'first_name', 'middle_name', 'surname', 'hire_date', 'status']
        );
    }
}
