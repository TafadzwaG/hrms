import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import comments from './comments'
import evidence from './evidence'
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
* @see \App\Http\Controllers\EmployeeScorecardController::selfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
export const selfAssessment = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: selfAssessment.url(args, options),
    method: 'post',
})

selfAssessment.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/self-assessment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::selfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
selfAssessment.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return selfAssessment.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::selfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
selfAssessment.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: selfAssessment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::selfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
    const selfAssessmentForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: selfAssessment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::selfAssessment
 * @see app/Http/Controllers/EmployeeScorecardController.php:211
 * @route '/employee-scorecards/{employee_scorecard}/self-assessment'
 */
        selfAssessmentForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: selfAssessment.url(args, options),
            method: 'post',
        })
    
    selfAssessment.form = selfAssessmentForm
/**
* @see \App\Http\Controllers\EmployeeScorecardController::managerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
export const managerReview = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: managerReview.url(args, options),
    method: 'post',
})

managerReview.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/manager-review',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::managerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
managerReview.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return managerReview.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::managerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
managerReview.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: managerReview.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::managerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
    const managerReviewForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: managerReview.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::managerReview
 * @see app/Http/Controllers/EmployeeScorecardController.php:239
 * @route '/employee-scorecards/{employee_scorecard}/manager-review'
 */
        managerReviewForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: managerReview.url(args, options),
            method: 'post',
        })
    
    managerReview.form = managerReviewForm
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
const employeeScorecards = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
selfAssessment: Object.assign(selfAssessment, selfAssessment),
managerReview: Object.assign(managerReview, managerReview),
finalize: Object.assign(finalize, finalize),
comments: Object.assign(comments, comments),
evidence: Object.assign(evidence, evidence),
}

export default employeeScorecards