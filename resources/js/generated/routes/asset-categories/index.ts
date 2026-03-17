import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/asset-categories',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetCategoryController::index
 * @see app/Http/Controllers/AssetCategoryController.php:13
 * @route '/asset-categories'
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
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/asset-categories/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetCategoryController::create
 * @see app/Http/Controllers/AssetCategoryController.php:32
 * @route '/asset-categories/create'
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
* @see \App\Http\Controllers\AssetCategoryController::store
 * @see app/Http/Controllers/AssetCategoryController.php:39
 * @route '/asset-categories'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/asset-categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetCategoryController::store
 * @see app/Http/Controllers/AssetCategoryController.php:39
 * @route '/asset-categories'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetCategoryController::store
 * @see app/Http/Controllers/AssetCategoryController.php:39
 * @route '/asset-categories'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AssetCategoryController::store
 * @see app/Http/Controllers/AssetCategoryController.php:39
 * @route '/asset-categories'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetCategoryController::store
 * @see app/Http/Controllers/AssetCategoryController.php:39
 * @route '/asset-categories'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
export const edit = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/asset-categories/{assetCategory}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
edit.url = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetCategory: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetCategory: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetCategory: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetCategory: typeof args.assetCategory === 'object'
                ? args.assetCategory.id
                : args.assetCategory,
                }

    return edit.definition.url
            .replace('{assetCategory}', parsedArgs.assetCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
edit.get = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
edit.head = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
    const editForm = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
        editForm.get = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetCategoryController::edit
 * @see app/Http/Controllers/AssetCategoryController.php:49
 * @route '/asset-categories/{assetCategory}/edit'
 */
        editForm.head = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AssetCategoryController::update
 * @see app/Http/Controllers/AssetCategoryController.php:57
 * @route '/asset-categories/{assetCategory}'
 */
export const update = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/asset-categories/{assetCategory}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssetCategoryController::update
 * @see app/Http/Controllers/AssetCategoryController.php:57
 * @route '/asset-categories/{assetCategory}'
 */
update.url = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetCategory: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetCategory: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetCategory: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetCategory: typeof args.assetCategory === 'object'
                ? args.assetCategory.id
                : args.assetCategory,
                }

    return update.definition.url
            .replace('{assetCategory}', parsedArgs.assetCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetCategoryController::update
 * @see app/Http/Controllers/AssetCategoryController.php:57
 * @route '/asset-categories/{assetCategory}'
 */
update.put = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssetCategoryController::update
 * @see app/Http/Controllers/AssetCategoryController.php:57
 * @route '/asset-categories/{assetCategory}'
 */
    const updateForm = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetCategoryController::update
 * @see app/Http/Controllers/AssetCategoryController.php:57
 * @route '/asset-categories/{assetCategory}'
 */
        updateForm.put = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AssetCategoryController::destroy
 * @see app/Http/Controllers/AssetCategoryController.php:67
 * @route '/asset-categories/{assetCategory}'
 */
export const destroy = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/asset-categories/{assetCategory}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetCategoryController::destroy
 * @see app/Http/Controllers/AssetCategoryController.php:67
 * @route '/asset-categories/{assetCategory}'
 */
destroy.url = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { assetCategory: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { assetCategory: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    assetCategory: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        assetCategory: typeof args.assetCategory === 'object'
                ? args.assetCategory.id
                : args.assetCategory,
                }

    return destroy.definition.url
            .replace('{assetCategory}', parsedArgs.assetCategory.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetCategoryController::destroy
 * @see app/Http/Controllers/AssetCategoryController.php:67
 * @route '/asset-categories/{assetCategory}'
 */
destroy.delete = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AssetCategoryController::destroy
 * @see app/Http/Controllers/AssetCategoryController.php:67
 * @route '/asset-categories/{assetCategory}'
 */
    const destroyForm = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetCategoryController::destroy
 * @see app/Http/Controllers/AssetCategoryController.php:67
 * @route '/asset-categories/{assetCategory}'
 */
        destroyForm.delete = (args: { assetCategory: number | { id: number } } | [assetCategory: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const assetCategories = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default assetCategories