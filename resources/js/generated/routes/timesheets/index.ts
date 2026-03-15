import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
export const bulkUpload = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkUpload.url(options),
    method: 'get',
})

bulkUpload.definition = {
    methods: ["get","head"],
    url: '/timesheets/bulk-upload',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
bulkUpload.url = (options?: RouteQueryOptions) => {
    return bulkUpload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
bulkUpload.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkUpload.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
bulkUpload.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkUpload.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
    const bulkUploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bulkUpload.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
        bulkUploadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkUpload.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:389
 * @route '/timesheets/bulk-upload'
 */
        bulkUploadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkUpload.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bulkUpload.form = bulkUploadForm
/**
* @see \App\Http\Controllers\TimesheetController::bulkPreview
 * @see app/Http/Controllers/TimesheetController.php:398
 * @route '/timesheets/bulk-upload/preview'
 */
export const bulkPreview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPreview.url(options),
    method: 'post',
})

bulkPreview.definition = {
    methods: ["post"],
    url: '/timesheets/bulk-upload/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::bulkPreview
 * @see app/Http/Controllers/TimesheetController.php:398
 * @route '/timesheets/bulk-upload/preview'
 */
bulkPreview.url = (options?: RouteQueryOptions) => {
    return bulkPreview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::bulkPreview
 * @see app/Http/Controllers/TimesheetController.php:398
 * @route '/timesheets/bulk-upload/preview'
 */
bulkPreview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkPreview.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::bulkPreview
 * @see app/Http/Controllers/TimesheetController.php:398
 * @route '/timesheets/bulk-upload/preview'
 */
    const bulkPreviewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkPreview.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::bulkPreview
 * @see app/Http/Controllers/TimesheetController.php:398
 * @route '/timesheets/bulk-upload/preview'
 */
        bulkPreviewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkPreview.url(options),
            method: 'post',
        })
    
    bulkPreview.form = bulkPreviewForm
/**
* @see \App\Http\Controllers\TimesheetController::bulkProcess
 * @see app/Http/Controllers/TimesheetController.php:413
 * @route '/timesheets/bulk-upload/process'
 */
export const bulkProcess = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkProcess.url(options),
    method: 'post',
})

bulkProcess.definition = {
    methods: ["post"],
    url: '/timesheets/bulk-upload/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::bulkProcess
 * @see app/Http/Controllers/TimesheetController.php:413
 * @route '/timesheets/bulk-upload/process'
 */
bulkProcess.url = (options?: RouteQueryOptions) => {
    return bulkProcess.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::bulkProcess
 * @see app/Http/Controllers/TimesheetController.php:413
 * @route '/timesheets/bulk-upload/process'
 */
bulkProcess.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkProcess.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::bulkProcess
 * @see app/Http/Controllers/TimesheetController.php:413
 * @route '/timesheets/bulk-upload/process'
 */
    const bulkProcessForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkProcess.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::bulkProcess
 * @see app/Http/Controllers/TimesheetController.php:413
 * @route '/timesheets/bulk-upload/process'
 */
        bulkProcessForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkProcess.url(options),
            method: 'post',
        })
    
    bulkProcess.form = bulkProcessForm
/**
* @see \App\Http\Controllers\TimesheetController::bulkDiscard
 * @see app/Http/Controllers/TimesheetController.php:471
 * @route '/timesheets/bulk-upload/discard'
 */
export const bulkDiscard = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: bulkDiscard.url(options),
    method: 'delete',
})

bulkDiscard.definition = {
    methods: ["delete"],
    url: '/timesheets/bulk-upload/discard',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TimesheetController::bulkDiscard
 * @see app/Http/Controllers/TimesheetController.php:471
 * @route '/timesheets/bulk-upload/discard'
 */
bulkDiscard.url = (options?: RouteQueryOptions) => {
    return bulkDiscard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::bulkDiscard
 * @see app/Http/Controllers/TimesheetController.php:471
 * @route '/timesheets/bulk-upload/discard'
 */
bulkDiscard.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: bulkDiscard.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TimesheetController::bulkDiscard
 * @see app/Http/Controllers/TimesheetController.php:471
 * @route '/timesheets/bulk-upload/discard'
 */
    const bulkDiscardForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkDiscard.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::bulkDiscard
 * @see app/Http/Controllers/TimesheetController.php:471
 * @route '/timesheets/bulk-upload/discard'
 */
        bulkDiscardForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkDiscard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    bulkDiscard.form = bulkDiscardForm
/**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
export const bulkTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkTemplate.url(options),
    method: 'get',
})

bulkTemplate.definition = {
    methods: ["get","head"],
    url: '/timesheets/bulk-upload/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
bulkTemplate.url = (options?: RouteQueryOptions) => {
    return bulkTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
bulkTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
bulkTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
    const bulkTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bulkTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
        bulkTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::bulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:480
 * @route '/timesheets/bulk-upload/template'
 */
        bulkTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bulkTemplate.form = bulkTemplateForm
/**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:146
 * @route '/timesheets/{timesheet}/approve'
 */
export const approve = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/timesheets/{timesheet}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:146
 * @route '/timesheets/{timesheet}/approve'
 */
approve.url = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timesheet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timesheet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timesheet: args.timesheet,
                }

    return approve.definition.url
            .replace('{timesheet}', parsedArgs.timesheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:146
 * @route '/timesheets/{timesheet}/approve'
 */
approve.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:146
 * @route '/timesheets/{timesheet}/approve'
 */
    const approveForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:146
 * @route '/timesheets/{timesheet}/approve'
 */
        approveForm.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:177
 * @route '/timesheets/{timesheet}/reject'
 */
export const reject = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/timesheets/{timesheet}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:177
 * @route '/timesheets/{timesheet}/reject'
 */
reject.url = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timesheet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timesheet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timesheet: args.timesheet,
                }

    return reject.definition.url
            .replace('{timesheet}', parsedArgs.timesheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:177
 * @route '/timesheets/{timesheet}/reject'
 */
reject.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:177
 * @route '/timesheets/{timesheet}/reject'
 */
    const rejectForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:177
 * @route '/timesheets/{timesheet}/reject'
 */
        rejectForm.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/timesheets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:22
 * @route '/timesheets'
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
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/timesheets/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:70
 * @route '/timesheets/create'
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
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:87
 * @route '/timesheets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/timesheets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:87
 * @route '/timesheets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:87
 * @route '/timesheets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:87
 * @route '/timesheets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:87
 * @route '/timesheets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
export const show = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/timesheets/{timesheet}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
show.url = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timesheet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timesheet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timesheet: args.timesheet,
                }

    return show.definition.url
            .replace('{timesheet}', parsedArgs.timesheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
show.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
show.head = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
    const showForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
        showForm.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:98
 * @route '/timesheets/{timesheet}'
 */
        showForm.head = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
export const edit = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/timesheets/{timesheet}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
edit.url = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timesheet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timesheet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timesheet: args.timesheet,
                }

    return edit.definition.url
            .replace('{timesheet}', parsedArgs.timesheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
edit.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
edit.head = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
    const editForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
        editForm.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:111
 * @route '/timesheets/{timesheet}/edit'
 */
        editForm.head = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
export const update = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/timesheets/{timesheet}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
update.url = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timesheet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timesheet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timesheet: args.timesheet,
                }

    return update.definition.url
            .replace('{timesheet}', parsedArgs.timesheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
update.put = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
update.patch = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
    const updateForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
        updateForm.put = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:124
 * @route '/timesheets/{timesheet}'
 */
        updateForm.patch = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\TimesheetController::destroy
 * @see app/Http/Controllers/TimesheetController.php:136
 * @route '/timesheets/{timesheet}'
 */
export const destroy = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/timesheets/{timesheet}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TimesheetController::destroy
 * @see app/Http/Controllers/TimesheetController.php:136
 * @route '/timesheets/{timesheet}'
 */
destroy.url = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { timesheet: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    timesheet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        timesheet: args.timesheet,
                }

    return destroy.definition.url
            .replace('{timesheet}', parsedArgs.timesheet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::destroy
 * @see app/Http/Controllers/TimesheetController.php:136
 * @route '/timesheets/{timesheet}'
 */
destroy.delete = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TimesheetController::destroy
 * @see app/Http/Controllers/TimesheetController.php:136
 * @route '/timesheets/{timesheet}'
 */
    const destroyForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::destroy
 * @see app/Http/Controllers/TimesheetController.php:136
 * @route '/timesheets/{timesheet}'
 */
        destroyForm.delete = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const timesheets = {
    bulkUpload: Object.assign(bulkUpload, bulkUpload),
bulkPreview: Object.assign(bulkPreview, bulkPreview),
bulkProcess: Object.assign(bulkProcess, bulkProcess),
bulkDiscard: Object.assign(bulkDiscard, bulkDiscard),
bulkTemplate: Object.assign(bulkTemplate, bulkTemplate),
approve: Object.assign(approve, approve),
reject: Object.assign(reject, reject),
index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default timesheets