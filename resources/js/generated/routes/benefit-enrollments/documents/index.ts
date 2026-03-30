import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
export const store = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
store.url = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                }

    return store.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
store.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
    const storeForm = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
        storeForm.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
export const download = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments/{enrollment}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
download.url = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
download.get = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
download.head = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
    const downloadForm = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
        downloadForm.get = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::download
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
        downloadForm.head = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
export const destroy = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefit-enrollments/{enrollment}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
destroy.url = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
destroy.delete = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
    const destroyForm = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
        destroyForm.delete = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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