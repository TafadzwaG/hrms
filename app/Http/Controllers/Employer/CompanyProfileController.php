<?php

namespace App\Http\Controllers\Employer;

use App\Http\Requests\Employer\UpdateCompanyLogoRequest;
use App\Http\Requests\Employer\UpdateCompanyProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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

    public function updateLogo(UpdateCompanyLogoRequest $request): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        $file = $request->file('logo');
        $storedName = Str::uuid()->toString().'_'.$file->getClientOriginalName();
        $path = $file->storeAs('company-logos/'.$company->id, $storedName, 'public');
        $previousPath = $company->logo_path;

        $company->update([
            'logo_path' => $path,
            'updated_by' => $request->user()?->id,
        ]);

        if ($previousPath && $previousPath !== $path && Storage::disk('public')->exists($previousPath)) {
            Storage::disk('public')->delete($previousPath);
        }

        return back()->with('success', 'Company logo updated.');
    }

    public function destroyLogo(Request $request): RedirectResponse
    {
        $company = $this->company($request);

        if ($company instanceof \Illuminate\Http\RedirectResponse) {
            return $company;
        }

        if ($company->logo_path && Storage::disk('public')->exists($company->logo_path)) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $company->update([
            'logo_path' => null,
            'updated_by' => $request->user()?->id,
        ]);

        return back()->with('success', 'Company logo removed.');
    }
}
