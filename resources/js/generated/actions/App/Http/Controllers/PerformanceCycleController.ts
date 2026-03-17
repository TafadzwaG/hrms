import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/performance-cycles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceCycleController::index
 * @see app/Http/Controllers/PerformanceCycleController.php:14
 * @route '/performance-cycles'
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
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/performance-cycles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceCycleController::create
 * @see app/Http/Controllers/PerformanceCycleController.php:37
 * @route '/performance-cycles/create'
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
* @see \App\Http\Controllers\PerformanceCycleController::store
 * @see app/Http/Controllers/PerformanceCycleController.php:44
 * @route '/performance-cycles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/performance-cycles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::store
 * @see app/Http/Controllers/PerformanceCycleController.php:44
 * @route '/performance-cycles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::store
 * @see app/Http/Controllers/PerformanceCycleController.php:44
 * @route '/performance-cycles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::store
 * @see app/Http/Controllers/PerformanceCycleController.php:44
 * @route '/performance-cycles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::store
 * @see app/Http/Controllers/PerformanceCycleController.php:44
 * @route '/performance-cycles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
export const show = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/performance-cycles/{performance_cycle}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
show.url = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_cycle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_cycle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_cycle: args.performance_cycle,
                }

    return show.definition.url
            .replace('{performance_cycle}', parsedArgs.performance_cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
show.get = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
show.head = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
    const showForm = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
        showForm.get = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceCycleController::show
 * @see app/Http/Controllers/PerformanceCycleController.php:56
 * @route '/performance-cycles/{performance_cycle}'
 */
        showForm.head = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
export const edit = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/performance-cycles/{performance_cycle}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
edit.url = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_cycle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_cycle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_cycle: args.performance_cycle,
                }

    return edit.definition.url
            .replace('{performance_cycle}', parsedArgs.performance_cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
edit.get = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
edit.head = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
    const editForm = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
        editForm.get = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceCycleController::edit
 * @see app/Http/Controllers/PerformanceCycleController.php:67
 * @route '/performance-cycles/{performance_cycle}/edit'
 */
        editForm.head = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
export const update = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/performance-cycles/{performance_cycle}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
update.url = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_cycle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_cycle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_cycle: args.performance_cycle,
                }

    return update.definition.url
            .replace('{performance_cycle}', parsedArgs.performance_cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
update.put = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
update.patch = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
    const updateForm = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
        updateForm.put = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\PerformanceCycleController::update
 * @see app/Http/Controllers/PerformanceCycleController.php:75
 * @route '/performance-cycles/{performance_cycle}'
 */
        updateForm.patch = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PerformanceCycleController::destroy
 * @see app/Http/Controllers/PerformanceCycleController.php:86
 * @route '/performance-cycles/{performance_cycle}'
 */
export const destroy = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/performance-cycles/{performance_cycle}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PerformanceCycleController::destroy
 * @see app/Http/Controllers/PerformanceCycleController.php:86
 * @route '/performance-cycles/{performance_cycle}'
 */
destroy.url = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_cycle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_cycle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_cycle: args.performance_cycle,
                }

    return destroy.definition.url
            .replace('{performance_cycle}', parsedArgs.performance_cycle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceCycleController::destroy
 * @see app/Http/Controllers/PerformanceCycleController.php:86
 * @route '/performance-cycles/{performance_cycle}'
 */
destroy.delete = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PerformanceCycleController::destroy
 * @see app/Http/Controllers/PerformanceCycleController.php:86
 * @route '/performance-cycles/{performance_cycle}'
 */
    const destroyForm = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceCycleController::destroy
 * @see app/Http/Controllers/PerformanceCycleController.php:86
 * @route '/performance-cycles/{performance_cycle}'
 */
        destroyForm.delete = (args: { performance_cycle: string | number } | [performance_cycle: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const PerformanceCycleController = { index, create, store, show, edit, update, destroy }

export default PerformanceCycleController