<?php

namespace App\Http\Controllers;

use App\Models\CandidateProfile;
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

            return redirect()->intended('/candidate/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function showRegister()
    {
        return Inertia::render('Candidate/Register');
    }

    public function register(Request $request): RedirectResponse
    {
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
                'stage' => 'APPLIED',
                'status' => 'ACTIVE',
            ]);

            return $user;
        });

        Auth::login($user);

        return redirect('/candidate/dashboard')
            ->with('success', 'Welcome! Your candidate profile has been created.');
    }
}
