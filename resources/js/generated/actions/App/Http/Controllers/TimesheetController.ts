import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:391
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
 * @see app/Http/Controllers/TimesheetController.php:391
 * @route '/timesheets/bulk-upload'
 */
bulkUpload.url = (options?: RouteQueryOptions) => {
    return bulkUpload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:391
 * @route '/timesheets/bulk-upload'
 */
bulkUpload.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkUpload.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:391
 * @route '/timesheets/bulk-upload'
 */
bulkUpload.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkUpload.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:391
 * @route '/timesheets/bulk-upload'
 */
    const bulkUploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bulkUpload.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:391
 * @route '/timesheets/bulk-upload'
 */
        bulkUploadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bulkUpload.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::bulkUpload
 * @see app/Http/Controllers/TimesheetController.php:391
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
* @see \App\Http\Controllers\TimesheetController::previewBulk
 * @see app/Http/Controllers/TimesheetController.php:400
 * @route '/timesheets/bulk-upload/preview'
 */
export const previewBulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: previewBulk.url(options),
    method: 'post',
})

previewBulk.definition = {
    methods: ["post"],
    url: '/timesheets/bulk-upload/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::previewBulk
 * @see app/Http/Controllers/TimesheetController.php:400
 * @route '/timesheets/bulk-upload/preview'
 */
previewBulk.url = (options?: RouteQueryOptions) => {
    return previewBulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::previewBulk
 * @see app/Http/Controllers/TimesheetController.php:400
 * @route '/timesheets/bulk-upload/preview'
 */
previewBulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: previewBulk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::previewBulk
 * @see app/Http/Controllers/TimesheetController.php:400
 * @route '/timesheets/bulk-upload/preview'
 */
    const previewBulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: previewBulk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::previewBulk
 * @see app/Http/Controllers/TimesheetController.php:400
 * @route '/timesheets/bulk-upload/preview'
 */
        previewBulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: previewBulk.url(options),
            method: 'post',
        })
    
    previewBulk.form = previewBulkForm
/**
* @see \App\Http\Controllers\TimesheetController::processBulk
 * @see app/Http/Controllers/TimesheetController.php:415
 * @route '/timesheets/bulk-upload/process'
 */
export const processBulk = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processBulk.url(options),
    method: 'post',
})

processBulk.definition = {
    methods: ["post"],
    url: '/timesheets/bulk-upload/process',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TimesheetController::processBulk
 * @see app/Http/Controllers/TimesheetController.php:415
 * @route '/timesheets/bulk-upload/process'
 */
processBulk.url = (options?: RouteQueryOptions) => {
    return processBulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::processBulk
 * @see app/Http/Controllers/TimesheetController.php:415
 * @route '/timesheets/bulk-upload/process'
 */
processBulk.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processBulk.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::processBulk
 * @see app/Http/Controllers/TimesheetController.php:415
 * @route '/timesheets/bulk-upload/process'
 */
    const processBulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: processBulk.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::processBulk
 * @see app/Http/Controllers/TimesheetController.php:415
 * @route '/timesheets/bulk-upload/process'
 */
        processBulkForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: processBulk.url(options),
            method: 'post',
        })
    
    processBulk.form = processBulkForm
/**
* @see \App\Http\Controllers\TimesheetController::discardBulk
 * @see app/Http/Controllers/TimesheetController.php:473
 * @route '/timesheets/bulk-upload/discard'
 */
export const discardBulk = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: discardBulk.url(options),
    method: 'delete',
})

discardBulk.definition = {
    methods: ["delete"],
    url: '/timesheets/bulk-upload/discard',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TimesheetController::discardBulk
 * @see app/Http/Controllers/TimesheetController.php:473
 * @route '/timesheets/bulk-upload/discard'
 */
discardBulk.url = (options?: RouteQueryOptions) => {
    return discardBulk.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::discardBulk
 * @see app/Http/Controllers/TimesheetController.php:473
 * @route '/timesheets/bulk-upload/discard'
 */
discardBulk.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: discardBulk.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TimesheetController::discardBulk
 * @see app/Http/Controllers/TimesheetController.php:473
 * @route '/timesheets/bulk-upload/discard'
 */
    const discardBulkForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: discardBulk.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::discardBulk
 * @see app/Http/Controllers/TimesheetController.php:473
 * @route '/timesheets/bulk-upload/discard'
 */
        discardBulkForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: discardBulk.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    discardBulk.form = discardBulkForm
/**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
export const downloadBulkTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBulkTemplate.url(options),
    method: 'get',
})

downloadBulkTemplate.definition = {
    methods: ["get","head"],
    url: '/timesheets/bulk-upload/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
downloadBulkTemplate.url = (options?: RouteQueryOptions) => {
    return downloadBulkTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
downloadBulkTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadBulkTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
downloadBulkTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadBulkTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
    const downloadBulkTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadBulkTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
        downloadBulkTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadBulkTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::downloadBulkTemplate
 * @see app/Http/Controllers/TimesheetController.php:482
 * @route '/timesheets/bulk-upload/template'
 */
        downloadBulkTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadBulkTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadBulkTemplate.form = downloadBulkTemplateForm
/**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:158
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
 * @see app/Http/Controllers/TimesheetController.php:158
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
 * @see app/Http/Controllers/TimesheetController.php:158
 * @route '/timesheets/{timesheet}/approve'
 */
approve.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:158
 * @route '/timesheets/{timesheet}/approve'
 */
    const approveForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: approve.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::approve
 * @see app/Http/Controllers/TimesheetController.php:158
 * @route '/timesheets/{timesheet}/approve'
 */
        approveForm.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: approve.url(args, options),
            method: 'post',
        })
    
    approve.form = approveForm
/**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:190
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
 * @see app/Http/Controllers/TimesheetController.php:190
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
 * @see app/Http/Controllers/TimesheetController.php:190
 * @route '/timesheets/{timesheet}/reject'
 */
reject.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:190
 * @route '/timesheets/{timesheet}/reject'
 */
    const rejectForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::reject
 * @see app/Http/Controllers/TimesheetController.php:190
 * @route '/timesheets/{timesheet}/reject'
 */
        rejectForm.post = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:26
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
 * @see app/Http/Controllers/TimesheetController.php:26
 * @route '/timesheets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:26
 * @route '/timesheets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:26
 * @route '/timesheets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:26
 * @route '/timesheets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:26
 * @route '/timesheets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::index
 * @see app/Http/Controllers/TimesheetController.php:26
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
 * @see app/Http/Controllers/TimesheetController.php:76
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
 * @see app/Http/Controllers/TimesheetController.php:76
 * @route '/timesheets/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:76
 * @route '/timesheets/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:76
 * @route '/timesheets/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:76
 * @route '/timesheets/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:76
 * @route '/timesheets/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::create
 * @see app/Http/Controllers/TimesheetController.php:76
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
 * @see app/Http/Controllers/TimesheetController.php:93
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
 * @see app/Http/Controllers/TimesheetController.php:93
 * @route '/timesheets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:93
 * @route '/timesheets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:93
 * @route '/timesheets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::store
 * @see app/Http/Controllers/TimesheetController.php:93
 * @route '/timesheets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:105
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
 * @see app/Http/Controllers/TimesheetController.php:105
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
 * @see app/Http/Controllers/TimesheetController.php:105
 * @route '/timesheets/{timesheet}'
 */
show.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:105
 * @route '/timesheets/{timesheet}'
 */
show.head = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:105
 * @route '/timesheets/{timesheet}'
 */
    const showForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:105
 * @route '/timesheets/{timesheet}'
 */
        showForm.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::show
 * @see app/Http/Controllers/TimesheetController.php:105
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
 * @see app/Http/Controllers/TimesheetController.php:119
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
 * @see app/Http/Controllers/TimesheetController.php:119
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
 * @see app/Http/Controllers/TimesheetController.php:119
 * @route '/timesheets/{timesheet}/edit'
 */
edit.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:119
 * @route '/timesheets/{timesheet}/edit'
 */
edit.head = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:119
 * @route '/timesheets/{timesheet}/edit'
 */
    const editForm = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:119
 * @route '/timesheets/{timesheet}/edit'
 */
        editForm.get = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TimesheetController::edit
 * @see app/Http/Controllers/TimesheetController.php:119
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
 * @see app/Http/Controllers/TimesheetController.php:133
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
 * @see app/Http/Controllers/TimesheetController.php:133
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
 * @see app/Http/Controllers/TimesheetController.php:133
 * @route '/timesheets/{timesheet}'
 */
update.put = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:133
 * @route '/timesheets/{timesheet}'
 */
update.patch = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TimesheetController::update
 * @see app/Http/Controllers/TimesheetController.php:133
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
 * @see app/Http/Controllers/TimesheetController.php:133
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
 * @see app/Http/Controllers/TimesheetController.php:133
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
 * @see app/Http/Controllers/TimesheetController.php:147
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
 * @see app/Http/Controllers/TimesheetController.php:147
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
 * @see app/Http/Controllers/TimesheetController.php:147
 * @route '/timesheets/{timesheet}'
 */
destroy.delete = (args: { timesheet: string | number } | [timesheet: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TimesheetController::destroy
 * @see app/Http/Controllers/TimesheetController.php:147
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
 * @see app/Http/Controllers/TimesheetController.php:147
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
const TimesheetController = { bulkUpload, previewBulk, processBulk, discardBulk, downloadBulkTemplate, approve, reject, index, create, store, show, edit, update, destroy }

export default TimesheetController