<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\UpdateCompanyProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyProfileController extends BaseEmployerHubController
{
    public function edit(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        return Inertia::render('Employer/CompanyProfile', [
            'company' => $this->presenter->company($company),
            'industries' => \App\Models\CompanyProfile::INDUSTRIES,
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $company->update([
            ...$request->validated(),
            'updated_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Company profile updated.');
    }
}
