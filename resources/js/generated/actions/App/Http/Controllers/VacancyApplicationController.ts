import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vacancy-applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyApplicationController::index
 * @see app/Http/Controllers/VacancyApplicationController.php:14
 * @route '/vacancy-applications'
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
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/vacancy-applications/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyApplicationController::create
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/create'
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
* @see \App\Http\Controllers\VacancyApplicationController::store
 * @see app/Http/Controllers/VacancyApplicationController.php:64
 * @route '/vacancy-applications'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/vacancy-applications',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::store
 * @see app/Http/Controllers/VacancyApplicationController.php:64
 * @route '/vacancy-applications'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::store
 * @see app/Http/Controllers/VacancyApplicationController.php:64
 * @route '/vacancy-applications'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::store
 * @see app/Http/Controllers/VacancyApplicationController.php:64
 * @route '/vacancy-applications'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::store
 * @see app/Http/Controllers/VacancyApplicationController.php:64
 * @route '/vacancy-applications'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
export const show = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/vacancy-applications/{vacancy_application}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
show.url = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy_application: args.vacancy_application,
                }

    return show.definition.url
            .replace('{vacancy_application}', parsedArgs.vacancy_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
show.get = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
show.head = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
    const showForm = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
        showForm.get = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyApplicationController::show
 * @see app/Http/Controllers/VacancyApplicationController.php:87
 * @route '/vacancy-applications/{vacancy_application}'
 */
        showForm.head = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
export const edit = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/vacancy-applications/{vacancy_application}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
edit.url = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy_application: args.vacancy_application,
                }

    return edit.definition.url
            .replace('{vacancy_application}', parsedArgs.vacancy_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
edit.get = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
edit.head = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
    const editForm = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
        editForm.get = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyApplicationController::edit
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}/edit'
 */
        editForm.head = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
export const update = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/vacancy-applications/{vacancy_application}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
update.url = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy_application: args.vacancy_application,
                }

    return update.definition.url
            .replace('{vacancy_application}', parsedArgs.vacancy_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
update.put = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
update.patch = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
    const updateForm = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
        updateForm.put = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\VacancyApplicationController::update
 * @see app/Http/Controllers/VacancyApplicationController.php:0
 * @route '/vacancy-applications/{vacancy_application}'
 */
        updateForm.patch = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\VacancyApplicationController::destroy
 * @see app/Http/Controllers/VacancyApplicationController.php:132
 * @route '/vacancy-applications/{vacancy_application}'
 */
export const destroy = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/vacancy-applications/{vacancy_application}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::destroy
 * @see app/Http/Controllers/VacancyApplicationController.php:132
 * @route '/vacancy-applications/{vacancy_application}'
 */
destroy.url = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy_application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy_application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy_application: args.vacancy_application,
                }

    return destroy.definition.url
            .replace('{vacancy_application}', parsedArgs.vacancy_application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::destroy
 * @see app/Http/Controllers/VacancyApplicationController.php:132
 * @route '/vacancy-applications/{vacancy_application}'
 */
destroy.delete = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::destroy
 * @see app/Http/Controllers/VacancyApplicationController.php:132
 * @route '/vacancy-applications/{vacancy_application}'
 */
    const destroyForm = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::destroy
 * @see app/Http/Controllers/VacancyApplicationController.php:132
 * @route '/vacancy-applications/{vacancy_application}'
 */
        destroyForm.delete = (args: { vacancy_application: string | number } | [vacancy_application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\VacancyApplicationController::updateStatus
 * @see app/Http/Controllers/VacancyApplicationController.php:100
 * @route '/vacancy-applications/{application}/status'
 */
export const updateStatus = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus.url(args, options),
    method: 'put',
})

updateStatus.definition = {
    methods: ["put"],
    url: '/vacancy-applications/{application}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\VacancyApplicationController::updateStatus
 * @see app/Http/Controllers/VacancyApplicationController.php:100
 * @route '/vacancy-applications/{application}/status'
 */
updateStatus.url = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { application: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: typeof args.application === 'object'
                ? args.application.id
                : args.application,
                }

    return updateStatus.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyApplicationController::updateStatus
 * @see app/Http/Controllers/VacancyApplicationController.php:100
 * @route '/vacancy-applications/{application}/status'
 */
updateStatus.put = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\VacancyApplicationController::updateStatus
 * @see app/Http/Controllers/VacancyApplicationController.php:100
 * @route '/vacancy-applications/{application}/status'
 */
    const updateStatusForm = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyApplicationController::updateStatus
 * @see app/Http/Controllers/VacancyApplicationController.php:100
 * @route '/vacancy-applications/{application}/status'
 */
        updateStatusForm.put = (args: { application: string | number | { id: string | number } } | [application: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
const VacancyApplicationController = { index, create, store, show, edit, update, destroy, updateStatus }

export default VacancyApplicationController