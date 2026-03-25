<?php

use App\Http\Middleware\EnsureUserHasPermission;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ResolveCurrentOrganization;
use App\Support\Backups\ScheduledBackupDispatcher;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->alias([
            'permission' => EnsureUserHasPermission::class,
        ]);

        $middleware->web(append: [
            HandleAppearance::class,
            ResolveCurrentOrganization::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->prependToPriorityList(SubstituteBindings::class, ResolveCurrentOrganization::class);
    })
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->call(function (): void {
            app(ScheduledBackupDispatcher::class)->dispatchIfDue();
        })
            ->everyMinute()
            ->name('system-settings:scheduled-backups')
            ->withoutOverlapping(10);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
