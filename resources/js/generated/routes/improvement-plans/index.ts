import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/improvement-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::index
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:16
 * @route '/improvement-plans'
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
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/improvement-plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::create
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:55
 * @route '/improvement-plans/create'
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
* @see \App\Http\Controllers\PerformanceImprovementPlanController::store
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:64
 * @route '/improvement-plans'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/improvement-plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::store
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:64
 * @route '/improvement-plans'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::store
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:64
 * @route '/improvement-plans'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::store
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:64
 * @route '/improvement-plans'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::store
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:64
 * @route '/improvement-plans'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
export const show = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/improvement-plans/{improvement_plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
show.url = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { improvement_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    improvement_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        improvement_plan: args.improvement_plan,
                }

    return show.definition.url
            .replace('{improvement_plan}', parsedArgs.improvement_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
show.get = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
show.head = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
    const showForm = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
        showForm.get = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::show
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:76
 * @route '/improvement-plans/{improvement_plan}'
 */
        showForm.head = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
export const edit = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/improvement-plans/{improvement_plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
edit.url = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { improvement_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    improvement_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        improvement_plan: args.improvement_plan,
                }

    return edit.definition.url
            .replace('{improvement_plan}', parsedArgs.improvement_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
edit.get = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
edit.head = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
    const editForm = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
        editForm.get = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::edit
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:91
 * @route '/improvement-plans/{improvement_plan}/edit'
 */
        editForm.head = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
export const update = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/improvement-plans/{improvement_plan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
update.url = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { improvement_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    improvement_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        improvement_plan: args.improvement_plan,
                }

    return update.definition.url
            .replace('{improvement_plan}', parsedArgs.improvement_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
update.put = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
update.patch = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
    const updateForm = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
        updateForm.put = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::update
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:106
 * @route '/improvement-plans/{improvement_plan}'
 */
        updateForm.patch = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PerformanceImprovementPlanController::destroy
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:117
 * @route '/improvement-plans/{improvement_plan}'
 */
export const destroy = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/improvement-plans/{improvement_plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::destroy
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:117
 * @route '/improvement-plans/{improvement_plan}'
 */
destroy.url = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { improvement_plan: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    improvement_plan: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        improvement_plan: args.improvement_plan,
                }

    return destroy.definition.url
            .replace('{improvement_plan}', parsedArgs.improvement_plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::destroy
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:117
 * @route '/improvement-plans/{improvement_plan}'
 */
destroy.delete = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::destroy
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:117
 * @route '/improvement-plans/{improvement_plan}'
 */
    const destroyForm = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceImprovementPlanController::destroy
 * @see app/Http/Controllers/PerformanceImprovementPlanController.php:117
 * @route '/improvement-plans/{improvement_plan}'
 */
        destroyForm.delete = (args: { improvement_plan: string | number } | [improvement_plan: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const improvementPlans = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default improvementPlans