import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/asset-locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetLocationController::index
 * @see app/Http/Controllers/AssetLocationController.php:14
 * @route '/asset-locations'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/asset-locations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetLocationController::create
 * @see app/Http/Controllers/AssetLocationController.php:44
 * @route '/asset-locations/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\AssetLocationController::store
 * @see app/Http/Controllers/AssetLocationController.php:49
 * @route '/asset-locations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/asset-locations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetLocationController::store
 * @see app/Http/Controllers/AssetLocationController.php:49
 * @route '/asset-locations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLocationController::store
 * @see app/Http/Controllers/AssetLocationController.php:49
 * @route '/asset-locations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AssetLocationController::store
 * @see app/Http/Controllers/AssetLocationController.php:49
 * @route '/asset-locations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetLocationController::store
 * @see app/Http/Controllers/AssetLocationController.php:49
 * @route '/asset-locations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
export const edit = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/asset-locations/{assetLocation}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
edit.url = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetLocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetLocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetLocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetLocation: typeof args.assetLocation === 'object'
                ? args.assetLocation.id
                : args.assetLocation,
                }

    return edit.definition.url
            .replace('{assetLocation}', parsedArgs.assetLocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
edit.get = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
edit.head = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
    const editForm = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
        editForm.get = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetLocationController::edit
 * @see app/Http/Controllers/AssetLocationController.php:59
 * @route '/asset-locations/{assetLocation}/edit'
 */
        editForm.head = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\AssetLocationController::update
 * @see app/Http/Controllers/AssetLocationController.php:66
 * @route '/asset-locations/{assetLocation}'
 */
export const update = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/asset-locations/{assetLocation}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssetLocationController::update
 * @see app/Http/Controllers/AssetLocationController.php:66
 * @route '/asset-locations/{assetLocation}'
 */
update.url = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetLocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetLocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetLocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetLocation: typeof args.assetLocation === 'object'
                ? args.assetLocation.id
                : args.assetLocation,
                }

    return update.definition.url
            .replace('{assetLocation}', parsedArgs.assetLocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLocationController::update
 * @see app/Http/Controllers/AssetLocationController.php:66
 * @route '/asset-locations/{assetLocation}'
 */
update.put = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssetLocationController::update
 * @see app/Http/Controllers/AssetLocationController.php:66
 * @route '/asset-locations/{assetLocation}'
 */
    const updateForm = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetLocationController::update
 * @see app/Http/Controllers/AssetLocationController.php:66
 * @route '/asset-locations/{assetLocation}'
 */
        updateForm.put = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\AssetLocationController::destroy
 * @see app/Http/Controllers/AssetLocationController.php:76
 * @route '/asset-locations/{assetLocation}'
 */
export const destroy = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/asset-locations/{assetLocation}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetLocationController::destroy
 * @see app/Http/Controllers/AssetLocationController.php:76
 * @route '/asset-locations/{assetLocation}'
 */
destroy.url = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetLocation: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetLocation: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetLocation: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetLocation: typeof args.assetLocation === 'object'
                ? args.assetLocation.id
                : args.assetLocation,
                }

    return destroy.definition.url
            .replace('{assetLocation}', parsedArgs.assetLocation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetLocationController::destroy
 * @see app/Http/Controllers/AssetLocationController.php:76
 * @route '/asset-locations/{assetLocation}'
 */
destroy.delete = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AssetLocationController::destroy
 * @see app/Http/Controllers/AssetLocationController.php:76
 * @route '/asset-locations/{assetLocation}'
 */
    const destroyForm = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetLocationController::destroy
 * @see app/Http/Controllers/AssetLocationController.php:76
 * @route '/asset-locations/{assetLocation}'
 */
        destroyForm.delete = (args: { assetLocation: number | { id: number } } | [assetLocation: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const assetLocations = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default assetLocations