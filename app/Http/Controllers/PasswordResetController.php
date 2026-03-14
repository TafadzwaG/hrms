<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetLinkMail;
use App\Models\User;
use App\Support\Audit\AuditLogger;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    /**
     * ADMIN: Send reset link to a user
     * POST /users/{user}/send-password-reset-link
     */
    public function sendResetLink(User $user)
    {
        if (empty($user->email)) {
            return back()->withErrors([
                'reset' => 'Cannot send reset link: this user has no email address.',
            ]);
        }

        $token = Password::broker()->createToken($user);

        $resetUrl = rtrim(config('app.url'), '/') .
            '/reset-password?token=' . urlencode($token) .
            '&email=' . urlencode($user->email);

        // Queued mail (Mailable implements ShouldQueue)
        Mail::to($user->email)->queue(new PasswordResetLinkMail($user, $resetUrl));

        app(AuditLogger::class)->logCustom('password_reset_requested', $user, [
            'module' => 'users',
            'category' => 'security',
            'description' => 'Queued a password reset link for the user account.',
            'metadata' => [
                'delivery_channel' => 'email',
            ],
        ]);

        return back()->with('success', 'Password reset link has been queued for sending.');
    }

    /**
     * GUEST: Show reset password page (Inertia)
     * GET /reset-password?token=...&email=...
     */
    public function show(Request $request)
    {
        $token = $request->query('token');
        $email = $request->query('email');

        if (!$token || !$email) {
            return redirect('/login')->withErrors([
                'reset' => 'Invalid password reset link.',
            ]);
        }

        return Inertia::render('auth/ResetPassword', [
            'token' => $token,
            'email' => $email,
        ]);
    }

    /**
     * GUEST: Handle reset submission
     * POST /reset-password
     */
    public function store(Request $request)
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return redirect('/login')->with('success', 'Password reset successful. Please log in.');
        }

        return back()->withErrors([
            'email' => __($status),
        ]);
    }
}
