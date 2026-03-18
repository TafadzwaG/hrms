import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:14
 * @route '/candidate-profiles'
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
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:66
 * @route '/candidate-profiles/create'
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
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:73
 * @route '/candidate-profiles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate-profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:73
 * @route '/candidate-profiles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:73
 * @route '/candidate-profiles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:73
 * @route '/candidate-profiles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:73
 * @route '/candidate-profiles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
export const show = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate_profile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
show.url = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate_profile: args.candidate_profile,
                }

    return show.definition.url
            .replace('{candidate_profile}', parsedArgs.candidate_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
show.get = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
show.head = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
    const showForm = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
        showForm.get = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:89
 * @route '/candidate-profiles/{candidate_profile}'
 */
        showForm.head = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
export const edit = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate_profile}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
edit.url = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate_profile: args.candidate_profile,
                }

    return edit.definition.url
            .replace('{candidate_profile}', parsedArgs.candidate_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
edit.get = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
edit.head = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
    const editForm = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
        editForm.get = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:105
 * @route '/candidate-profiles/{candidate_profile}/edit'
 */
        editForm.head = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
export const update = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/candidate-profiles/{candidate_profile}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
update.url = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate_profile: args.candidate_profile,
                }

    return update.definition.url
            .replace('{candidate_profile}', parsedArgs.candidate_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
update.put = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
update.patch = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
    const updateForm = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
        updateForm.put = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:113
 * @route '/candidate-profiles/{candidate_profile}'
 */
        updateForm.patch = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:128
 * @route '/candidate-profiles/{candidate_profile}'
 */
export const destroy = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate_profile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:128
 * @route '/candidate-profiles/{candidate_profile}'
 */
destroy.url = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate_profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate_profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate_profile: args.candidate_profile,
                }

    return destroy.definition.url
            .replace('{candidate_profile}', parsedArgs.candidate_profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:128
 * @route '/candidate-profiles/{candidate_profile}'
 */
destroy.delete = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:128
 * @route '/candidate-profiles/{candidate_profile}'
 */
    const destroyForm = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:128
 * @route '/candidate-profiles/{candidate_profile}'
 */
        destroyForm.delete = (args: { candidate_profile: string | number } | [candidate_profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const candidateProfiles = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default candidateProfiles