import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
export const index = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/benefits/{benefit}/plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
index.url = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                }

    return index.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
index.get = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
index.head = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
    const indexForm = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
        indexForm.get = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitPlanController::index
 * @see app/Http/Controllers/BenefitPlanController.php:14
 * @route '/benefits/{benefit}/plans'
 */
        indexForm.head = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
export const create = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/benefits/{benefit}/plans/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
create.url = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                }

    return create.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
create.get = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
create.head = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
    const createForm = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
        createForm.get = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitPlanController::create
 * @see app/Http/Controllers/BenefitPlanController.php:41
 * @route '/benefits/{benefit}/plans/create'
 */
        createForm.head = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BenefitPlanController::store
 * @see app/Http/Controllers/BenefitPlanController.php:49
 * @route '/benefits/{benefit}/plans'
 */
export const store = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefits/{benefit}/plans',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::store
 * @see app/Http/Controllers/BenefitPlanController.php:49
 * @route '/benefits/{benefit}/plans'
 */
store.url = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                }

    return store.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::store
 * @see app/Http/Controllers/BenefitPlanController.php:49
 * @route '/benefits/{benefit}/plans'
 */
store.post = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::store
 * @see app/Http/Controllers/BenefitPlanController.php:49
 * @route '/benefits/{benefit}/plans'
 */
    const storeForm = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::store
 * @see app/Http/Controllers/BenefitPlanController.php:49
 * @route '/benefits/{benefit}/plans'
 */
        storeForm.post = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
export const show = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/benefits/{benefit}/plans/{plan}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
show.url = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                    plan: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                                plan: args.plan,
                }

    return show.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
show.get = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
show.head = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
    const showForm = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
        showForm.get = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitPlanController::show
 * @see app/Http/Controllers/BenefitPlanController.php:0
 * @route '/benefits/{benefit}/plans/{plan}'
 */
        showForm.head = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
export const edit = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/benefits/{benefit}/plans/{plan}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
edit.url = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                    plan: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                                plan: args.plan,
                }

    return edit.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
edit.get = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
edit.head = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
    const editForm = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
        editForm.get = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitPlanController::edit
 * @see app/Http/Controllers/BenefitPlanController.php:59
 * @route '/benefits/{benefit}/plans/{plan}/edit'
 */
        editForm.head = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
export const update = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/benefits/{benefit}/plans/{plan}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
update.url = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                    plan: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                                plan: args.plan,
                }

    return update.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
update.put = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
update.patch = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
    const updateForm = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
        updateForm.put = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\BenefitPlanController::update
 * @see app/Http/Controllers/BenefitPlanController.php:68
 * @route '/benefits/{benefit}/plans/{plan}'
 */
        updateForm.patch = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BenefitPlanController::destroy
 * @see app/Http/Controllers/BenefitPlanController.php:78
 * @route '/benefits/{benefit}/plans/{plan}'
 */
export const destroy = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefits/{benefit}/plans/{plan}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BenefitPlanController::destroy
 * @see app/Http/Controllers/BenefitPlanController.php:78
 * @route '/benefits/{benefit}/plans/{plan}'
 */
destroy.url = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                    plan: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                                plan: args.plan,
                }

    return destroy.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace('{plan}', parsedArgs.plan.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitPlanController::destroy
 * @see app/Http/Controllers/BenefitPlanController.php:78
 * @route '/benefits/{benefit}/plans/{plan}'
 */
destroy.delete = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BenefitPlanController::destroy
 * @see app/Http/Controllers/BenefitPlanController.php:78
 * @route '/benefits/{benefit}/plans/{plan}'
 */
    const destroyForm = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitPlanController::destroy
 * @see app/Http/Controllers/BenefitPlanController.php:78
 * @route '/benefits/{benefit}/plans/{plan}'
 */
        destroyForm.delete = (args: { benefit: string | number, plan: string | number } | [benefit: string | number, plan: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const BenefitPlanController = { index, create, store, show, edit, update, destroy }

export default BenefitPlanController