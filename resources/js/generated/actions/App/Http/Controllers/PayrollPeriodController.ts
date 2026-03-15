import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/periods',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollPeriodController::index
 * @see app/Http/Controllers/PayrollPeriodController.php:18
 * @route '/payroll/periods'
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
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:66
 * @route '/payroll/periods'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/periods',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:66
 * @route '/payroll/periods'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:66
 * @route '/payroll/periods'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:66
 * @route '/payroll/periods'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::store
 * @see app/Http/Controllers/PayrollPeriodController.php:66
 * @route '/payroll/periods'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
export const show = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payroll/periods/{period}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
show.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return show.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
show.get = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
show.head = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
    const showForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
        showForm.get = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollPeriodController::show
 * @see app/Http/Controllers/PayrollPeriodController.php:79
 * @route '/payroll/periods/{period}'
 */
        showForm.head = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:244
 * @route '/payroll/periods/{period}'
 */
export const update = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/periods/{period}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:244
 * @route '/payroll/periods/{period}'
 */
update.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return update.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:244
 * @route '/payroll/periods/{period}'
 */
update.put = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:244
 * @route '/payroll/periods/{period}'
 */
    const updateForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::update
 * @see app/Http/Controllers/PayrollPeriodController.php:244
 * @route '/payroll/periods/{period}'
 */
        updateForm.put = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:260
 * @route '/payroll/periods/{period}'
 */
export const destroy = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/periods/{period}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:260
 * @route '/payroll/periods/{period}'
 */
destroy.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return destroy.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:260
 * @route '/payroll/periods/{period}'
 */
destroy.delete = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:260
 * @route '/payroll/periods/{period}'
 */
    const destroyForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::destroy
 * @see app/Http/Controllers/PayrollPeriodController.php:260
 * @route '/payroll/periods/{period}'
 */
        destroyForm.delete = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollPeriodController::process
 * @see app/Http/Controllers/PayrollPeriodController.php:278
 * @route '/payroll/periods/{period}/process'
 */
export const process = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/payroll/periods/{period}/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::process
 * @see app/Http/Controllers/PayrollPeriodController.php:278
 * @route '/payroll/periods/{period}/process'
 */
process.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return process.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::process
 * @see app/Http/Controllers/PayrollPeriodController.php:278
 * @route '/payroll/periods/{period}/process'
 */
process.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::process
 * @see app/Http/Controllers/PayrollPeriodController.php:278
 * @route '/payroll/periods/{period}/process'
 */
    const processForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: process.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::process
 * @see app/Http/Controllers/PayrollPeriodController.php:278
 * @route '/payroll/periods/{period}/process'
 */
        processForm.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: process.url(args, options),
            method: 'post',
        })
    
    process.form = processForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::approve
 * @see app/Http/Controllers/PayrollPeriodController.php:287
 * @route '/payroll/periods/{period}/approve'
 */
export const approve = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/payroll/periods/{period}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::approve
 * @see app/Http/Controllers/PayrollPeriodController.php:287
 * @route '/payroll/periods/{period}/approve'
 */
approve.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return approve.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::approve
 * @see app/Http/Controllers/PayrollPeriodController.php:287
 * @route '/payroll/periods/{period}/approve'
 */
approve.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::approve
 * @see app/Http/Controllers/PayrollPeriodController.php:287
 * @route '/payroll/periods/{period}/approve'
 */
    const approveForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::approve
 * @see app/Http/Controllers/PayrollPeriodController.php:287
 * @route '/payroll/periods/{period}/approve'
 */
        approveForm.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::close
 * @see app/Http/Controllers/PayrollPeriodController.php:296
 * @route '/payroll/periods/{period}/close'
 */
export const close = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

close.definition = {
    methods: ["post"],
    url: '/payroll/periods/{period}/close',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::close
 * @see app/Http/Controllers/PayrollPeriodController.php:296
 * @route '/payroll/periods/{period}/close'
 */
close.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return close.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::close
 * @see app/Http/Controllers/PayrollPeriodController.php:296
 * @route '/payroll/periods/{period}/close'
 */
close.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: close.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::close
 * @see app/Http/Controllers/PayrollPeriodController.php:296
 * @route '/payroll/periods/{period}/close'
 */
    const closeForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: close.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::close
 * @see app/Http/Controllers/PayrollPeriodController.php:296
 * @route '/payroll/periods/{period}/close'
 */
        closeForm.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: close.url(args, options),
            method: 'post',
        })
    
    close.form = closeForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::reopen
 * @see app/Http/Controllers/PayrollPeriodController.php:305
 * @route '/payroll/periods/{period}/reopen'
 */
export const reopen = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reopen.url(args, options),
    method: 'post',
})

reopen.definition = {
    methods: ["post"],
    url: '/payroll/periods/{period}/reopen',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::reopen
 * @see app/Http/Controllers/PayrollPeriodController.php:305
 * @route '/payroll/periods/{period}/reopen'
 */
reopen.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return reopen.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::reopen
 * @see app/Http/Controllers/PayrollPeriodController.php:305
 * @route '/payroll/periods/{period}/reopen'
 */
reopen.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reopen.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::reopen
 * @see app/Http/Controllers/PayrollPeriodController.php:305
 * @route '/payroll/periods/{period}/reopen'
 */
    const reopenForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reopen.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::reopen
 * @see app/Http/Controllers/PayrollPeriodController.php:305
 * @route '/payroll/periods/{period}/reopen'
 */
        reopenForm.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reopen.url(args, options),
            method: 'post',
        })
    
    reopen.form = reopenForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::storeExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
export const storeExchangeRate = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExchangeRate.url(args, options),
    method: 'post',
})

storeExchangeRate.definition = {
    methods: ["post"],
    url: '/payroll/periods/{period}/exchange-rates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::storeExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
storeExchangeRate.url = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { period: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                }

    return storeExchangeRate.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::storeExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
storeExchangeRate.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExchangeRate.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::storeExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
    const storeExchangeRateForm = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeExchangeRate.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::storeExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:314
 * @route '/payroll/periods/{period}/exchange-rates'
 */
        storeExchangeRateForm.post = (args: { period: string | number } | [period: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeExchangeRate.url(args, options),
            method: 'post',
        })
    
    storeExchangeRate.form = storeExchangeRateForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::updateExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
export const updateExchangeRate = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExchangeRate.url(args, options),
    method: 'put',
})

updateExchangeRate.definition = {
    methods: ["put"],
    url: '/payroll/periods/{period}/exchange-rates/{exchangeRate}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::updateExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
updateExchangeRate.url = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                    exchangeRate: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                                exchangeRate: args.exchangeRate,
                }

    return updateExchangeRate.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace('{exchangeRate}', parsedArgs.exchangeRate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::updateExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
updateExchangeRate.put = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExchangeRate.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::updateExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
    const updateExchangeRateForm = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateExchangeRate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::updateExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:327
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
        updateExchangeRateForm.put = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateExchangeRate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateExchangeRate.form = updateExchangeRateForm
/**
* @see \App\Http\Controllers\PayrollPeriodController::destroyExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
export const destroyExchangeRate = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExchangeRate.url(args, options),
    method: 'delete',
})

destroyExchangeRate.definition = {
    methods: ["delete"],
    url: '/payroll/periods/{period}/exchange-rates/{exchangeRate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollPeriodController::destroyExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
destroyExchangeRate.url = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    period: args[0],
                    exchangeRate: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        period: args.period,
                                exchangeRate: args.exchangeRate,
                }

    return destroyExchangeRate.definition.url
            .replace('{period}', parsedArgs.period.toString())
            .replace('{exchangeRate}', parsedArgs.exchangeRate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollPeriodController::destroyExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
destroyExchangeRate.delete = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExchangeRate.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollPeriodController::destroyExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
    const destroyExchangeRateForm = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyExchangeRate.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollPeriodController::destroyExchangeRate
 * @see app/Http/Controllers/PayrollPeriodController.php:343
 * @route '/payroll/periods/{period}/exchange-rates/{exchangeRate}'
 */
        destroyExchangeRateForm.delete = (args: { period: string | number, exchangeRate: string | number } | [period: string | number, exchangeRate: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyExchangeRate.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyExchangeRate.form = destroyExchangeRateForm
const PayrollPeriodController = { index, store, show, update, destroy, process, approve, close, reopen, storeExchangeRate, updateExchangeRate, destroyExchangeRate }

export default PayrollPeriodController