import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import status from './status'
/**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/vacancies',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\VacanciesController::index
 * @see app/Http/Controllers/Employer/VacanciesController.php:18
 * @route '/employer/vacancies'
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
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employer/vacancies/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\VacanciesController::create
 * @see app/Http/Controllers/Employer/VacanciesController.php:55
 * @route '/employer/vacancies/create'
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
* @see \App\Http\Controllers\Employer\VacanciesController::store
 * @see app/Http/Controllers/Employer/VacanciesController.php:74
 * @route '/employer/vacancies'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employer/vacancies',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::store
 * @see app/Http/Controllers/Employer/VacanciesController.php:74
 * @route '/employer/vacancies'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::store
 * @see app/Http/Controllers/Employer/VacanciesController.php:74
 * @route '/employer/vacancies'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::store
 * @see app/Http/Controllers/Employer/VacanciesController.php:74
 * @route '/employer/vacancies'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::store
 * @see app/Http/Controllers/Employer/VacanciesController.php:74
 * @route '/employer/vacancies'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
export const show = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employer/vacancies/{vacancy}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
show.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return show.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
show.get = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
show.head = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
    const showForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
        showForm.get = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\VacanciesController::show
 * @see app/Http/Controllers/Employer/VacanciesController.php:96
 * @route '/employer/vacancies/{vacancy}'
 */
        showForm.head = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
export const edit = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employer/vacancies/{vacancy}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
edit.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return edit.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
edit.get = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
edit.head = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
    const editForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
        editForm.get = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\VacanciesController::edit
 * @see app/Http/Controllers/Employer/VacanciesController.php:126
 * @route '/employer/vacancies/{vacancy}/edit'
 */
        editForm.head = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:147
 * @route '/employer/vacancies/{vacancy}'
 */
export const update = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employer/vacancies/{vacancy}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:147
 * @route '/employer/vacancies/{vacancy}'
 */
update.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return update.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:147
 * @route '/employer/vacancies/{vacancy}'
 */
update.put = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:147
 * @route '/employer/vacancies/{vacancy}'
 */
    const updateForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:147
 * @route '/employer/vacancies/{vacancy}'
 */
        updateForm.put = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Employer\VacanciesController::destroy
 * @see app/Http/Controllers/Employer/VacanciesController.php:189
 * @route '/employer/vacancies/{vacancy}'
 */
export const destroy = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employer/vacancies/{vacancy}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::destroy
 * @see app/Http/Controllers/Employer/VacanciesController.php:189
 * @route '/employer/vacancies/{vacancy}'
 */
destroy.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return destroy.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::destroy
 * @see app/Http/Controllers/Employer/VacanciesController.php:189
 * @route '/employer/vacancies/{vacancy}'
 */
destroy.delete = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::destroy
 * @see app/Http/Controllers/Employer/VacanciesController.php:189
 * @route '/employer/vacancies/{vacancy}'
 */
    const destroyForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::destroy
 * @see app/Http/Controllers/Employer/VacanciesController.php:189
 * @route '/employer/vacancies/{vacancy}'
 */
        destroyForm.delete = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const vacancies = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
status: Object.assign(status, status),
destroy: Object.assign(destroy, destroy),
}

export default vacancies