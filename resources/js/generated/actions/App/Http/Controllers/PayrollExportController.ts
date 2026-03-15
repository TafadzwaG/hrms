import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/payroll-exports/template/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::downloadTemplate
 * @see app/Http/Controllers/PayrollExportController.php:139
 * @route '/payroll-exports/template/download'
 */
        downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadTemplate.form = downloadTemplateForm
/**
* @see \App\Http\Controllers\PayrollExportController::runAutomation
 * @see app/Http/Controllers/PayrollExportController.php:158
 * @route '/payroll-exports/automation/run'
 */
export const runAutomation = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runAutomation.url(options),
    method: 'post',
})

runAutomation.definition = {
    methods: ["post"],
    url: '/payroll-exports/automation/run',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollExportController::runAutomation
 * @see app/Http/Controllers/PayrollExportController.php:158
 * @route '/payroll-exports/automation/run'
 */
runAutomation.url = (options?: RouteQueryOptions) => {
    return runAutomation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::runAutomation
 * @see app/Http/Controllers/PayrollExportController.php:158
 * @route '/payroll-exports/automation/run'
 */
runAutomation.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: runAutomation.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::runAutomation
 * @see app/Http/Controllers/PayrollExportController.php:158
 * @route '/payroll-exports/automation/run'
 */
    const runAutomationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: runAutomation.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::runAutomation
 * @see app/Http/Controllers/PayrollExportController.php:158
 * @route '/payroll-exports/automation/run'
 */
        runAutomationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: runAutomation.url(options),
            method: 'post',
        })
    
    runAutomation.form = runAutomationForm
/**
* @see \App\Http\Controllers\PayrollExportController::retryFailed
 * @see app/Http/Controllers/PayrollExportController.php:188
 * @route '/payroll-exports/retry-failed'
 */
export const retryFailed = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryFailed.url(options),
    method: 'post',
})

retryFailed.definition = {
    methods: ["post"],
    url: '/payroll-exports/retry-failed',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollExportController::retryFailed
 * @see app/Http/Controllers/PayrollExportController.php:188
 * @route '/payroll-exports/retry-failed'
 */
retryFailed.url = (options?: RouteQueryOptions) => {
    return retryFailed.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::retryFailed
 * @see app/Http/Controllers/PayrollExportController.php:188
 * @route '/payroll-exports/retry-failed'
 */
retryFailed.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryFailed.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::retryFailed
 * @see app/Http/Controllers/PayrollExportController.php:188
 * @route '/payroll-exports/retry-failed'
 */
    const retryFailedForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryFailed.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::retryFailed
 * @see app/Http/Controllers/PayrollExportController.php:188
 * @route '/payroll-exports/retry-failed'
 */
        retryFailedForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryFailed.url(options),
            method: 'post',
        })
    
    retryFailed.form = retryFailedForm
/**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll-exports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::index
 * @see app/Http/Controllers/PayrollExportController.php:22
 * @route '/payroll-exports'
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
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/payroll-exports/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::create
 * @see app/Http/Controllers/PayrollExportController.php:69
 * @route '/payroll-exports/create'
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
* @see \App\Http\Controllers\PayrollExportController::store
 * @see app/Http/Controllers/PayrollExportController.php:77
 * @route '/payroll-exports'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll-exports',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayrollExportController::store
 * @see app/Http/Controllers/PayrollExportController.php:77
 * @route '/payroll-exports'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::store
 * @see app/Http/Controllers/PayrollExportController.php:77
 * @route '/payroll-exports'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::store
 * @see app/Http/Controllers/PayrollExportController.php:77
 * @route '/payroll-exports'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::store
 * @see app/Http/Controllers/PayrollExportController.php:77
 * @route '/payroll-exports'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
export const show = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payroll-exports/{payroll_export}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
show.url = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_export: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_export: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_export: args.payroll_export,
                }

    return show.definition.url
            .replace('{payroll_export}', parsedArgs.payroll_export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
show.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
show.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
    const showForm = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
        showForm.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::show
 * @see app/Http/Controllers/PayrollExportController.php:88
 * @route '/payroll-exports/{payroll_export}'
 */
        showForm.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
export const edit = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/payroll-exports/{payroll_export}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
edit.url = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_export: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_export: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_export: args.payroll_export,
                }

    return edit.definition.url
            .replace('{payroll_export}', parsedArgs.payroll_export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
edit.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
edit.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
    const editForm = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
        editForm.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::edit
 * @see app/Http/Controllers/PayrollExportController.php:98
 * @route '/payroll-exports/{payroll_export}/edit'
 */
        editForm.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PayrollExportController::update
 * @see app/Http/Controllers/PayrollExportController.php:108
 * @route '/payroll-exports/{payroll_export}'
 */
export const update = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll-exports/{payroll_export}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PayrollExportController::update
 * @see app/Http/Controllers/PayrollExportController.php:108
 * @route '/payroll-exports/{payroll_export}'
 */
update.url = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_export: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_export: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_export: args.payroll_export,
                }

    return update.definition.url
            .replace('{payroll_export}', parsedArgs.payroll_export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::update
 * @see app/Http/Controllers/PayrollExportController.php:108
 * @route '/payroll-exports/{payroll_export}'
 */
update.put = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::update
 * @see app/Http/Controllers/PayrollExportController.php:108
 * @route '/payroll-exports/{payroll_export}'
 */
    const updateForm = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::update
 * @see app/Http/Controllers/PayrollExportController.php:108
 * @route '/payroll-exports/{payroll_export}'
 */
        updateForm.put = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollExportController::destroy
 * @see app/Http/Controllers/PayrollExportController.php:122
 * @route '/payroll-exports/{payroll_export}'
 */
export const destroy = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll-exports/{payroll_export}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PayrollExportController::destroy
 * @see app/Http/Controllers/PayrollExportController.php:122
 * @route '/payroll-exports/{payroll_export}'
 */
destroy.url = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_export: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_export: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_export: args.payroll_export,
                }

    return destroy.definition.url
            .replace('{payroll_export}', parsedArgs.payroll_export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::destroy
 * @see app/Http/Controllers/PayrollExportController.php:122
 * @route '/payroll-exports/{payroll_export}'
 */
destroy.delete = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::destroy
 * @see app/Http/Controllers/PayrollExportController.php:122
 * @route '/payroll-exports/{payroll_export}'
 */
    const destroyForm = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::destroy
 * @see app/Http/Controllers/PayrollExportController.php:122
 * @route '/payroll-exports/{payroll_export}'
 */
        destroyForm.delete = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
export const downloadExport = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadExport.url(args, options),
    method: 'get',
})

downloadExport.definition = {
    methods: ["get","head"],
    url: '/payroll-exports/{payroll_export}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
downloadExport.url = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_export: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_export: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_export: args.payroll_export,
                }

    return downloadExport.definition.url
            .replace('{payroll_export}', parsedArgs.payroll_export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
downloadExport.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadExport.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
downloadExport.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadExport.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
    const downloadExportForm = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadExport.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
        downloadExportForm.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadExport.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::downloadExport
 * @see app/Http/Controllers/PayrollExportController.php:210
 * @route '/payroll-exports/{payroll_export}/download'
 */
        downloadExportForm.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadExport.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadExport.form = downloadExportForm
/**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
export const downloadPdfSummary = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdfSummary.url(args, options),
    method: 'get',
})

downloadPdfSummary.definition = {
    methods: ["get","head"],
    url: '/payroll-exports/{payroll_export}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
downloadPdfSummary.url = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payroll_export: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    payroll_export: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        payroll_export: args.payroll_export,
                }

    return downloadPdfSummary.definition.url
            .replace('{payroll_export}', parsedArgs.payroll_export.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
downloadPdfSummary.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadPdfSummary.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
downloadPdfSummary.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadPdfSummary.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
    const downloadPdfSummaryForm = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadPdfSummary.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
        downloadPdfSummaryForm.get = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdfSummary.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollExportController::downloadPdfSummary
 * @see app/Http/Controllers/PayrollExportController.php:255
 * @route '/payroll-exports/{payroll_export}/pdf'
 */
        downloadPdfSummaryForm.head = (args: { payroll_export: string | number } | [payroll_export: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadPdfSummary.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadPdfSummary.form = downloadPdfSummaryForm
const PayrollExportController = { downloadTemplate, runAutomation, retryFailed, index, create, store, show, edit, update, destroy, downloadExport, downloadPdfSummary }

export default PayrollExportController