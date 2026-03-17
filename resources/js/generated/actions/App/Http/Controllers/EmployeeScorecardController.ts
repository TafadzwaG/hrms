import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employee-scorecards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::index
 * @see app/Http/Controllers/EmployeeScorecardController.php:25
 * @route '/employee-scorecards'
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
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employee-scorecards/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::create
 * @see app/Http/Controllers/EmployeeScorecardController.php:70
 * @route '/employee-scorecards/create'
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
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:77
 * @route '/employee-scorecards'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employee-scorecards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:77
 * @route '/employee-scorecards'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:77
 * @route '/employee-scorecards'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:77
 * @route '/employee-scorecards'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:77
 * @route '/employee-scorecards'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
export const show = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employee-scorecards/{employee_scorecard}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
show.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return show.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
show.get = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
show.head = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
    const showForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
        showForm.get = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::show
 * @see app/Http/Controllers/EmployeeScorecardController.php:120
 * @route '/employee-scorecards/{employee_scorecard}'
 */
        showForm.head = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
export const edit = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employee-scorecards/{employee_scorecard}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
edit.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return edit.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
edit.get = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
edit.head = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
    const editForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
        editForm.get = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::edit
 * @see app/Http/Controllers/EmployeeScorecardController.php:153
 * @route '/employee-scorecards/{employee_scorecard}/edit'
 */
        editForm.head = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
export const update = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employee-scorecards/{employee_scorecard}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
update.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return update.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
update.put = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
update.patch = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
    const updateForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
        updateForm.put = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::update
 * @see app/Http/Controllers/EmployeeScorecardController.php:163
 * @route '/employee-scorecards/{employee_scorecard}'
 */
        updateForm.patch = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:185
 * @route '/employee-scorecards/{employee_scorecard}'
 */
export const destroy = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employee-scorecards/{employee_scorecard}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:185
 * @route '/employee-scorecards/{employee_scorecard}'
 */
destroy.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return destroy.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:185
 * @route '/employee-scorecards/{employee_scorecard}'
 */
destroy.delete = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:185
 * @route '/employee-scorecards/{employee_scorecard}'
 */
    const destroyForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::destroy
 * @see app/Http/Controllers/EmployeeScorecardController.php:185
 * @route '/employee-scorecards/{employee_scorecard}'
 */
        destroyForm.delete = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeScorecardController::submitSelfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
export const submitSelfAssessment = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitSelfAssessment.url(args, options),
    method: 'post',
})

submitSelfAssessment.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/self-assessment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::submitSelfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
submitSelfAssessment.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return submitSelfAssessment.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::submitSelfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
submitSelfAssessment.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitSelfAssessment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::submitSelfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
    const submitSelfAssessmentForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitSelfAssessment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::submitSelfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
        submitSelfAssessmentForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitSelfAssessment.url(args, options),
            method: 'post',
        })
    
    submitSelfAssessment.form = submitSelfAssessmentForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::submitManagerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
export const submitManagerReview = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitManagerReview.url(args, options),
    method: 'post',
})

submitManagerReview.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/manager-review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::submitManagerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
submitManagerReview.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return submitManagerReview.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::submitManagerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
submitManagerReview.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitManagerReview.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::submitManagerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
    const submitManagerReviewForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitManagerReview.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::submitManagerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
        submitManagerReviewForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitManagerReview.url(args, options),
            method: 'post',
        })
    
    submitManagerReview.form = submitManagerReviewForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::finalize
 * @see app/Http/Controllers/EmployeeScorecardController.php:275
 * @route '/employee-scorecards/{employee_scorecard}/finalize'
 */
export const finalize = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

finalize.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/finalize',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::finalize
 * @see app/Http/Controllers/EmployeeScorecardController.php:275
 * @route '/employee-scorecards/{employee_scorecard}/finalize'
 */
finalize.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return finalize.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::finalize
 * @see app/Http/Controllers/EmployeeScorecardController.php:275
 * @route '/employee-scorecards/{employee_scorecard}/finalize'
 */
finalize.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalize.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::finalize
 * @see app/Http/Controllers/EmployeeScorecardController.php:275
 * @route '/employee-scorecards/{employee_scorecard}/finalize'
 */
    const finalizeForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalize.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::finalize
 * @see app/Http/Controllers/EmployeeScorecardController.php:275
 * @route '/employee-scorecards/{employee_scorecard}/finalize'
 */
        finalizeForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalize.url(args, options),
            method: 'post',
        })
    
    finalize.form = finalizeForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::storeComment
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
export const storeComment = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

storeComment.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::storeComment
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
storeComment.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return storeComment.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::storeComment
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
storeComment.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeComment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::storeComment
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
    const storeCommentForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeComment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::storeComment
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
        storeCommentForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeComment.url(args, options),
            method: 'post',
        })
    
    storeComment.form = storeCommentForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::storeEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
export const storeEvidence = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEvidence.url(args, options),
    method: 'post',
})

storeEvidence.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/evidence',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::storeEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
storeEvidence.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return storeEvidence.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::storeEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
storeEvidence.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEvidence.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::storeEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
    const storeEvidenceForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeEvidence.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::storeEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:288
 * @route '/employee-scorecards/{employee_scorecard}/evidence'
 */
        storeEvidenceForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeEvidence.url(args, options),
            method: 'post',
        })
    
    storeEvidence.form = storeEvidenceForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
export const downloadEvidence = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadEvidence.url(args, options),
    method: 'get',
})

downloadEvidence.definition = {
    methods: ["get","head"],
    url: '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
downloadEvidence.url = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                    evidence: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                                evidence: args.evidence,
                }

    return downloadEvidence.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
downloadEvidence.get = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadEvidence.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
downloadEvidence.head = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadEvidence.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
    const downloadEvidenceForm = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadEvidence.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
        downloadEvidenceForm.get = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadEvidence.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeScorecardController::downloadEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:313
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}/download'
 */
        downloadEvidenceForm.head = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadEvidence.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadEvidence.form = downloadEvidenceForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroyEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
export const destroyEvidence = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEvidence.url(args, options),
    method: 'delete',
})

destroyEvidence.definition = {
    methods: ["delete"],
    url: '/employee-scorecards/{employee_scorecard}/evidence/{evidence}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroyEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
destroyEvidence.url = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                    evidence: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                                evidence: args.evidence,
                }

    return destroyEvidence.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace('{evidence}', parsedArgs.evidence.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::destroyEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
destroyEvidence.delete = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEvidence.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::destroyEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
    const destroyEvidenceForm = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyEvidence.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::destroyEvidence
 * @see app/Http/Controllers/EmployeeScorecardController.php:326
 * @route '/employee-scorecards/{employee_scorecard}/evidence/{evidence}'
 */
        destroyEvidenceForm.delete = (args: { employee_scorecard: string | number, evidence: string | number } | [employee_scorecard: string | number, evidence: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyEvidence.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyEvidence.form = destroyEvidenceForm
const EmployeeScorecardController = { index, create, store, show, edit, update, destroy, submitSelfAssessment, submitManagerReview, finalize, storeComment, storeEvidence, downloadEvidence, destroyEvidence }

export default EmployeeScorecardController