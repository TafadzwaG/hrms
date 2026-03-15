import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/job-requisitions/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::register
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:10
 * @route '/reports/job-requisitions/register'
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
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/job-requisitions/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byStatus
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:17
 * @route '/reports/job-requisitions/by-status'
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
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
export const byDepartment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDepartment.url(options),
    method: 'get',
})

byDepartment.definition = {
    methods: ["get","head"],
    url: '/reports/job-requisitions/by-department',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
byDepartment.url = (options?: RouteQueryOptions) => {
    return byDepartment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
byDepartment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDepartment.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
byDepartment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byDepartment.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
    const byDepartmentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byDepartment.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
        byDepartmentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDepartment.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byDepartment
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:22
 * @route '/reports/job-requisitions/by-department'
 */
        byDepartmentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDepartment.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byDepartment.form = byDepartmentForm
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
export const byHiringManager = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byHiringManager.url(options),
    method: 'get',
})

byHiringManager.definition = {
    methods: ["get","head"],
    url: '/reports/job-requisitions/by-hiring-manager',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
byHiringManager.url = (options?: RouteQueryOptions) => {
    return byHiringManager.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
byHiringManager.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byHiringManager.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
byHiringManager.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byHiringManager.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
    const byHiringManagerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byHiringManager.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
        byHiringManagerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byHiringManager.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::byHiringManager
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:27
 * @route '/reports/job-requisitions/by-hiring-manager'
 */
        byHiringManagerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byHiringManager.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byHiringManager.form = byHiringManagerForm
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
export const openingTrend = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openingTrend.url(options),
    method: 'get',
})

openingTrend.definition = {
    methods: ["get","head"],
    url: '/reports/job-requisitions/opening-trend',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
openingTrend.url = (options?: RouteQueryOptions) => {
    return openingTrend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
openingTrend.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: openingTrend.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
openingTrend.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: openingTrend.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
    const openingTrendForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: openingTrend.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
        openingTrendForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openingTrend.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\JobRequisitionReportController::openingTrend
 * @see app/Http/Controllers/Reports/JobRequisitionReportController.php:32
 * @route '/reports/job-requisitions/opening-trend'
 */
        openingTrendForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: openingTrend.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    openingTrend.form = openingTrendForm
const JobRequisitionReportController = { register, byStatus, byDepartment, byHiringManager, openingTrend }

export default JobRequisitionReportController