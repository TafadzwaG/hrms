import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
export const createForRequisition = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createForRequisition.url(args, options),
    method: 'get',
})

createForRequisition.definition = {
    methods: ["get","head"],
    url: '/job-requisitions/{jobRequisition}/candidates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
createForRequisition.url = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jobRequisition: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { jobRequisition: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    jobRequisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jobRequisition: typeof args.jobRequisition === 'object'
                ? args.jobRequisition.id
                : args.jobRequisition,
                }

    return createForRequisition.definition.url
            .replace('{jobRequisition}', parsedArgs.jobRequisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
createForRequisition.get = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createForRequisition.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
createForRequisition.head = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createForRequisition.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
    const createForRequisitionForm = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createForRequisition.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
        createForRequisitionForm.get = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createForRequisition.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:75
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
        createForRequisitionForm.head = (args: { jobRequisition: number | { id: number } } | [jobRequisition: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createForRequisition.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createForRequisition.form = createForRequisitionForm
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/candidates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:20
 * @route '/candidates'
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
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/candidates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:61
 * @route '/candidates/create'
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
 * @see app/Http/Controllers/CandidateProfileController.php:87
 * @route '/candidates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:87
 * @route '/candidates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:87
 * @route '/candidates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:87
 * @route '/candidates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:87
 * @route '/candidates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
export const show = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/candidates/{candidate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
show.url = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                }

    return show.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
show.get = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
show.head = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
    const showForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
        showForm.get = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:98
 * @route '/candidates/{candidate}'
 */
        showForm.head = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
export const edit = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/candidates/{candidate}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
edit.url = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                }

    return edit.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
edit.get = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
edit.head = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
    const editForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
        editForm.get = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/{candidate}/edit'
 */
        editForm.head = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
export const update = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/candidates/{candidate}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
update.url = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                }

    return update.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
update.put = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
update.patch = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
    const updateForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
        updateForm.put = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CandidateProfileController.php:122
 * @route '/candidates/{candidate}'
 */
        updateForm.patch = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CandidateProfileController.php:136
 * @route '/candidates/{candidate}'
 */
export const destroy = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidates/{candidate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:136
 * @route '/candidates/{candidate}'
 */
destroy.url = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: args.candidate,
                }

    return destroy.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:136
 * @route '/candidates/{candidate}'
 */
destroy.delete = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:136
 * @route '/candidates/{candidate}'
 */
    const destroyForm = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
 * @see app/Http/Controllers/CandidateProfileController.php:136
 * @route '/candidates/{candidate}'
 */
        destroyForm.delete = (args: { candidate: string | number } | [candidate: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CandidateProfileController = { createForRequisition, index, create, store, show, edit, update, destroy }

export default CandidateProfileController