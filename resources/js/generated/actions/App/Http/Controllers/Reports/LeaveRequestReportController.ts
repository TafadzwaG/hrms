import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::register
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:10
 * @route '/reports/leave-requests/register'
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
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byStatus
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:17
 * @route '/reports/leave-requests/by-status'
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
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
export const byType = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(options),
    method: 'get',
})

byType.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/by-type',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
byType.url = (options?: RouteQueryOptions) => {
    return byType.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
byType.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
byType.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byType.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
    const byTypeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byType.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
        byTypeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byType.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byType
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:22
 * @route '/reports/leave-requests/by-type'
 */
        byTypeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byType.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byType.form = byTypeForm
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
export const byEmployee = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byEmployee.url(options),
    method: 'get',
})

byEmployee.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/by-employee',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
byEmployee.url = (options?: RouteQueryOptions) => {
    return byEmployee.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
byEmployee.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byEmployee.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
byEmployee.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byEmployee.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
    const byEmployeeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byEmployee.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
        byEmployeeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byEmployee.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byEmployee
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:27
 * @route '/reports/leave-requests/by-employee'
 */
        byEmployeeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byEmployee.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byEmployee.form = byEmployeeForm
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
export const byMonth = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byMonth.url(options),
    method: 'get',
})

byMonth.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/by-month',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
byMonth.url = (options?: RouteQueryOptions) => {
    return byMonth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
byMonth.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byMonth.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
byMonth.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byMonth.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
    const byMonthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byMonth.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
        byMonthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byMonth.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::byMonth
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:32
 * @route '/reports/leave-requests/by-month'
 */
        byMonthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byMonth.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byMonth.form = byMonthForm
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
export const pendingApprovals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingApprovals.url(options),
    method: 'get',
})

pendingApprovals.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/pending-approvals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
pendingApprovals.url = (options?: RouteQueryOptions) => {
    return pendingApprovals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
pendingApprovals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingApprovals.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
pendingApprovals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingApprovals.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
    const pendingApprovalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingApprovals.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
        pendingApprovalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingApprovals.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:37
 * @route '/reports/leave-requests/pending-approvals'
 */
        pendingApprovalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingApprovals.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendingApprovals.form = pendingApprovalsForm
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
export const durationSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: durationSummary.url(options),
    method: 'get',
})

durationSummary.definition = {
    methods: ["get","head"],
    url: '/reports/leave-requests/duration-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
durationSummary.url = (options?: RouteQueryOptions) => {
    return durationSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
durationSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: durationSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
durationSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: durationSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
    const durationSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: durationSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
        durationSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: durationSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LeaveRequestReportController::durationSummary
 * @see app/Http/Controllers/Reports/LeaveRequestReportController.php:49
 * @route '/reports/leave-requests/duration-summary'
 */
        durationSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: durationSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    durationSummary.form = durationSummaryForm
const LeaveRequestReportController = { register, byStatus, byType, byEmployee, byMonth, pendingApprovals, durationSummary }

export default LeaveRequestReportController