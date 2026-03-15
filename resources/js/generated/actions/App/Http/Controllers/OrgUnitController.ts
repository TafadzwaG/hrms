import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upload.url(options),
    method: 'get',
})

upload.definition = {
    methods: ["get","head"],
    url: '/org-units/upload',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
upload.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upload.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
upload.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: upload.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: upload.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
        uploadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upload.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::upload
 * @see app/Http/Controllers/OrgUnitController.php:202
 * @route '/org-units/upload'
 */
        uploadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upload.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/org-units/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::downloadTemplate
 * @see app/Http/Controllers/OrgUnitController.php:209
 * @route '/org-units/template'
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
* @see \App\Http\Controllers\OrgUnitController::importMethod
 * @see app/Http/Controllers/OrgUnitController.php:241
 * @route '/org-units/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/org-units/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrgUnitController::importMethod
 * @see app/Http/Controllers/OrgUnitController.php:241
 * @route '/org-units/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::importMethod
 * @see app/Http/Controllers/OrgUnitController.php:241
 * @route '/org-units/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::importMethod
 * @see app/Http/Controllers/OrgUnitController.php:241
 * @route '/org-units/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::importMethod
 * @see app/Http/Controllers/OrgUnitController.php:241
 * @route '/org-units/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/org-units',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::index
 * @see app/Http/Controllers/OrgUnitController.php:15
 * @route '/org-units'
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
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/org-units/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::create
 * @see app/Http/Controllers/OrgUnitController.php:67
 * @route '/org-units/create'
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
* @see \App\Http\Controllers\OrgUnitController::store
 * @see app/Http/Controllers/OrgUnitController.php:81
 * @route '/org-units'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/org-units',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrgUnitController::store
 * @see app/Http/Controllers/OrgUnitController.php:81
 * @route '/org-units'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::store
 * @see app/Http/Controllers/OrgUnitController.php:81
 * @route '/org-units'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::store
 * @see app/Http/Controllers/OrgUnitController.php:81
 * @route '/org-units'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::store
 * @see app/Http/Controllers/OrgUnitController.php:81
 * @route '/org-units'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
export const show = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/org-units/{org_unit}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
show.url = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { org_unit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    org_unit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        org_unit: args.org_unit,
                }

    return show.definition.url
            .replace('{org_unit}', parsedArgs.org_unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
show.get = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
show.head = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
    const showForm = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
        showForm.get = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::show
 * @see app/Http/Controllers/OrgUnitController.php:97
 * @route '/org-units/{org_unit}'
 */
        showForm.head = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
export const edit = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/org-units/{org_unit}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
edit.url = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { org_unit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    org_unit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        org_unit: args.org_unit,
                }

    return edit.definition.url
            .replace('{org_unit}', parsedArgs.org_unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
edit.get = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
edit.head = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
    const editForm = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
        editForm.get = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::edit
 * @see app/Http/Controllers/OrgUnitController.php:142
 * @route '/org-units/{org_unit}/edit'
 */
        editForm.head = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
export const update = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/org-units/{org_unit}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
update.url = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { org_unit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    org_unit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        org_unit: args.org_unit,
                }

    return update.definition.url
            .replace('{org_unit}', parsedArgs.org_unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
update.put = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
update.patch = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
    const updateForm = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
        updateForm.put = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\OrgUnitController::update
 * @see app/Http/Controllers/OrgUnitController.php:167
 * @route '/org-units/{org_unit}'
 */
        updateForm.patch = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\OrgUnitController::destroy
 * @see app/Http/Controllers/OrgUnitController.php:182
 * @route '/org-units/{org_unit}'
 */
export const destroy = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/org-units/{org_unit}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrgUnitController::destroy
 * @see app/Http/Controllers/OrgUnitController.php:182
 * @route '/org-units/{org_unit}'
 */
destroy.url = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { org_unit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    org_unit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        org_unit: args.org_unit,
                }

    return destroy.definition.url
            .replace('{org_unit}', parsedArgs.org_unit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrgUnitController::destroy
 * @see app/Http/Controllers/OrgUnitController.php:182
 * @route '/org-units/{org_unit}'
 */
destroy.delete = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrgUnitController::destroy
 * @see app/Http/Controllers/OrgUnitController.php:182
 * @route '/org-units/{org_unit}'
 */
    const destroyForm = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrgUnitController::destroy
 * @see app/Http/Controllers/OrgUnitController.php:182
 * @route '/org-units/{org_unit}'
 */
        destroyForm.delete = (args: { org_unit: string | number } | [org_unit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const OrgUnitController = { upload, downloadTemplate, importMethod, index, create, store, show, edit, update, destroy, import: importMethod }

export default OrgUnitController