import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
export const index = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/maintenance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
index.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
index.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
index.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
    const indexForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
        indexForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetMaintenanceController::index
 * @see app/Http/Controllers/AssetMaintenanceController.php:18
 * @route '/assets/{asset}/maintenance'
 */
        indexForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
export const create = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/maintenance/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
create.url = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return create.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
create.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
create.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
    const createForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
        createForm.get = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetMaintenanceController::create
 * @see app/Http/Controllers/AssetMaintenanceController.php:30
 * @route '/assets/{asset}/maintenance/create'
 */
        createForm.head = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\AssetMaintenanceController::store
 * @see app/Http/Controllers/AssetMaintenanceController.php:38
 * @route '/assets/{asset}/maintenance'
 */
export const store = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/{asset}/maintenance',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::store
 * @see app/Http/Controllers/AssetMaintenanceController.php:38
 * @route '/assets/{asset}/maintenance'
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
* @see \App\Http\Controllers\AssetMaintenanceController::store
 * @see app/Http/Controllers/AssetMaintenanceController.php:38
 * @route '/assets/{asset}/maintenance'
 */
store.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::store
 * @see app/Http/Controllers/AssetMaintenanceController.php:38
 * @route '/assets/{asset}/maintenance'
 */
    const storeForm = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::store
 * @see app/Http/Controllers/AssetMaintenanceController.php:38
 * @route '/assets/{asset}/maintenance'
 */
        storeForm.post = (args: { asset: number | { id: number } } | [asset: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
export const show = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/maintenance/{maintenance}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
show.url = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                    maintenance: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                                maintenance: typeof args.maintenance === 'object'
                ? args.maintenance.id
                : args.maintenance,
                }

    return show.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{maintenance}', parsedArgs.maintenance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
show.get = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
show.head = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
    const showForm = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
        showForm.get = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetMaintenanceController::show
 * @see app/Http/Controllers/AssetMaintenanceController.php:52
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
        showForm.head = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
export const edit = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/assets/{asset}/maintenance/{maintenance}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
edit.url = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                    maintenance: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                                maintenance: typeof args.maintenance === 'object'
                ? args.maintenance.id
                : args.maintenance,
                }

    return edit.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{maintenance}', parsedArgs.maintenance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
edit.get = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
edit.head = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
    const editForm = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
        editForm.get = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetMaintenanceController::edit
 * @see app/Http/Controllers/AssetMaintenanceController.php:63
 * @route '/assets/{asset}/maintenance/{maintenance}/edit'
 */
        editForm.head = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AssetMaintenanceController::update
 * @see app/Http/Controllers/AssetMaintenanceController.php:75
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
export const update = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/assets/{asset}/maintenance/{maintenance}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::update
 * @see app/Http/Controllers/AssetMaintenanceController.php:75
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
update.url = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                    maintenance: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                                maintenance: typeof args.maintenance === 'object'
                ? args.maintenance.id
                : args.maintenance,
                }

    return update.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{maintenance}', parsedArgs.maintenance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetMaintenanceController::update
 * @see app/Http/Controllers/AssetMaintenanceController.php:75
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
update.put = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::update
 * @see app/Http/Controllers/AssetMaintenanceController.php:75
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
    const updateForm = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::update
 * @see app/Http/Controllers/AssetMaintenanceController.php:75
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
        updateForm.put = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AssetMaintenanceController::destroy
 * @see app/Http/Controllers/AssetMaintenanceController.php:128
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
export const destroy = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/assets/{asset}/maintenance/{maintenance}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AssetMaintenanceController::destroy
 * @see app/Http/Controllers/AssetMaintenanceController.php:128
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
destroy.url = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    asset: args[0],
                    maintenance: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        asset: typeof args.asset === 'object'
                ? args.asset.id
                : args.asset,
                                maintenance: typeof args.maintenance === 'object'
                ? args.maintenance.id
                : args.maintenance,
                }

    return destroy.definition.url
            .replace('{asset}', parsedArgs.asset.toString())
            .replace('{maintenance}', parsedArgs.maintenance.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetMaintenanceController::destroy
 * @see app/Http/Controllers/AssetMaintenanceController.php:128
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
destroy.delete = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AssetMaintenanceController::destroy
 * @see app/Http/Controllers/AssetMaintenanceController.php:128
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
    const destroyForm = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetMaintenanceController::destroy
 * @see app/Http/Controllers/AssetMaintenanceController.php:128
 * @route '/assets/{asset}/maintenance/{maintenance}'
 */
        destroyForm.delete = (args: { asset: number | { id: number }, maintenance: number | { id: number } } | [asset: number | { id: number }, maintenance: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AssetMaintenanceController = { index, create, store, show, edit, update, destroy }

export default AssetMaintenanceController