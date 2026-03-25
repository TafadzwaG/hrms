import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/company-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:16
 * @route '/company-profiles'
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
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/company-profiles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:81
 * @route '/company-profiles/create'
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
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:88
 * @route '/company-profiles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/company-profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:88
 * @route '/company-profiles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:88
 * @route '/company-profiles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:88
 * @route '/company-profiles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:88
 * @route '/company-profiles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
export const show = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/company-profiles/{company}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
show.url = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { company: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    company: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company: typeof args.company === 'object'
                ? args.company.id
                : args.company,
                }

    return show.definition.url
            .replace('{company}', parsedArgs.company.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
show.get = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
show.head = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
    const showForm = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
        showForm.get = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:105
 * @route '/company-profiles/{company}'
 */
        showForm.head = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
export const edit = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/company-profiles/{company}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
edit.url = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { company: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    company: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company: typeof args.company === 'object'
                ? args.company.id
                : args.company,
                }

    return edit.definition.url
            .replace('{company}', parsedArgs.company.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
edit.get = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
edit.head = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
    const editForm = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
        editForm.get = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:119
 * @route '/company-profiles/{company}/edit'
 */
        editForm.head = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
export const update = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/company-profiles/{company}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
update.url = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { company: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    company: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company: typeof args.company === 'object'
                ? args.company.id
                : args.company,
                }

    return update.definition.url
            .replace('{company}', parsedArgs.company.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
update.put = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
update.patch = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
    const updateForm = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
        updateForm.put = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:127
 * @route '/company-profiles/{company}'
 */
        updateForm.patch = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:142
 * @route '/company-profiles/{company}'
 */
export const destroy = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/company-profiles/{company}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:142
 * @route '/company-profiles/{company}'
 */
destroy.url = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { company: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    company: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company: typeof args.company === 'object'
                ? args.company.id
                : args.company,
                }

    return destroy.definition.url
            .replace('{company}', parsedArgs.company.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:142
 * @route '/company-profiles/{company}'
 */
destroy.delete = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:142
 * @route '/company-profiles/{company}'
 */
    const destroyForm = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:142
 * @route '/company-profiles/{company}'
 */
        destroyForm.delete = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:156
 * @route '/company-profiles/{company}/approve'
 */
export const approve = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approve.url(args, options),
    method: 'put',
})

approve.definition = {
    methods: ["put"],
    url: '/company-profiles/{company}/approve',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:156
 * @route '/company-profiles/{company}/approve'
 */
approve.url = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { company: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    company: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company: typeof args.company === 'object'
                ? args.company.id
                : args.company,
                }

    return approve.definition.url
            .replace('{company}', parsedArgs.company.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:156
 * @route '/company-profiles/{company}/approve'
 */
approve.put = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approve.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:156
 * @route '/company-profiles/{company}/approve'
 */
    const approveForm = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:156
 * @route '/company-profiles/{company}/approve'
 */
        approveForm.put = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:169
 * @route '/company-profiles/{company}/suspend'
 */
export const suspend = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: suspend.url(args, options),
    method: 'put',
})

suspend.definition = {
    methods: ["put"],
    url: '/company-profiles/{company}/suspend',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:169
 * @route '/company-profiles/{company}/suspend'
 */
suspend.url = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { company: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    company: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company: typeof args.company === 'object'
                ? args.company.id
                : args.company,
                }

    return suspend.definition.url
            .replace('{company}', parsedArgs.company.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:169
 * @route '/company-profiles/{company}/suspend'
 */
suspend.put = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: suspend.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:169
 * @route '/company-profiles/{company}/suspend'
 */
    const suspendForm = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: suspend.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:169
 * @route '/company-profiles/{company}/suspend'
 */
        suspendForm.put = (args: { company: number | { id: number } } | [company: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: suspend.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    suspend.form = suspendForm
const companyProfiles = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
approve: Object.assign(approve, approve),
suspend: Object.assign(suspend, suspend),
}

export default companyProfiles