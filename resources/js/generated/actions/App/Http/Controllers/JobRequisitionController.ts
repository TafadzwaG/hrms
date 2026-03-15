import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/job-requisitions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\JobRequisitionController::index
 * @see app/Http/Controllers/JobRequisitionController.php:19
 * @route '/job-requisitions'
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
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/job-requisitions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\JobRequisitionController::create
 * @see app/Http/Controllers/JobRequisitionController.php:68
 * @route '/job-requisitions/create'
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
* @see \App\Http\Controllers\JobRequisitionController::store
 * @see app/Http/Controllers/JobRequisitionController.php:76
 * @route '/job-requisitions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/job-requisitions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::store
 * @see app/Http/Controllers/JobRequisitionController.php:76
 * @route '/job-requisitions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::store
 * @see app/Http/Controllers/JobRequisitionController.php:76
 * @route '/job-requisitions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::store
 * @see app/Http/Controllers/JobRequisitionController.php:76
 * @route '/job-requisitions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::store
 * @see app/Http/Controllers/JobRequisitionController.php:76
 * @route '/job-requisitions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
export const show = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/job-requisitions/{job_requisition}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
show.url = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job_requisition: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    job_requisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job_requisition: args.job_requisition,
                }

    return show.definition.url
            .replace('{job_requisition}', parsedArgs.job_requisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
show.get = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
show.head = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
    const showForm = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
        showForm.get = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\JobRequisitionController::show
 * @see app/Http/Controllers/JobRequisitionController.php:87
 * @route '/job-requisitions/{job_requisition}'
 */
        showForm.head = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
export const edit = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/job-requisitions/{job_requisition}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
edit.url = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job_requisition: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    job_requisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job_requisition: args.job_requisition,
                }

    return edit.definition.url
            .replace('{job_requisition}', parsedArgs.job_requisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
edit.get = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
edit.head = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
    const editForm = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
        editForm.get = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\JobRequisitionController::edit
 * @see app/Http/Controllers/JobRequisitionController.php:97
 * @route '/job-requisitions/{job_requisition}/edit'
 */
        editForm.head = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
export const update = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/job-requisitions/{job_requisition}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
update.url = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job_requisition: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    job_requisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job_requisition: args.job_requisition,
                }

    return update.definition.url
            .replace('{job_requisition}', parsedArgs.job_requisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
update.put = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
update.patch = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
    const updateForm = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
        updateForm.put = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\JobRequisitionController::update
 * @see app/Http/Controllers/JobRequisitionController.php:107
 * @route '/job-requisitions/{job_requisition}'
 */
        updateForm.patch = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\JobRequisitionController::destroy
 * @see app/Http/Controllers/JobRequisitionController.php:121
 * @route '/job-requisitions/{job_requisition}'
 */
export const destroy = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/job-requisitions/{job_requisition}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\JobRequisitionController::destroy
 * @see app/Http/Controllers/JobRequisitionController.php:121
 * @route '/job-requisitions/{job_requisition}'
 */
destroy.url = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { job_requisition: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    job_requisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        job_requisition: args.job_requisition,
                }

    return destroy.definition.url
            .replace('{job_requisition}', parsedArgs.job_requisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobRequisitionController::destroy
 * @see app/Http/Controllers/JobRequisitionController.php:121
 * @route '/job-requisitions/{job_requisition}'
 */
destroy.delete = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\JobRequisitionController::destroy
 * @see app/Http/Controllers/JobRequisitionController.php:121
 * @route '/job-requisitions/{job_requisition}'
 */
    const destroyForm = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\JobRequisitionController::destroy
 * @see app/Http/Controllers/JobRequisitionController.php:121
 * @route '/job-requisitions/{job_requisition}'
 */
        destroyForm.delete = (args: { job_requisition: string | number } | [job_requisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const JobRequisitionController = { index, create, store, show, edit, update, destroy }

export default JobRequisitionController