<?php

namespace App\Http\Controllers;

use App\Models\EmployeeBenefitDependant;
use App\Models\EmployeeBenefitEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeBenefitDependantController extends Controller
{
    public function store(Request $request, EmployeeBenefitEnrollment $enrollment): RedirectResponse
    {
        $data = $this->validateDependant($request);

        $enrollment->dependants()->create([
            'organization_id' => $enrollment->organization_id,
            ...$data,
        ]);

        return back()->with('success', 'Dependant added successfully.');
    }

    public function update(Request $request, EmployeeBenefitEnrollment $enrollment, EmployeeBenefitDependant $dependant): RedirectResponse
    {
        abort_unless((int) $dependant->employee_benefit_enrollment_id === (int) $enrollment->id, 404);

        $data = $this->validateDependant($request);

        $dependant->update($data);

        return back()->with('success', 'Dependant updated successfully.');
    }

    public function destroy(EmployeeBenefitEnrollment $enrollment, EmployeeBenefitDependant $dependant): RedirectResponse
    {
        abort_unless((int) $dependant->employee_benefit_enrollment_id === (int) $enrollment->id, 404);

        $dependant->delete();

        return back()->with('success', 'Dependant removed successfully.');
    }

    // ── Helpers ──────────────────────────────────────────────

    private function validateDependant(Request $request): array
    {
        return $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'relationship' => ['required', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'national_id' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:50'],
            'effective_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:effective_date'],
            'status' => ['nullable', 'string', Rule::in(['active', 'inactive', 'removed'])],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
    }
}
