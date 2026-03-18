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
        return Inertia::render('Employer/Register');
    }

    public function register(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'company_name' => ['required', 'string', 'max:255'],
            'industry' => ['nullable', 'string', Rule::in(\App\Models\CompanyProfile::INDUSTRIES)],
            'registration_number' => ['nullable', 'string', 'max:100'],
            'company_email' => ['nullable', 'string', 'email', 'max:255'],
            'company_phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'url', 'max:500'],
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
