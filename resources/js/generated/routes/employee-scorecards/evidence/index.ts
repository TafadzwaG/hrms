import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
export const store = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/evidence',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
store.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return store.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
store.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
    const storeForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
        storeForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
export const download = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
download.url = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                    evidence: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                                evidence: args.evidence,
                }

    return download.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
download.get = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
download.head = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
    const downloadForm = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
        downloadForm.get = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::download
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
        downloadForm.head = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
export const destroy = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employee-scorecards/{employee_scorecard}/evidence/{evidence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
destroy.url = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                    evidence: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                                evidence: args.evidence,
                }

    return destroy.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
destroy.delete = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
    const destroyForm = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
        destroyForm.delete = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const evidence = {
    store: Object.assign(store, store),
download: Object.assign(download, download),
destroy: Object.assign(destroy, destroy),
}

export default evidence