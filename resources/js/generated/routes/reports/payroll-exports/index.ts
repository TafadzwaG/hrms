import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/payroll-exports/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::register
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:10
 * @route '/reports/payroll-exports/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/payroll-exports/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byStatus
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:17
 * @route '/reports/payroll-exports/by-status'
 */
        byStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byStatus.form = byStatusForm
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
export const failed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})

failed.definition = {
    methods: ["get","head"],
    url: '/reports/payroll-exports/failed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
failed.url = (options?: RouteQueryOptions) => {
    return failed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
failed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: failed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
failed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: failed.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
    const failedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: failed.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
        failedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::failed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:22
 * @route '/reports/payroll-exports/failed'
 */
        failedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: failed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    failed.form = failedForm
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
export const completed = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: completed.url(options),
    method: 'get',
})

completed.definition = {
    methods: ["get","head"],
    url: '/reports/payroll-exports/completed',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
completed.url = (options?: RouteQueryOptions) => {
    return completed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
completed.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: completed.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
completed.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: completed.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
    const completedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: completed.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
        completedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: completed.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::completed
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:34
 * @route '/reports/payroll-exports/completed'
 */
        completedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: completed.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    completed.form = completedForm
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
export const versionHistory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: versionHistory.url(options),
    method: 'get',
})

versionHistory.definition = {
    methods: ["get","head"],
    url: '/reports/payroll-exports/version-history',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
versionHistory.url = (options?: RouteQueryOptions) => {
    return versionHistory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
versionHistory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: versionHistory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
versionHistory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: versionHistory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
    const versionHistoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: versionHistory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
        versionHistoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: versionHistory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::versionHistory
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:46
 * @route '/reports/payroll-exports/version-history'
 */
        versionHistoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: versionHistory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    versionHistory.form = versionHistoryForm
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
export const byPeriod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byPeriod.url(options),
    method: 'get',
})

byPeriod.definition = {
    methods: ["get","head"],
    url: '/reports/payroll-exports/by-period',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
byPeriod.url = (options?: RouteQueryOptions) => {
    return byPeriod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
byPeriod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byPeriod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
byPeriod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byPeriod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
    const byPeriodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byPeriod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
        byPeriodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byPeriod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PayrollExportReportController::byPeriod
 * @see app/Http/Controllers/Reports/PayrollExportReportController.php:51
 * @route '/reports/payroll-exports/by-period'
 */
        byPeriodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byPeriod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byPeriod.form = byPeriodForm
const payrollExports = {
    register: Object.assign(register, register),
byStatus: Object.assign(byStatus, byStatus),
failed: Object.assign(failed, failed),
completed: Object.assign(completed, completed),
versionHistory: Object.assign(versionHistory, versionHistory),
byPeriod: Object.assign(byPeriod, byPeriod),
}

export default payrollExports