import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/asset-vendors',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetVendorController::index
 * @see app/Http/Controllers/AssetVendorController.php:13
 * @route '/asset-vendors'
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
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/asset-vendors/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetVendorController::create
 * @see app/Http/Controllers/AssetVendorController.php:32
 * @route '/asset-vendors/create'
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
* @see \App\Http\Controllers\AssetVendorController::store
 * @see app/Http/Controllers/AssetVendorController.php:37
 * @route '/asset-vendors'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/asset-vendors',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetVendorController::store
 * @see app/Http/Controllers/AssetVendorController.php:37
 * @route '/asset-vendors'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetVendorController::store
 * @see app/Http/Controllers/AssetVendorController.php:37
 * @route '/asset-vendors'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AssetVendorController::store
 * @see app/Http/Controllers/AssetVendorController.php:37
 * @route '/asset-vendors'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetVendorController::store
 * @see app/Http/Controllers/AssetVendorController.php:37
 * @route '/asset-vendors'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
export const edit = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/asset-vendors/{assetVendor}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
edit.url = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetVendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetVendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetVendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetVendor: typeof args.assetVendor === 'object'
                ? args.assetVendor.id
                : args.assetVendor,
                }

    return edit.definition.url
            .replace('{assetVendor}', parsedArgs.assetVendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
edit.get = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
edit.head = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
    const editForm = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
        editForm.get = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetVendorController::edit
 * @see app/Http/Controllers/AssetVendorController.php:47
 * @route '/asset-vendors/{assetVendor}/edit'
 */
        editForm.head = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AssetVendorController::update
 * @see app/Http/Controllers/AssetVendorController.php:54
 * @route '/asset-vendors/{assetVendor}'
 */
export const update = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/asset-vendors/{assetVendor}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssetVendorController::update
 * @see app/Http/Controllers/AssetVendorController.php:54
 * @route '/asset-vendors/{assetVendor}'
 */
update.url = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetVendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetVendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetVendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetVendor: typeof args.assetVendor === 'object'
                ? args.assetVendor.id
                : args.assetVendor,
                }

    return update.definition.url
            .replace('{assetVendor}', parsedArgs.assetVendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetVendorController::update
 * @see app/Http/Controllers/AssetVendorController.php:54
 * @route '/asset-vendors/{assetVendor}'
 */
update.put = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssetVendorController::update
 * @see app/Http/Controllers/AssetVendorController.php:54
 * @route '/asset-vendors/{assetVendor}'
 */
    const updateForm = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetVendorController::update
 * @see app/Http/Controllers/AssetVendorController.php:54
 * @route '/asset-vendors/{assetVendor}'
 */
        updateForm.put = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AssetVendorController::destroy
 * @see app/Http/Controllers/AssetVendorController.php:64
 * @route '/asset-vendors/{assetVendor}'
 */
export const destroy = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/asset-vendors/{assetVendor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetVendorController::destroy
 * @see app/Http/Controllers/AssetVendorController.php:64
 * @route '/asset-vendors/{assetVendor}'
 */
destroy.url = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetVendor: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetVendor: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetVendor: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetVendor: typeof args.assetVendor === 'object'
                ? args.assetVendor.id
                : args.assetVendor,
                }

    return destroy.definition.url
            .replace('{assetVendor}', parsedArgs.assetVendor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetVendorController::destroy
 * @see app/Http/Controllers/AssetVendorController.php:64
 * @route '/asset-vendors/{assetVendor}'
 */
destroy.delete = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AssetVendorController::destroy
 * @see app/Http/Controllers/AssetVendorController.php:64
 * @route '/asset-vendors/{assetVendor}'
 */
    const destroyForm = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetVendorController::destroy
 * @see app/Http/Controllers/AssetVendorController.php:64
 * @route '/asset-vendors/{assetVendor}'
 */
        destroyForm.delete = (args: { assetVendor: number | { id: number } } | [assetVendor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const assetVendors = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default assetVendors