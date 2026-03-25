import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/workflows',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::index
 * @see app/Http/Controllers/WorkflowDefinitionController.php:20
 * @route '/workflows'
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
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/workflows/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::create
 * @see app/Http/Controllers/WorkflowDefinitionController.php:64
 * @route '/workflows/create'
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
* @see \App\Http\Controllers\WorkflowDefinitionController::store
 * @see app/Http/Controllers/WorkflowDefinitionController.php:72
 * @route '/workflows'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/workflows',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::store
 * @see app/Http/Controllers/WorkflowDefinitionController.php:72
 * @route '/workflows'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::store
 * @see app/Http/Controllers/WorkflowDefinitionController.php:72
 * @route '/workflows'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::store
 * @see app/Http/Controllers/WorkflowDefinitionController.php:72
 * @route '/workflows'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::store
 * @see app/Http/Controllers/WorkflowDefinitionController.php:72
 * @route '/workflows'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
export const show = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/workflows/{workflow}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
show.url = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: args.workflow,
                }

    return show.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
show.get = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
show.head = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
    const showForm = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
        showForm.get = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::show
 * @see app/Http/Controllers/WorkflowDefinitionController.php:83
 * @route '/workflows/{workflow}'
 */
        showForm.head = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
export const edit = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/workflows/{workflow}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
edit.url = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: args.workflow,
                }

    return edit.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
edit.get = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
edit.head = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
    const editForm = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
        editForm.get = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::edit
 * @see app/Http/Controllers/WorkflowDefinitionController.php:93
 * @route '/workflows/{workflow}/edit'
 */
        editForm.head = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
export const update = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/workflows/{workflow}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
update.url = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: args.workflow,
                }

    return update.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
update.put = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
update.patch = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
    const updateForm = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
        updateForm.put = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::update
 * @see app/Http/Controllers/WorkflowDefinitionController.php:103
 * @route '/workflows/{workflow}'
 */
        updateForm.patch = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\WorkflowDefinitionController::destroy
 * @see app/Http/Controllers/WorkflowDefinitionController.php:117
 * @route '/workflows/{workflow}'
 */
export const destroy = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/workflows/{workflow}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::destroy
 * @see app/Http/Controllers/WorkflowDefinitionController.php:117
 * @route '/workflows/{workflow}'
 */
destroy.url = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { workflow: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    workflow: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        workflow: args.workflow,
                }

    return destroy.definition.url
            .replace('{workflow}', parsedArgs.workflow.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WorkflowDefinitionController::destroy
 * @see app/Http/Controllers/WorkflowDefinitionController.php:117
 * @route '/workflows/{workflow}'
 */
destroy.delete = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WorkflowDefinitionController::destroy
 * @see app/Http/Controllers/WorkflowDefinitionController.php:117
 * @route '/workflows/{workflow}'
 */
    const destroyForm = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WorkflowDefinitionController::destroy
 * @see app/Http/Controllers/WorkflowDefinitionController.php:117
 * @route '/workflows/{workflow}'
 */
        destroyForm.delete = (args: { workflow: string | number } | [workflow: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const workflows = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default workflows