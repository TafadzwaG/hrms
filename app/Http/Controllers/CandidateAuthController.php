<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class CandidateAuthController extends Controller
{
    public function showLogin(Request $request)
    {
        return Inertia::render('Candidate/Login', [
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

            $user = Auth::user();

            if (CandidateProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
                ->where('user_id', $user->id)->exists()) {
                return redirect()->intended('/candidate/dashboard');
            }

            if (CompanyProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
                ->where('owner_user_id', $user->id)->exists()) {
                return redirect()->intended('/employer/dashboard');
            }

            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegister()
    {
        if (Auth::check() && CandidateProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
            ->where('user_id', Auth::id())->exists()) {
            return redirect()->route('candidate.dashboard');
        }

        return Inertia::render('Candidate/Register', [
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
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$request->user()->id],
                'headline' => ['nullable', 'string', 'max:255'],
                'phone' => ['nullable', 'string', 'max:50'],
                'location' => ['nullable', 'string', 'max:255'],
                'years_experience' => ['nullable', 'integer', 'min:0'],
                'highest_education' => ['nullable', 'string', 'max:50'],
            ]);

            DB::transaction(function () use ($data, $request) {
                $request->user()->update([
                    'name' => $data['name'],
                    'email' => $data['email'],
                ]);

                CandidateProfile::withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)->updateOrCreate(
                    ['user_id' => $request->user()->id],
                    [
                        'full_name' => $data['name'],
                        'email' => $data['email'],
                        'phone' => $data['phone'] ?? null,
                        'location' => $data['location'] ?? null,
                        'headline' => $data['headline'] ?? null,
                        'years_experience' => $data['years_experience'] ?? null,
                        'highest_education' => $data['highest_education'] ?? null,
                        'profile_visibility_status' => 'draft',
                        'is_public' => false,
                        'stage' => 'listed',
                        'status' => 'available',
                    ],
                );
            });

            return redirect('/candidate/dashboard')
                ->with('success', 'Candidate profile setup complete.');
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'headline' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'years_experience' => ['nullable', 'integer', 'min:0'],
            'highest_education' => ['nullable', 'string', 'max:50'],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ]);

            CandidateProfile::create([
                'user_id' => $user->id,
                'full_name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'location' => $data['location'] ?? null,
                'headline' => $data['headline'] ?? null,
                'years_experience' => $data['years_experience'] ?? null,
                'highest_education' => $data['highest_education'] ?? null,
                'profile_visibility_status' => 'draft',
                'is_public' => false,
                'stage' => 'listed',
                'status' => 'available',
            ]);

            return $user;
        });

        Auth::login($user);

        return redirect('/candidate/dashboard')
            ->with('success', 'Welcome! Your candidate profile has been created.');
    }
}
