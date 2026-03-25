import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vacancies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyController::index
 * @see app/Http/Controllers/VacancyController.php:16
 * @route '/vacancies'
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
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/vacancies/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyController::create
 * @see app/Http/Controllers/VacancyController.php:99
 * @route '/vacancies/create'
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
* @see \App\Http\Controllers\VacancyController::store
 * @see app/Http/Controllers/VacancyController.php:106
 * @route '/vacancies'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/vacancies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VacancyController::store
 * @see app/Http/Controllers/VacancyController.php:106
 * @route '/vacancies'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::store
 * @see app/Http/Controllers/VacancyController.php:106
 * @route '/vacancies'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VacancyController::store
 * @see app/Http/Controllers/VacancyController.php:106
 * @route '/vacancies'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyController::store
 * @see app/Http/Controllers/VacancyController.php:106
 * @route '/vacancies'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
export const show = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/vacancies/{vacancy}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
show.url = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vacancy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: typeof args.vacancy === 'object'
                ? args.vacancy.id
                : args.vacancy,
                }

    return show.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
show.get = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
show.head = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
    const showForm = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
        showForm.get = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyController::show
 * @see app/Http/Controllers/VacancyController.php:122
 * @route '/vacancies/{vacancy}'
 */
        showForm.head = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
export const edit = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/vacancies/{vacancy}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
edit.url = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vacancy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: typeof args.vacancy === 'object'
                ? args.vacancy.id
                : args.vacancy,
                }

    return edit.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
edit.get = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
edit.head = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
    const editForm = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
        editForm.get = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VacancyController::edit
 * @see app/Http/Controllers/VacancyController.php:136
 * @route '/vacancies/{vacancy}/edit'
 */
        editForm.head = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
export const update = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/vacancies/{vacancy}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
update.url = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vacancy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: typeof args.vacancy === 'object'
                ? args.vacancy.id
                : args.vacancy,
                }

    return update.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
update.put = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
update.patch = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
    const updateForm = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
        updateForm.put = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\VacancyController::update
 * @see app/Http/Controllers/VacancyController.php:144
 * @route '/vacancies/{vacancy}'
 */
        updateForm.patch = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\VacancyController::destroy
 * @see app/Http/Controllers/VacancyController.php:159
 * @route '/vacancies/{vacancy}'
 */
export const destroy = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/vacancies/{vacancy}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VacancyController::destroy
 * @see app/Http/Controllers/VacancyController.php:159
 * @route '/vacancies/{vacancy}'
 */
destroy.url = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vacancy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: typeof args.vacancy === 'object'
                ? args.vacancy.id
                : args.vacancy,
                }

    return destroy.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::destroy
 * @see app/Http/Controllers/VacancyController.php:159
 * @route '/vacancies/{vacancy}'
 */
destroy.delete = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VacancyController::destroy
 * @see app/Http/Controllers/VacancyController.php:159
 * @route '/vacancies/{vacancy}'
 */
    const destroyForm = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyController::destroy
 * @see app/Http/Controllers/VacancyController.php:159
 * @route '/vacancies/{vacancy}'
 */
        destroyForm.delete = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\VacancyController::publish
 * @see app/Http/Controllers/VacancyController.php:173
 * @route '/vacancies/{vacancy}/publish'
 */
export const publish = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: publish.url(args, options),
    method: 'put',
})

publish.definition = {
    methods: ["put"],
    url: '/vacancies/{vacancy}/publish',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\VacancyController::publish
 * @see app/Http/Controllers/VacancyController.php:173
 * @route '/vacancies/{vacancy}/publish'
 */
publish.url = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vacancy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: typeof args.vacancy === 'object'
                ? args.vacancy.id
                : args.vacancy,
                }

    return publish.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::publish
 * @see app/Http/Controllers/VacancyController.php:173
 * @route '/vacancies/{vacancy}/publish'
 */
publish.put = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: publish.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\VacancyController::publish
 * @see app/Http/Controllers/VacancyController.php:173
 * @route '/vacancies/{vacancy}/publish'
 */
    const publishForm = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: publish.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyController::publish
 * @see app/Http/Controllers/VacancyController.php:173
 * @route '/vacancies/{vacancy}/publish'
 */
        publishForm.put = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: publish.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    publish.form = publishForm
/**
* @see \App\Http\Controllers\VacancyController::close
 * @see app/Http/Controllers/VacancyController.php:186
 * @route '/vacancies/{vacancy}/close'
 */
export const close = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: close.url(args, options),
    method: 'put',
})

close.definition = {
    methods: ["put"],
    url: '/vacancies/{vacancy}/close',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\VacancyController::close
 * @see app/Http/Controllers/VacancyController.php:186
 * @route '/vacancies/{vacancy}/close'
 */
close.url = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vacancy: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: typeof args.vacancy === 'object'
                ? args.vacancy.id
                : args.vacancy,
                }

    return close.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VacancyController::close
 * @see app/Http/Controllers/VacancyController.php:186
 * @route '/vacancies/{vacancy}/close'
 */
close.put = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: close.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\VacancyController::close
 * @see app/Http/Controllers/VacancyController.php:186
 * @route '/vacancies/{vacancy}/close'
 */
    const closeForm = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VacancyController::close
 * @see app/Http/Controllers/VacancyController.php:186
 * @route '/vacancies/{vacancy}/close'
 */
        closeForm.put = (args: { vacancy: number | { id: number } } | [vacancy: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    close.form = closeForm
const VacancyController = { index, create, store, show, edit, update, destroy, publish, close }

export default VacancyController