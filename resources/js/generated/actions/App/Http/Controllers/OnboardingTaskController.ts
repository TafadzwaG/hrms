import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/onboarding-tasks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OnboardingTaskController::index
 * @see app/Http/Controllers/OnboardingTaskController.php:15
 * @route '/onboarding-tasks'
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
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/onboarding-tasks/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OnboardingTaskController::create
 * @see app/Http/Controllers/OnboardingTaskController.php:59
 * @route '/onboarding-tasks/create'
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
* @see \App\Http\Controllers\OnboardingTaskController::store
 * @see app/Http/Controllers/OnboardingTaskController.php:67
 * @route '/onboarding-tasks'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/onboarding-tasks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::store
 * @see app/Http/Controllers/OnboardingTaskController.php:67
 * @route '/onboarding-tasks'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::store
 * @see app/Http/Controllers/OnboardingTaskController.php:67
 * @route '/onboarding-tasks'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::store
 * @see app/Http/Controllers/OnboardingTaskController.php:67
 * @route '/onboarding-tasks'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::store
 * @see app/Http/Controllers/OnboardingTaskController.php:67
 * @route '/onboarding-tasks'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
export const show = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/onboarding-tasks/{onboarding_task}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
show.url = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { onboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    onboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        onboarding_task: args.onboarding_task,
                }

    return show.definition.url
            .replace('{onboarding_task}', parsedArgs.onboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
show.get = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
show.head = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
    const showForm = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
        showForm.get = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OnboardingTaskController::show
 * @see app/Http/Controllers/OnboardingTaskController.php:78
 * @route '/onboarding-tasks/{onboarding_task}'
 */
        showForm.head = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
export const edit = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/onboarding-tasks/{onboarding_task}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
edit.url = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { onboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    onboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        onboarding_task: args.onboarding_task,
                }

    return edit.definition.url
            .replace('{onboarding_task}', parsedArgs.onboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
edit.get = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
edit.head = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
    const editForm = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
        editForm.get = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OnboardingTaskController::edit
 * @see app/Http/Controllers/OnboardingTaskController.php:90
 * @route '/onboarding-tasks/{onboarding_task}/edit'
 */
        editForm.head = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
export const update = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/onboarding-tasks/{onboarding_task}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
update.url = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { onboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    onboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        onboarding_task: args.onboarding_task,
                }

    return update.definition.url
            .replace('{onboarding_task}', parsedArgs.onboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
update.put = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
update.patch = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
    const updateForm = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
        updateForm.put = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\OnboardingTaskController::update
 * @see app/Http/Controllers/OnboardingTaskController.php:104
 * @route '/onboarding-tasks/{onboarding_task}'
 */
        updateForm.patch = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OnboardingTaskController::destroy
 * @see app/Http/Controllers/OnboardingTaskController.php:115
 * @route '/onboarding-tasks/{onboarding_task}'
 */
export const destroy = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/onboarding-tasks/{onboarding_task}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OnboardingTaskController::destroy
 * @see app/Http/Controllers/OnboardingTaskController.php:115
 * @route '/onboarding-tasks/{onboarding_task}'
 */
destroy.url = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { onboarding_task: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    onboarding_task: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        onboarding_task: args.onboarding_task,
                }

    return destroy.definition.url
            .replace('{onboarding_task}', parsedArgs.onboarding_task.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OnboardingTaskController::destroy
 * @see app/Http/Controllers/OnboardingTaskController.php:115
 * @route '/onboarding-tasks/{onboarding_task}'
 */
destroy.delete = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OnboardingTaskController::destroy
 * @see app/Http/Controllers/OnboardingTaskController.php:115
 * @route '/onboarding-tasks/{onboarding_task}'
 */
    const destroyForm = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OnboardingTaskController::destroy
 * @see app/Http/Controllers/OnboardingTaskController.php:115
 * @route '/onboarding-tasks/{onboarding_task}'
 */
        destroyForm.delete = (args: { onboarding_task: string | number } | [onboarding_task: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const OnboardingTaskController = { index, create, store, show, edit, update, destroy }

export default OnboardingTaskController