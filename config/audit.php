<?php

return [
    'enabled' => env('AUDIT_TRAIL_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Console Logging
    |--------------------------------------------------------------------------
    |
    | Model-level auditing is skipped for console execution by default so
    | seeding and one-off maintenance scripts do not flood the audit table.
    | Explicit manual logging still works from services, jobs, or commands.
    |
    */
    'skip_console' => env('AUDIT_TRAIL_SKIP_CONSOLE', true),

    'ignored_attributes' => [
        'created_at',
        'updated_at',
        'deleted_at',
        'remember_token',
    ],

    'redacted_attributes' => [
        'password',
        'password_confirmation',
        'current_password',
        'remember_token',
        'token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ],

    'redacted_placeholder' => '[REDACTED]',

    'critical_events' => [
        'delete',
        'force_delete',
        'restore',
        'failed_login',
        'assign_role',
        'revoke_role',
        'permission_changes',
        'password_reset',
        'password_reset_requested',
    ],
];
