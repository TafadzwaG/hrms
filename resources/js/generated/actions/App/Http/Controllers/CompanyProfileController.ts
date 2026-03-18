import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:14
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
 * @see app/Http/Controllers/CompanyProfileController.php:14
 * @route '/company-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:14
 * @route '/company-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:14
 * @route '/company-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:14
 * @route '/company-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:14
 * @route '/company-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::index
 * @see app/Http/Controllers/CompanyProfileController.php:14
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
 * @see app/Http/Controllers/CompanyProfileController.php:63
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
 * @see app/Http/Controllers/CompanyProfileController.php:63
 * @route '/company-profiles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:63
 * @route '/company-profiles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:63
 * @route '/company-profiles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:63
 * @route '/company-profiles/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:63
 * @route '/company-profiles/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::create
 * @see app/Http/Controllers/CompanyProfileController.php:63
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
 * @see app/Http/Controllers/CompanyProfileController.php:70
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
 * @see app/Http/Controllers/CompanyProfileController.php:70
 * @route '/company-profiles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:70
 * @route '/company-profiles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:70
 * @route '/company-profiles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::store
 * @see app/Http/Controllers/CompanyProfileController.php:70
 * @route '/company-profiles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
export const show = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/company-profiles/{company_profile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
show.url = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    company_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company_profile: args.company_profile,
                }

    return show.definition.url
            .replace('{company_profile}', parsedArgs.company_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
show.get = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
show.head = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
    const showForm = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
        showForm.get = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::show
 * @see app/Http/Controllers/CompanyProfileController.php:86
 * @route '/company-profiles/{company_profile}'
 */
        showForm.head = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
export const edit = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/company-profiles/{company_profile}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
edit.url = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    company_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company_profile: args.company_profile,
                }

    return edit.definition.url
            .replace('{company_profile}', parsedArgs.company_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
edit.get = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
edit.head = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
    const editForm = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
        editForm.get = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompanyProfileController::edit
 * @see app/Http/Controllers/CompanyProfileController.php:100
 * @route '/company-profiles/{company_profile}/edit'
 */
        editForm.head = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
export const update = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/company-profiles/{company_profile}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
update.url = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    company_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company_profile: args.company_profile,
                }

    return update.definition.url
            .replace('{company_profile}', parsedArgs.company_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
update.put = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
update.patch = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::update
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
    const updateForm = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
        updateForm.put = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:108
 * @route '/company-profiles/{company_profile}'
 */
        updateForm.patch = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:123
 * @route '/company-profiles/{company_profile}'
 */
export const destroy = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/company-profiles/{company_profile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:123
 * @route '/company-profiles/{company_profile}'
 */
destroy.url = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { company_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    company_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        company_profile: args.company_profile,
                }

    return destroy.definition.url
            .replace('{company_profile}', parsedArgs.company_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:123
 * @route '/company-profiles/{company_profile}'
 */
destroy.delete = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::destroy
 * @see app/Http/Controllers/CompanyProfileController.php:123
 * @route '/company-profiles/{company_profile}'
 */
    const destroyForm = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:123
 * @route '/company-profiles/{company_profile}'
 */
        destroyForm.delete = (args: { company_profile: string | number } | [company_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:137
 * @route '/company-profiles/{company}/approve'
 */
export const approve = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approve.url(args, options),
    method: 'put',
})

approve.definition = {
    methods: ["put"],
    url: '/company-profiles/{company}/approve',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:137
 * @route '/company-profiles/{company}/approve'
 */
approve.url = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/CompanyProfileController.php:137
 * @route '/company-profiles/{company}/approve'
 */
approve.put = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: approve.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::approve
 * @see app/Http/Controllers/CompanyProfileController.php:137
 * @route '/company-profiles/{company}/approve'
 */
    const approveForm = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:137
 * @route '/company-profiles/{company}/approve'
 */
        approveForm.put = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:150
 * @route '/company-profiles/{company}/suspend'
 */
export const suspend = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: suspend.url(args, options),
    method: 'put',
})

suspend.definition = {
    methods: ["put"],
    url: '/company-profiles/{company}/suspend',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:150
 * @route '/company-profiles/{company}/suspend'
 */
suspend.url = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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
 * @see app/Http/Controllers/CompanyProfileController.php:150
 * @route '/company-profiles/{company}/suspend'
 */
suspend.put = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: suspend.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CompanyProfileController::suspend
 * @see app/Http/Controllers/CompanyProfileController.php:150
 * @route '/company-profiles/{company}/suspend'
 */
    const suspendForm = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CompanyProfileController.php:150
 * @route '/company-profiles/{company}/suspend'
 */
        suspendForm.put = (args: { company: string | number | { id: string | number } } | [company: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: suspend.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    suspend.form = suspendForm
const CompanyProfileController = { index, create, store, show, edit, update, destroy, approve, suspend }

export default CompanyProfileController