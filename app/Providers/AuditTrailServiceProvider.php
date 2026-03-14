<?php

namespace App\Providers;

use App\Support\Audit\AuditLogger;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AuditTrailServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AuditLogger::class);
    }

    public function boot(): void
    {
        Event::listen(Login::class, function (Login $event): void {
            $this->app->make(AuditLogger::class)->logAuthEvent('login', $event->user, [
                'description' => 'User logged in successfully.',
            ]);
        });

        Event::listen(Logout::class, function (Logout $event): void {
            $this->app->make(AuditLogger::class)->logAuthEvent('logout', $event->user, [
                'description' => 'User logged out.',
            ]);
        });

        Event::listen(Failed::class, function (Failed $event): void {
            $identifier = Arr::except($event->credentials, ['password']);

            $this->app->make(AuditLogger::class)->logAuthEvent('failed_login', $event->user, [
                'actor_name' => $event->user?->name ?? $event->user?->email ?? ($identifier['email'] ?? $identifier['username'] ?? null),
                'description' => 'Failed login attempt.',
                'metadata' => [
                    'guard' => $event->guard,
                    'credentials' => $identifier,
                ],
            ]);
        });

        Event::listen(PasswordReset::class, function (PasswordReset $event): void {
            $this->app->make(AuditLogger::class)->logAuthEvent('password_reset', $event->user, [
                'description' => 'Password reset completed successfully.',
                'category' => 'security',
            ]);
        });
    }
}
