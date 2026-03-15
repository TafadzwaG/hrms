import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/workflows/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::register
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:10
 * @route '/reports/workflows/register'
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
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
export const byModule = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byModule.url(options),
    method: 'get',
})

byModule.definition = {
    methods: ["get","head"],
    url: '/reports/workflows/by-module',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
byModule.url = (options?: RouteQueryOptions) => {
    return byModule.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
byModule.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byModule.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
byModule.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byModule.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
    const byModuleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byModule.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
        byModuleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byModule.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byModule
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:17
 * @route '/reports/workflows/by-module'
 */
        byModuleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byModule.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byModule.form = byModuleForm
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/workflows/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byStatus
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:22
 * @route '/reports/workflows/by-status'
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
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
export const byVersion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byVersion.url(options),
    method: 'get',
})

byVersion.definition = {
    methods: ["get","head"],
    url: '/reports/workflows/by-version',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
byVersion.url = (options?: RouteQueryOptions) => {
    return byVersion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
byVersion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byVersion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
byVersion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byVersion.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
    const byVersionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byVersion.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
        byVersionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byVersion.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byVersion
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:27
 * @route '/reports/workflows/by-version'
 */
        byVersionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byVersion.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byVersion.form = byVersionForm
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
export const byOwner = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byOwner.url(options),
    method: 'get',
})

byOwner.definition = {
    methods: ["get","head"],
    url: '/reports/workflows/by-owner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
byOwner.url = (options?: RouteQueryOptions) => {
    return byOwner.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
byOwner.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byOwner.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
byOwner.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byOwner.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
    const byOwnerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byOwner.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
        byOwnerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byOwner.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::byOwner
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:32
 * @route '/reports/workflows/by-owner'
 */
        byOwnerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byOwner.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byOwner.form = byOwnerForm
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
export const updatedTrend = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: updatedTrend.url(options),
    method: 'get',
})

updatedTrend.definition = {
    methods: ["get","head"],
    url: '/reports/workflows/updated-trend',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
updatedTrend.url = (options?: RouteQueryOptions) => {
    return updatedTrend.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
updatedTrend.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: updatedTrend.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
updatedTrend.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: updatedTrend.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
    const updatedTrendForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: updatedTrend.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
        updatedTrendForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: updatedTrend.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\WorkflowDefinitionReportController::updatedTrend
 * @see app/Http/Controllers/Reports/WorkflowDefinitionReportController.php:37
 * @route '/reports/workflows/updated-trend'
 */
        updatedTrendForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: updatedTrend.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    updatedTrend.form = updatedTrendForm
const WorkflowDefinitionReportController = { register, byModule, byStatus, byVersion, byOwner, updatedTrend }

export default WorkflowDefinitionReportController