import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetController::store
 * @see app/Http/Controllers/AssetController.php:413
 * @route '/assets/{asset}/documents'
 */
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/{asset}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetController::store
 * @see app/Http/Controllers/AssetController.php:413
 * @route '/assets/{asset}/documents'
 */
store.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { asset: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { asset: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                }

    return store.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::store
 * @see app/Http/Controllers/AssetController.php:413
 * @route '/assets/{asset}/documents'
 */
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AssetController::store
 * @see app/Http/Controllers/AssetController.php:413
 * @route '/assets/{asset}/documents'
 */
    const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetController::store
 * @see app/Http/Controllers/AssetController.php:413
 * @route '/assets/{asset}/documents'
 */
        storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
export const download = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
download.url = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return download.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
download.get = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
download.head = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
    const downloadForm = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
        downloadForm.get = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetController::download
 * @see app/Http/Controllers/AssetController.php:436
 * @route '/assets/{asset}/documents/{document}/download'
 */
        downloadForm.head = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AssetController::destroy
 * @see app/Http/Controllers/AssetController.php:455
 * @route '/assets/{asset}/documents/{document}'
 */
export const destroy = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/assets/{asset}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetController::destroy
 * @see app/Http/Controllers/AssetController.php:455
 * @route '/assets/{asset}/documents/{document}'
 */
destroy.url = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroy.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetController::destroy
 * @see app/Http/Controllers/AssetController.php:455
 * @route '/assets/{asset}/documents/{document}'
 */
destroy.delete = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AssetController::destroy
 * @see app/Http/Controllers/AssetController.php:455
 * @route '/assets/{asset}/documents/{document}'
 */
    const destroyForm = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetController::destroy
 * @see app/Http/Controllers/AssetController.php:455
 * @route '/assets/{asset}/documents/{document}'
 */
        destroyForm.delete = (args: { asset: number | { id: number }, document: number | { id: number } } | [asset: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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