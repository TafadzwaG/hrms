<?php

namespace App\Http\Controllers;

use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class EmployerAuthController extends Controller
{
    public function showLogin(Request $request)
    {
        return Inertia::render('Employer/Login', [
            'status' => $request->session()->get('status'),
            'canResetPassword' => true,
        ]);
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended('/employer/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegister()
    {
        if (Auth::check() && CompanyProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
            ->where('owner_user_id', Auth::id())->exists()) {
            return redirect()->route('employer.dashboard');
        }

        return Inertia::render('Employer/Register', [
            'setupMode' => Auth::check(),
            'initialValues' => Auth::check() ? [
                'name' => Auth::user()?->name,
                'email' => Auth::user()?->email,
            ] : null,
        ]);
    }

    public function register(Request $request): RedirectResponse
    {
        if ($request->user()) {
            $request->merge(array_map(
                fn ($v) => $v === '' ? null : $v,
                $request->only(['industry', 'registration_number', 'company_email', 'company_phone', 'website'])
            ));

            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$request->user()->id],
                'company_name' => ['required', 'string', 'max:255'],
                'industry' => ['required', 'string', Rule::in(\App\Models\CompanyProfile::INDUSTRIES)],
                'registration_number' => ['nullable', 'string', 'max:100'],
                'company_email' => ['nullable', 'string', 'email', 'max:255'],
                'company_phone' => ['nullable', 'string', 'max:50'],
                'website' => ['nullable', 'string', 'url:http,https', 'max:500'],
            ]);

            DB::transaction(function () use ($data, $request) {
                $request->user()->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                ]);

                CompanyProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)->updateOrCreate(
                    ['owner_user_id' => $request->user()->id],
                    [
                        'company_name' => $data['company_name'],
                        'industry' => $data['industry'] ?? null,
                        'registration_number' => $data['registration_number'] ?? null,
                        'email' => $data['company_email'] ?? $data['email'],
                        'phone' => $data['company_phone'] ?? '',
                        'website' => $data['website'] ?? null,
                        'status' => 'pending_review',
                        'created_by' => $request->user()->id,
                        'updated_by' => $request->user()->id,
                    ],
                );
            });

            return redirect('/employer/dashboard')
                ->with('success', 'Company profile setup complete.');
        }

        // Convert empty strings to null for optional fields
        $request->merge(array_map(
            fn ($v) => $v === '' ? null : $v,
            $request->only(['industry', 'registration_number', 'company_email', 'company_phone', 'website'])
        ));

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'company_name' => ['required', 'string', 'max:255'],
            'industry' => ['required', 'string', Rule::in(\App\Models\CompanyProfile::INDUSTRIES)],
            'registration_number' => ['nullable', 'string', 'max:100'],
            'company_email' => ['nullable', 'string', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'url:http,https', 'max:500'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            CompanyProfile::create([
                'owner_user_id' => $user->id,
                'company_name' => $data['company_name'],
                'industry' => $data['industry'] ?? null,
                'registration_number' => $data['registration_number'] ?? null,
                'email' => $data['company_email'] ?? $data['email'],
                'phone' => $data['company_phone'] ?? '',
                'website' => $data['website'] ?? null,
                'status' => 'pending_review',
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);

            return $user;
        });

        Auth::login($user);

        return redirect('/employer/dashboard')
            ->with('success', 'Welcome! Your company profile has been created and is pending review.');
    }
}
