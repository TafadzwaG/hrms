import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/benefits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitController::index
 * @see app/Http/Controllers/BenefitController.php:20
 * @route '/benefits'
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
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/benefits/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitController::create
 * @see app/Http/Controllers/BenefitController.php:94
 * @route '/benefits/create'
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
* @see \App\Http\Controllers\BenefitController::store
 * @see app/Http/Controllers/BenefitController.php:101
 * @route '/benefits'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefits',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BenefitController::store
 * @see app/Http/Controllers/BenefitController.php:101
 * @route '/benefits'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::store
 * @see app/Http/Controllers/BenefitController.php:101
 * @route '/benefits'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BenefitController::store
 * @see app/Http/Controllers/BenefitController.php:101
 * @route '/benefits'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitController::store
 * @see app/Http/Controllers/BenefitController.php:101
 * @route '/benefits'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
export const show = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/benefits/{benefit}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
show.url = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: typeof args.benefit === 'object'
                ? args.benefit.id
                : args.benefit,
                }

    return show.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
show.get = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
show.head = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
    const showForm = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
        showForm.get = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitController::show
 * @see app/Http/Controllers/BenefitController.php:117
 * @route '/benefits/{benefit}'
 */
        showForm.head = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
export const edit = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/benefits/{benefit}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
edit.url = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: typeof args.benefit === 'object'
                ? args.benefit.id
                : args.benefit,
                }

    return edit.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
edit.get = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
edit.head = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
    const editForm = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
        editForm.get = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BenefitController::edit
 * @see app/Http/Controllers/BenefitController.php:133
 * @route '/benefits/{benefit}/edit'
 */
        editForm.head = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
export const update = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/benefits/{benefit}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
update.url = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: typeof args.benefit === 'object'
                ? args.benefit.id
                : args.benefit,
                }

    return update.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
update.put = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
update.patch = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
    const updateForm = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
        updateForm.put = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\BenefitController::update
 * @see app/Http/Controllers/BenefitController.php:142
 * @route '/benefits/{benefit}'
 */
        updateForm.patch = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BenefitController::destroy
 * @see app/Http/Controllers/BenefitController.php:158
 * @route '/benefits/{benefit}'
 */
export const destroy = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefits/{benefit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BenefitController::destroy
 * @see app/Http/Controllers/BenefitController.php:158
 * @route '/benefits/{benefit}'
 */
destroy.url = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: typeof args.benefit === 'object'
                ? args.benefit.id
                : args.benefit,
                }

    return destroy.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitController::destroy
 * @see app/Http/Controllers/BenefitController.php:158
 * @route '/benefits/{benefit}'
 */
destroy.delete = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BenefitController::destroy
 * @see app/Http/Controllers/BenefitController.php:158
 * @route '/benefits/{benefit}'
 */
    const destroyForm = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitController::destroy
 * @see app/Http/Controllers/BenefitController.php:158
 * @route '/benefits/{benefit}'
 */
        destroyForm.delete = (args: { benefit: number | { id: number } } | [benefit: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const BenefitController = { index, create, store, show, edit, update, destroy }

export default BenefitController