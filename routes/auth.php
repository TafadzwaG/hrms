<?php

use App\Http\Controllers\PortalAuthController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\ConfirmablePasswordController;
use Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController;
use Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController;
use Laravel\Fortify\Http\Controllers\EmailVerificationPromptController;
use Laravel\Fortify\Http\Controllers\NewPasswordController;
use Laravel\Fortify\Http\Controllers\PasswordController;
use Laravel\Fortify\Http\Controllers\PasswordResetLinkController;
use Laravel\Fortify\Http\Controllers\ProfileInformationController;
use Laravel\Fortify\Http\Controllers\RecoveryCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController;
use Laravel\Fortify\Http\Controllers\VerifyEmailController;

$fortifyGuard = config('fortify.guard');
$fortifyAuthMiddleware = config('fortify.auth_middleware', 'auth').':'.$fortifyGuard;
$loginLimiter = config('fortify.limiters.login');
$twoFactorLimiter = config('fortify.limiters.two-factor');
$verificationLimiter = config('fortify.limiters.verification', '6,1');
$twoFactorMiddleware = Features::optionEnabled(Features::twoFactorAuthentication(), 'confirmPassword')
    ? [$fortifyAuthMiddleware, 'password.confirm']
    : [$fortifyAuthMiddleware];

Route::middleware(config('fortify.middleware', ['web']))->group(function () use (
    $fortifyGuard,
    $fortifyAuthMiddleware,
    $loginLimiter,
    $twoFactorLimiter,
    $verificationLimiter,
    $twoFactorMiddleware
) {
    Route::get('/login', [PortalAuthController::class, 'showLogin'])
        ->name('login');

    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:'.$fortifyGuard,
            $loginLimiter ? 'throttle:'.$loginLimiter : null,
        ]))
        ->name('login.store');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware([$fortifyAuthMiddleware])
        ->name('logout');

    if (Features::enabled(Features::resetPasswords())) {
        Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
            ->middleware(['guest:'.$fortifyGuard])
            ->name('password.request');

        Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
            ->middleware(['guest:'.$fortifyGuard])
            ->name('password.email');

        Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
            ->middleware(['guest:'.$fortifyGuard])
            ->name('password.reset');

        Route::post('/reset-password', [NewPasswordController::class, 'store'])
            ->middleware(['guest:'.$fortifyGuard])
            ->name('password.update');
    }

    if (Features::enabled(Features::registration())) {
        Route::get('/register', [PortalAuthController::class, 'showRegister'])->name('register');
        Route::post('/register', [PortalAuthController::class, 'register'])->name('register.store');
    }

    if (Features::enabled(Features::emailVerification())) {
        Route::get('/email/verify', EmailVerificationPromptController::class)
            ->middleware([$fortifyAuthMiddleware])
            ->name('verification.notice');

        Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
            ->middleware([$fortifyAuthMiddleware, 'signed', 'throttle:'.$verificationLimiter])
            ->name('verification.verify');

        Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
            ->middleware([$fortifyAuthMiddleware, 'throttle:'.$verificationLimiter])
            ->name('verification.send');
    }

    Route::put('/user/profile-information', [ProfileInformationController::class, 'update'])
        ->middleware([$fortifyAuthMiddleware])
        ->name('user-profile-information.update');

    Route::put('/user/password', [PasswordController::class, 'update'])
        ->middleware([$fortifyAuthMiddleware])
        ->name('fortify.user-password.update');

    Route::get('/user/confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->middleware([$fortifyAuthMiddleware])
        ->name('password.confirm');

    Route::get('/user/confirmed-password-status', [ConfirmedPasswordStatusController::class, 'show'])
        ->middleware([$fortifyAuthMiddleware])
        ->name('password.confirmation');

    Route::post('/user/confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->middleware([$fortifyAuthMiddleware])
        ->name('password.confirm.store');

    if (Features::enabled(Features::twoFactorAuthentication())) {
        Route::get('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'create'])
            ->middleware(['guest:'.$fortifyGuard])
            ->name('two-factor.login');

        Route::post('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'store'])
            ->middleware(array_filter([
                'guest:'.$fortifyGuard,
                $twoFactorLimiter ? 'throttle:'.$twoFactorLimiter : null,
            ]))
            ->name('two-factor.login.store');

        Route::post('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'store'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.enable');

        Route::post('/user/confirmed-two-factor-authentication', [ConfirmedTwoFactorAuthenticationController::class, 'store'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.confirm');

        Route::delete('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.disable');

        Route::get('/user/two-factor-qr-code', [TwoFactorQrCodeController::class, 'show'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.qr-code');

        Route::get('/user/two-factor-secret-key', [TwoFactorSecretKeyController::class, 'show'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.secret-key');

        Route::get('/user/two-factor-recovery-codes', [RecoveryCodeController::class, 'index'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.recovery-codes');

        Route::post('/user/two-factor-recovery-codes', [RecoveryCodeController::class, 'store'])
            ->middleware($twoFactorMiddleware)
            ->name('two-factor.regenerate-recovery-codes');
    }

    Route::redirect('/candidate/login', '/login?portal=candidate')->name('candidate.login');
    Route::post('/candidate/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:'.$fortifyGuard,
            $loginLimiter ? 'throttle:'.$loginLimiter : null,
        ]))
        ->name('candidate.login.store');

    Route::redirect('/employer/login', '/login?portal=employer')->name('employer.login');
    Route::post('/employer/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:'.$fortifyGuard,
            $loginLimiter ? 'throttle:'.$loginLimiter : null,
        ]))
        ->name('employer.login.store');

    Route::redirect('/candidate/register', '/register?portal=candidate')->name('candidate.register');
    Route::post('/candidate/register', [PortalAuthController::class, 'register'])
        ->defaults('portal', 'candidate')
        ->name('candidate.register.store');

    Route::redirect('/employer/register', '/register?portal=employer')->name('employer.register');
    Route::post('/employer/register', [PortalAuthController::class, 'register'])
        ->defaults('portal', 'employer')
        ->name('employer.register.store');

    Route::get('/portal/switch/{portal}', [PortalAuthController::class, 'switchPortal'])
        ->middleware([$fortifyAuthMiddleware])
        ->whereIn('portal', \App\Support\Auth\PortalAccessResolver::PORTALS)
        ->name('portal.switch');
});
