<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Support\Audit\AuditLogger;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $before = [
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'email_verified_at' => optional($request->user()->email_verified_at)->toDateTimeString(),
        ];

        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        app(AuditLogger::class)->logCustom('profile_update', $request->user(), [
            'module' => 'settings',
            'description' => 'Updated personal profile settings.',
            'old_values' => $before,
            'new_values' => [
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'email_verified_at' => optional($request->user()->email_verified_at)->toDateTimeString(),
            ],
        ]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        app(AuditLogger::class)->logCustom('profile_delete', $user, [
            'module' => 'settings',
            'description' => 'Deleted personal account profile.',
            'old_values' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
