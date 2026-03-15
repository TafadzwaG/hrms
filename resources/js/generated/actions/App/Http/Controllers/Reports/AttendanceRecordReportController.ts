import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::register
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:10
 * @route '/reports/attendance-records/register'
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
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byStatus
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:17
 * @route '/reports/attendance-records/by-status'
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
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
export const byDate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDate.url(options),
    method: 'get',
})

byDate.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/by-date',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
byDate.url = (options?: RouteQueryOptions) => {
    return byDate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
byDate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
byDate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byDate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
    const byDateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byDate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
        byDateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::byDate
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:22
 * @route '/reports/attendance-records/by-date'
 */
        byDateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byDate.form = byDateForm
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
export const missingClockIn = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingClockIn.url(options),
    method: 'get',
})

missingClockIn.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/missing-clock-in',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
missingClockIn.url = (options?: RouteQueryOptions) => {
    return missingClockIn.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
missingClockIn.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingClockIn.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
missingClockIn.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: missingClockIn.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
    const missingClockInForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: missingClockIn.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
        missingClockInForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingClockIn.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockIn
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:27
 * @route '/reports/attendance-records/missing-clock-in'
 */
        missingClockInForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingClockIn.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    missingClockIn.form = missingClockInForm
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
export const missingClockOut = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingClockOut.url(options),
    method: 'get',
})

missingClockOut.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/missing-clock-out',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
missingClockOut.url = (options?: RouteQueryOptions) => {
    return missingClockOut.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
missingClockOut.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingClockOut.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
missingClockOut.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: missingClockOut.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
    const missingClockOutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: missingClockOut.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
        missingClockOutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingClockOut.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::missingClockOut
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:38
 * @route '/reports/attendance-records/missing-clock-out'
 */
        missingClockOutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingClockOut.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    missingClockOut.form = missingClockOutForm
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
export const lateArrivals = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lateArrivals.url(options),
    method: 'get',
})

lateArrivals.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/late-arrivals',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
lateArrivals.url = (options?: RouteQueryOptions) => {
    return lateArrivals.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
lateArrivals.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: lateArrivals.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
lateArrivals.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: lateArrivals.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
    const lateArrivalsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: lateArrivals.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
        lateArrivalsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lateArrivals.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::lateArrivals
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:49
 * @route '/reports/attendance-records/late-arrivals'
 */
        lateArrivalsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: lateArrivals.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    lateArrivals.form = lateArrivalsForm
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
export const exceptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exceptions.url(options),
    method: 'get',
})

exceptions.definition = {
    methods: ["get","head"],
    url: '/reports/attendance-records/exceptions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
exceptions.url = (options?: RouteQueryOptions) => {
    return exceptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
exceptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exceptions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
exceptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exceptions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
    const exceptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exceptions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
        exceptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exceptions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AttendanceRecordReportController::exceptions
 * @see app/Http/Controllers/Reports/AttendanceRecordReportController.php:61
 * @route '/reports/attendance-records/exceptions'
 */
        exceptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exceptions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exceptions.form = exceptionsForm
const AttendanceRecordReportController = { register, byStatus, byDate, missingClockIn, missingClockOut, lateArrivals, exceptions }

export default AttendanceRecordReportController