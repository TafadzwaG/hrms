import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/candidate-profiles/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::register
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:10
 * @route '/reports/candidate-profiles/register'
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
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
export const byStage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStage.url(options),
    method: 'get',
})

byStage.definition = {
    methods: ["get","head"],
    url: '/reports/candidate-profiles/by-stage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
byStage.url = (options?: RouteQueryOptions) => {
    return byStage.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
byStage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStage.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
byStage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStage.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
    const byStageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStage.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
        byStageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStage.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byStage
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:17
 * @route '/reports/candidate-profiles/by-stage'
 */
        byStageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStage.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byStage.form = byStageForm
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
export const bySource = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bySource.url(options),
    method: 'get',
})

bySource.definition = {
    methods: ["get","head"],
    url: '/reports/candidate-profiles/by-source',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
bySource.url = (options?: RouteQueryOptions) => {
    return bySource.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
bySource.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bySource.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
bySource.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bySource.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
    const bySourceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bySource.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
        bySourceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bySource.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::bySource
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:22
 * @route '/reports/candidate-profiles/by-source'
 */
        bySourceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bySource.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bySource.form = bySourceForm
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
export const byRequisition = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byRequisition.url(options),
    method: 'get',
})

byRequisition.definition = {
    methods: ["get","head"],
    url: '/reports/candidate-profiles/by-requisition',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
byRequisition.url = (options?: RouteQueryOptions) => {
    return byRequisition.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
byRequisition.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byRequisition.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
byRequisition.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byRequisition.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
    const byRequisitionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byRequisition.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
        byRequisitionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byRequisition.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::byRequisition
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:27
 * @route '/reports/candidate-profiles/by-requisition'
 */
        byRequisitionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byRequisition.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byRequisition.form = byRequisitionForm
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
export const hired = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hired.url(options),
    method: 'get',
})

hired.definition = {
    methods: ["get","head"],
    url: '/reports/candidate-profiles/hired',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
hired.url = (options?: RouteQueryOptions) => {
    return hired.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
hired.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hired.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
hired.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hired.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
    const hiredForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: hired.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
        hiredForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hired.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::hired
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:32
 * @route '/reports/candidate-profiles/hired'
 */
        hiredForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: hired.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    hired.form = hiredForm
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
export const rejected = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rejected.url(options),
    method: 'get',
})

rejected.definition = {
    methods: ["get","head"],
    url: '/reports/candidate-profiles/rejected',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
rejected.url = (options?: RouteQueryOptions) => {
    return rejected.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
rejected.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rejected.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
rejected.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rejected.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
    const rejectedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: rejected.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
        rejectedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rejected.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\CandidateProfileReportController::rejected
 * @see app/Http/Controllers/Reports/CandidateProfileReportController.php:44
 * @route '/reports/candidate-profiles/rejected'
 */
        rejectedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: rejected.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    rejected.form = rejectedForm
const CandidateProfileReportController = { register, byStage, bySource, byRequisition, hired, rejected }

export default CandidateProfileReportController