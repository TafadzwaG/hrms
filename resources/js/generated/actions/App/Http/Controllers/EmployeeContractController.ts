import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
export const index = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
index.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return index.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
index.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
index.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
    const indexForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
        indexForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeContractController::index
 * @see app/Http/Controllers/EmployeeContractController.php:20
 * @route '/employees/{employee}/contracts'
 */
        indexForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
export const create = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
create.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return create.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
create.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
create.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
    const createForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
        createForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeContractController::create
 * @see app/Http/Controllers/EmployeeContractController.php:36
 * @route '/employees/{employee}/contracts/create'
 */
        createForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:44
 * @route '/employees/{employee}/contracts'
 */
export const store = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees/{employee}/contracts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:44
 * @route '/employees/{employee}/contracts'
 */
store.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return store.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:44
 * @route '/employees/{employee}/contracts'
 */
store.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:44
 * @route '/employees/{employee}/contracts'
 */
    const storeForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::store
 * @see app/Http/Controllers/EmployeeContractController.php:44
 * @route '/employees/{employee}/contracts'
 */
        storeForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
export const show = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts/{contract}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
show.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
show.get = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
show.head = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
    const showForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
        showForm.get = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeContractController::show
 * @see app/Http/Controllers/EmployeeContractController.php:67
 * @route '/employees/{employee}/contracts/{contract}'
 */
        showForm.head = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
export const edit = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts/{contract}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
edit.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return edit.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
edit.get = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
edit.head = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
    const editForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
        editForm.get = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeContractController::edit
 * @see app/Http/Controllers/EmployeeContractController.php:85
 * @route '/employees/{employee}/contracts/{contract}/edit'
 */
        editForm.head = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeContractController::update
 * @see app/Http/Controllers/EmployeeContractController.php:98
 * @route '/employees/{employee}/contracts/{contract}'
 */
export const update = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/employees/{employee}/contracts/{contract}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::update
 * @see app/Http/Controllers/EmployeeContractController.php:98
 * @route '/employees/{employee}/contracts/{contract}'
 */
update.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return update.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::update
 * @see app/Http/Controllers/EmployeeContractController.php:98
 * @route '/employees/{employee}/contracts/{contract}'
 */
update.put = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::update
 * @see app/Http/Controllers/EmployeeContractController.php:98
 * @route '/employees/{employee}/contracts/{contract}'
 */
    const updateForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::update
 * @see app/Http/Controllers/EmployeeContractController.php:98
 * @route '/employees/{employee}/contracts/{contract}'
 */
        updateForm.put = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:125
 * @route '/employees/{employee}/contracts/{contract}'
 */
export const destroy = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/contracts/{contract}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:125
 * @route '/employees/{employee}/contracts/{contract}'
 */
destroy.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:125
 * @route '/employees/{employee}/contracts/{contract}'
 */
destroy.delete = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:125
 * @route '/employees/{employee}/contracts/{contract}'
 */
    const destroyForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::destroy
 * @see app/Http/Controllers/EmployeeContractController.php:125
 * @route '/employees/{employee}/contracts/{contract}'
 */
        destroyForm.delete = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeContractController::activate
 * @see app/Http/Controllers/EmployeeContractController.php:134
 * @route '/employees/{employee}/contracts/{contract}/activate'
 */
export const activate = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

activate.definition = {
    methods: ["post"],
    url: '/employees/{employee}/contracts/{contract}/activate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::activate
 * @see app/Http/Controllers/EmployeeContractController.php:134
 * @route '/employees/{employee}/contracts/{contract}/activate'
 */
activate.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return activate.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::activate
 * @see app/Http/Controllers/EmployeeContractController.php:134
 * @route '/employees/{employee}/contracts/{contract}/activate'
 */
activate.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: activate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::activate
 * @see app/Http/Controllers/EmployeeContractController.php:134
 * @route '/employees/{employee}/contracts/{contract}/activate'
 */
    const activateForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: activate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::activate
 * @see app/Http/Controllers/EmployeeContractController.php:134
 * @route '/employees/{employee}/contracts/{contract}/activate'
 */
        activateForm.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: activate.url(args, options),
            method: 'post',
        })
    
    activate.form = activateForm
/**
* @see \App\Http\Controllers\EmployeeContractController::terminate
 * @see app/Http/Controllers/EmployeeContractController.php:159
 * @route '/employees/{employee}/contracts/{contract}/terminate'
 */
export const terminate = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: terminate.url(args, options),
    method: 'post',
})

terminate.definition = {
    methods: ["post"],
    url: '/employees/{employee}/contracts/{contract}/terminate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::terminate
 * @see app/Http/Controllers/EmployeeContractController.php:159
 * @route '/employees/{employee}/contracts/{contract}/terminate'
 */
terminate.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return terminate.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::terminate
 * @see app/Http/Controllers/EmployeeContractController.php:159
 * @route '/employees/{employee}/contracts/{contract}/terminate'
 */
terminate.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: terminate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::terminate
 * @see app/Http/Controllers/EmployeeContractController.php:159
 * @route '/employees/{employee}/contracts/{contract}/terminate'
 */
    const terminateForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: terminate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::terminate
 * @see app/Http/Controllers/EmployeeContractController.php:159
 * @route '/employees/{employee}/contracts/{contract}/terminate'
 */
        terminateForm.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: terminate.url(args, options),
            method: 'post',
        })
    
    terminate.form = terminateForm
/**
* @see \App\Http\Controllers\EmployeeContractController::storeDocument
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
export const storeDocument = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

storeDocument.definition = {
    methods: ["post"],
    url: '/employees/{employee}/contracts/{contract}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::storeDocument
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
storeDocument.url = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                }

    return storeDocument.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::storeDocument
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
storeDocument.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::storeDocument
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
    const storeDocumentForm = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDocument.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::storeDocument
 * @see app/Http/Controllers/EmployeeContractController.php:183
 * @route '/employees/{employee}/contracts/{contract}/documents'
 */
        storeDocumentForm.post = (args: { employee: number | { id: number }, contract: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDocument.url(args, options),
            method: 'post',
        })
    
    storeDocument.form = storeDocumentForm
/**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
export const downloadDocument = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})

downloadDocument.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/contracts/{contract}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
downloadDocument.url = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                    document: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return downloadDocument.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
downloadDocument.get = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
downloadDocument.head = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadDocument.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
    const downloadDocumentForm = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadDocument.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
        downloadDocumentForm.get = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeContractController::downloadDocument
 * @see app/Http/Controllers/EmployeeContractController.php:205
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}/download'
 */
        downloadDocumentForm.head = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeContractController::destroyDocument
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
export const destroyDocument = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDocument.url(args, options),
    method: 'delete',
})

destroyDocument.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/contracts/{contract}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeContractController::destroyDocument
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
destroyDocument.url = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    contract: args[1],
                    document: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                contract: typeof args.contract === 'object'
                ? args.contract.id
                : args.contract,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroyDocument.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{contract}', parsedArgs.contract.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeContractController::destroyDocument
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
destroyDocument.delete = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDocument.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeContractController::destroyDocument
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
    const destroyDocumentForm = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyDocument.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeContractController::destroyDocument
 * @see app/Http/Controllers/EmployeeContractController.php:227
 * @route '/employees/{employee}/contracts/{contract}/documents/{document}'
 */
        destroyDocumentForm.delete = (args: { employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, contract: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyDocument.form = destroyDocumentForm
const EmployeeContractController = { index, create, store, show, edit, update, destroy, activate, terminate, storeDocument, downloadDocument, destroyDocument }

export default EmployeeContractController