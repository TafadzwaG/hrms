import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:462
 * @route '/employees/{employee}/documents'
 */
export const store = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees/{employee}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:462
 * @route '/employees/{employee}/documents'
 */
store.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return store.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:462
 * @route '/employees/{employee}/documents'
 */
store.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:462
 * @route '/employees/{employee}/documents'
 */
    const storeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:462
 * @route '/employees/{employee}/documents'
 */
        storeForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
export const download = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
download.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
download.get = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
download.head = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
    const downloadForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
        downloadForm.get = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::download
 * @see app/Http/Controllers/EmployeeController.php:498
 * @route '/employees/{employee}/documents/{document}/download'
 */
        downloadForm.head = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:525
 * @route '/employees/{employee}/documents/{document}'
 */
export const destroy = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:525
 * @route '/employees/{employee}/documents/{document}'
 */
destroy.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:525
 * @route '/employees/{employee}/documents/{document}'
 */
destroy.delete = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:525
 * @route '/employees/{employee}/documents/{document}'
 */
    const destroyForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:525
 * @route '/employees/{employee}/documents/{document}'
 */
        destroyForm.delete = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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