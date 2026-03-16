import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
export const store = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees/{employee}/contracts/{contract}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
store.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return store.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
store.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
    const storeForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
        storeForm.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
export const download = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts/{contract}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
download.url = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                    document: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
download.get = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
download.head = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
    const downloadForm = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
        downloadForm.get = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeContractController::download
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
        downloadForm.head = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
export const destroy = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/contracts/{contract}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
destroy.url = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                    document: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
destroy.delete = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
    const destroyForm = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
        destroyForm.delete = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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