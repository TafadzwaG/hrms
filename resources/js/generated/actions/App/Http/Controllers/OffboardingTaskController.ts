import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/offboarding-tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OffboardingTaskController::index
 * @see app/Http/Controllers/OffboardingTaskController.php:15
 * @route '/offboarding-tasks'
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
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/offboarding-tasks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OffboardingTaskController::create
 * @see app/Http/Controllers/OffboardingTaskController.php:53
 * @route '/offboarding-tasks/create'
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
* @see \App\Http\Controllers\OffboardingTaskController::store
 * @see app/Http/Controllers/OffboardingTaskController.php:61
 * @route '/offboarding-tasks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/offboarding-tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::store
 * @see app/Http/Controllers/OffboardingTaskController.php:61
 * @route '/offboarding-tasks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::store
 * @see app/Http/Controllers/OffboardingTaskController.php:61
 * @route '/offboarding-tasks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::store
 * @see app/Http/Controllers/OffboardingTaskController.php:61
 * @route '/offboarding-tasks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::store
 * @see app/Http/Controllers/OffboardingTaskController.php:61
 * @route '/offboarding-tasks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
export const show = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/offboarding-tasks/{offboarding_task}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
show.url = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    offboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        offboarding_task: args.offboarding_task,
                }

    return show.definition.url
            .replace('{offboarding_task}', parsedArgs.offboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
show.get = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
show.head = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
    const showForm = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
        showForm.get = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OffboardingTaskController::show
 * @see app/Http/Controllers/OffboardingTaskController.php:72
 * @route '/offboarding-tasks/{offboarding_task}'
 */
        showForm.head = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
export const edit = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/offboarding-tasks/{offboarding_task}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
edit.url = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    offboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        offboarding_task: args.offboarding_task,
                }

    return edit.definition.url
            .replace('{offboarding_task}', parsedArgs.offboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
edit.get = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
edit.head = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
    const editForm = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
        editForm.get = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OffboardingTaskController::edit
 * @see app/Http/Controllers/OffboardingTaskController.php:81
 * @route '/offboarding-tasks/{offboarding_task}/edit'
 */
        editForm.head = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
export const update = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/offboarding-tasks/{offboarding_task}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
update.url = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    offboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        offboarding_task: args.offboarding_task,
                }

    return update.definition.url
            .replace('{offboarding_task}', parsedArgs.offboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
update.put = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
update.patch = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
    const updateForm = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
        updateForm.put = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\OffboardingTaskController::update
 * @see app/Http/Controllers/OffboardingTaskController.php:92
 * @route '/offboarding-tasks/{offboarding_task}'
 */
        updateForm.patch = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OffboardingTaskController::destroy
 * @see app/Http/Controllers/OffboardingTaskController.php:103
 * @route '/offboarding-tasks/{offboarding_task}'
 */
export const destroy = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/offboarding-tasks/{offboarding_task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OffboardingTaskController::destroy
 * @see app/Http/Controllers/OffboardingTaskController.php:103
 * @route '/offboarding-tasks/{offboarding_task}'
 */
destroy.url = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { offboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    offboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        offboarding_task: args.offboarding_task,
                }

    return destroy.definition.url
            .replace('{offboarding_task}', parsedArgs.offboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OffboardingTaskController::destroy
 * @see app/Http/Controllers/OffboardingTaskController.php:103
 * @route '/offboarding-tasks/{offboarding_task}'
 */
destroy.delete = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OffboardingTaskController::destroy
 * @see app/Http/Controllers/OffboardingTaskController.php:103
 * @route '/offboarding-tasks/{offboarding_task}'
 */
    const destroyForm = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OffboardingTaskController::destroy
 * @see app/Http/Controllers/OffboardingTaskController.php:103
 * @route '/offboarding-tasks/{offboarding_task}'
 */
        destroyForm.delete = (args: { offboarding_task: string | number } | [offboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const OffboardingTaskController = { index, create, store, show, edit, update, destroy }

export default OffboardingTaskController