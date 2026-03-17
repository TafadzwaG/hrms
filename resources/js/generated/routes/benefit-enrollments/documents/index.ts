import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:261
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
export const store = (args: { enrollment: string | number } | [enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:261
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
store.url = (args: { enrollment: string | number } | [enrollment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: args.enrollment,
                }

    return store.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:261
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
store.post = (args: { enrollment: string | number } | [enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:261
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
    const storeForm = (args: { enrollment: string | number } | [enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:261
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
        storeForm.post = (args: { enrollment: string | number } | [enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
export const download = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments/{enrollment}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
download.url = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: args.enrollment,
                                document: args.document,
                }

    return download.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
download.get = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
download.head = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
    const downloadForm = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
        downloadForm.get = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:284
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
        downloadForm.head = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:296
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
export const destroy = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefit-enrollments/{enrollment}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:296
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
destroy.url = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: args.enrollment,
                                document: args.document,
                }

    return destroy.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:296
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
destroy.delete = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:296
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
    const destroyForm = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:296
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
        destroyForm.delete = (args: { enrollment: string | number, document: string | number } | [enrollment: string | number, document: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const documents = {
    store: Object.assign(store, store),
download: Object.assign(download, download),
destroy: Object.assign(destroy, destroy),
}

export default documents