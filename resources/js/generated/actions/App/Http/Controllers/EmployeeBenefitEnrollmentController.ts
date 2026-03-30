import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::index
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:24
 * @route '/benefit-enrollments'
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::create
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:85
 * @route '/benefit-enrollments/create'
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:92
 * @route '/benefit-enrollments'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefit-enrollments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:92
 * @route '/benefit-enrollments'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:92
 * @route '/benefit-enrollments'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:92
 * @route '/benefit-enrollments'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::store
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:92
 * @route '/benefit-enrollments'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
export const show = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments/{benefit_enrollment}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
show.url = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit_enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit_enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit_enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit_enrollment: typeof args.benefit_enrollment === 'object'
                ? args.benefit_enrollment.id
                : args.benefit_enrollment,
                }

    return show.definition.url
            .replace('{benefit_enrollment}', parsedArgs.benefit_enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
show.get = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
show.head = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
    const showForm = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
        showForm.get = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::show
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:121
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
        showForm.head = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
export const edit = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments/{benefit_enrollment}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
edit.url = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit_enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit_enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit_enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit_enrollment: typeof args.benefit_enrollment === 'object'
                ? args.benefit_enrollment.id
                : args.benefit_enrollment,
                }

    return edit.definition.url
            .replace('{benefit_enrollment}', parsedArgs.benefit_enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
edit.get = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
edit.head = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
    const editForm = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
        editForm.get = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::edit
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:142
 * @route '/benefit-enrollments/{benefit_enrollment}/edit'
 */
        editForm.head = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
export const update = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/benefit-enrollments/{benefit_enrollment}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
update.url = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit_enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { benefit_enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    benefit_enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit_enrollment: typeof args.benefit_enrollment === 'object'
                ? args.benefit_enrollment.id
                : args.benefit_enrollment,
                }

    return update.definition.url
            .replace('{benefit_enrollment}', parsedArgs.benefit_enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
update.put = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
update.patch = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
    const updateForm = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
        updateForm.put = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::update
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:158
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
        updateForm.patch = (args: { benefit_enrollment: number | { id: number } } | [benefit_enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:0
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
export const destroy = (args: { benefit_enrollment: string | number } | [benefit_enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefit-enrollments/{benefit_enrollment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:0
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
destroy.url = (args: { benefit_enrollment: string | number } | [benefit_enrollment: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit_enrollment: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    benefit_enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit_enrollment: args.benefit_enrollment,
                }

    return destroy.definition.url
            .replace('{benefit_enrollment}', parsedArgs.benefit_enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:0
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
destroy.delete = (args: { benefit_enrollment: string | number } | [benefit_enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:0
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
    const destroyForm = (args: { benefit_enrollment: string | number } | [benefit_enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroy
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:0
 * @route '/benefit-enrollments/{benefit_enrollment}'
 */
        destroyForm.delete = (args: { benefit_enrollment: string | number } | [benefit_enrollment: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::suspend
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:189
 * @route '/benefit-enrollments/{enrollment}/suspend'
 */
export const suspend = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suspend.url(args, options),
    method: 'post',
})

suspend.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/suspend',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::suspend
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:189
 * @route '/benefit-enrollments/{enrollment}/suspend'
 */
suspend.url = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                }

    return suspend.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::suspend
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:189
 * @route '/benefit-enrollments/{enrollment}/suspend'
 */
suspend.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suspend.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::suspend
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:189
 * @route '/benefit-enrollments/{enrollment}/suspend'
 */
    const suspendForm = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: suspend.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::suspend
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:189
 * @route '/benefit-enrollments/{enrollment}/suspend'
 */
        suspendForm.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: suspend.url(args, options),
            method: 'post',
        })
    
    suspend.form = suspendForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::terminate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:218
 * @route '/benefit-enrollments/{enrollment}/terminate'
 */
export const terminate = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: terminate.url(args, options),
    method: 'post',
})

terminate.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/terminate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::terminate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:218
 * @route '/benefit-enrollments/{enrollment}/terminate'
 */
terminate.url = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                }

    return terminate.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::terminate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:218
 * @route '/benefit-enrollments/{enrollment}/terminate'
 */
terminate.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: terminate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::terminate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:218
 * @route '/benefit-enrollments/{enrollment}/terminate'
 */
    const terminateForm = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: terminate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::terminate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:218
 * @route '/benefit-enrollments/{enrollment}/terminate'
 */
        terminateForm.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: terminate.url(args, options),
            method: 'post',
        })
    
    terminate.form = terminateForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::reinstate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:248
 * @route '/benefit-enrollments/{enrollment}/reinstate'
 */
export const reinstate = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reinstate.url(args, options),
    method: 'post',
})

reinstate.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/reinstate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::reinstate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:248
 * @route '/benefit-enrollments/{enrollment}/reinstate'
 */
reinstate.url = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                }

    return reinstate.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::reinstate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:248
 * @route '/benefit-enrollments/{enrollment}/reinstate'
 */
reinstate.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reinstate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::reinstate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:248
 * @route '/benefit-enrollments/{enrollment}/reinstate'
 */
    const reinstateForm = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reinstate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::reinstate
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:248
 * @route '/benefit-enrollments/{enrollment}/reinstate'
 */
        reinstateForm.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reinstate.url(args, options),
            method: 'post',
        })
    
    reinstate.form = reinstateForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::storeDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
export const storeDocument = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

storeDocument.definition = {
    methods: ["post"],
    url: '/benefit-enrollments/{enrollment}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::storeDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
storeDocument.url = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { enrollment: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { enrollment: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                }

    return storeDocument.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::storeDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
storeDocument.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::storeDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
    const storeDocumentForm = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDocument.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::storeDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:280
 * @route '/benefit-enrollments/{enrollment}/documents'
 */
        storeDocumentForm.post = (args: { enrollment: number | { id: number } } | [enrollment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDocument.url(args, options),
            method: 'post',
        })
    
    storeDocument.form = storeDocumentForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
export const downloadDocument = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})

downloadDocument.definition = {
    methods: ["get","head"],
    url: '/benefit-enrollments/{enrollment}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
downloadDocument.url = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return downloadDocument.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
downloadDocument.get = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
downloadDocument.head = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadDocument.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
    const downloadDocumentForm = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadDocument.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
        downloadDocumentForm.get = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::downloadDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:304
 * @route '/benefit-enrollments/{enrollment}/documents/{document}/download'
 */
        downloadDocumentForm.head = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadDocument.form = downloadDocumentForm
/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroyDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
export const destroyDocument = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDocument.url(args, options),
    method: 'delete',
})

destroyDocument.definition = {
    methods: ["delete"],
    url: '/benefit-enrollments/{enrollment}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroyDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
destroyDocument.url = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    enrollment: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        enrollment: typeof args.enrollment === 'object'
                ? args.enrollment.id
                : args.enrollment,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroyDocument.definition.url
            .replace('{enrollment}', parsedArgs.enrollment.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroyDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
destroyDocument.delete = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDocument.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroyDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
    const destroyDocumentForm = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyDocument.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeBenefitEnrollmentController::destroyDocument
 * @see app/Http/Controllers/EmployeeBenefitEnrollmentController.php:317
 * @route '/benefit-enrollments/{enrollment}/documents/{document}'
 */
        destroyDocumentForm.delete = (args: { enrollment: number | { id: number }, document: number | { id: number } } | [enrollment: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyDocument.form = destroyDocumentForm
const EmployeeBenefitEnrollmentController = { index, create, store, show, edit, update, destroy, suspend, terminate, reinstate, storeDocument, downloadDocument, destroyDocument }

export default EmployeeBenefitEnrollmentController