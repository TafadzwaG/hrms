import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::register
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:10
 * @route '/reports/timesheets/register'
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
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::byStatus
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:17
 * @route '/reports/timesheets/by-status'
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
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
 */
export const pendingApprovals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingApprovals.url(options),
    method: 'get',
})

pendingApprovals.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/pending-approvals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
 */
pendingApprovals.url = (options?: RouteQueryOptions) => {
    return pendingApprovals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
 */
pendingApprovals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingApprovals.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
 */
pendingApprovals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingApprovals.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
 */
    const pendingApprovalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingApprovals.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
 */
        pendingApprovalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingApprovals.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::pendingApprovals
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:22
 * @route '/reports/timesheets/pending-approvals'
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
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
export const overtimeByEmployee = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overtimeByEmployee.url(options),
    method: 'get',
})

overtimeByEmployee.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/overtime-by-employee',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
overtimeByEmployee.url = (options?: RouteQueryOptions) => {
    return overtimeByEmployee.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
overtimeByEmployee.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overtimeByEmployee.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
overtimeByEmployee.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overtimeByEmployee.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
    const overtimeByEmployeeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overtimeByEmployee.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
        overtimeByEmployeeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overtimeByEmployee.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeByEmployee
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:34
 * @route '/reports/timesheets/overtime-by-employee'
 */
        overtimeByEmployeeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overtimeByEmployee.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overtimeByEmployee.form = overtimeByEmployeeForm
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
export const overtimeSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overtimeSummary.url(options),
    method: 'get',
})

overtimeSummary.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/overtime-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
overtimeSummary.url = (options?: RouteQueryOptions) => {
    return overtimeSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
overtimeSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overtimeSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
overtimeSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overtimeSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
    const overtimeSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overtimeSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
        overtimeSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overtimeSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::overtimeSummary
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:39
 * @route '/reports/timesheets/overtime-summary'
 */
        overtimeSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overtimeSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overtimeSummary.form = overtimeSummaryForm
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
export const totalMinutesByPeriod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: totalMinutesByPeriod.url(options),
    method: 'get',
})

totalMinutesByPeriod.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/total-minutes-by-period',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
totalMinutesByPeriod.url = (options?: RouteQueryOptions) => {
    return totalMinutesByPeriod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
totalMinutesByPeriod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: totalMinutesByPeriod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
totalMinutesByPeriod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: totalMinutesByPeriod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
    const totalMinutesByPeriodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: totalMinutesByPeriod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
        totalMinutesByPeriodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: totalMinutesByPeriod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::totalMinutesByPeriod
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:46
 * @route '/reports/timesheets/total-minutes-by-period'
 */
        totalMinutesByPeriodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: totalMinutesByPeriod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    totalMinutesByPeriod.form = totalMinutesByPeriodForm
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
export const exceptionTimesheets = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exceptionTimesheets.url(options),
    method: 'get',
})

exceptionTimesheets.definition = {
    methods: ["get","head"],
    url: '/reports/timesheets/exception-timesheets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
exceptionTimesheets.url = (options?: RouteQueryOptions) => {
    return exceptionTimesheets.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
exceptionTimesheets.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exceptionTimesheets.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
exceptionTimesheets.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exceptionTimesheets.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
    const exceptionTimesheetsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exceptionTimesheets.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
        exceptionTimesheetsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exceptionTimesheets.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\TimesheetReportController::exceptionTimesheets
 * @see app/Http/Controllers/Reports/TimesheetReportController.php:51
 * @route '/reports/timesheets/exception-timesheets'
 */
        exceptionTimesheetsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exceptionTimesheets.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exceptionTimesheets.form = exceptionTimesheetsForm
const timesheets = {
    register: Object.assign(register, register),
byStatus: Object.assign(byStatus, byStatus),
pendingApprovals: Object.assign(pendingApprovals, pendingApprovals),
overtimeByEmployee: Object.assign(overtimeByEmployee, overtimeByEmployee),
overtimeSummary: Object.assign(overtimeSummary, overtimeSummary),
totalMinutesByPeriod: Object.assign(totalMinutesByPeriod, totalMinutesByPeriod),
exceptionTimesheets: Object.assign(exceptionTimesheets, exceptionTimesheets),
}

export default timesheets