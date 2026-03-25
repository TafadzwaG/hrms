import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/document-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentTypeController::index
 * @see app/Http/Controllers/DocumentTypeController.php:15
 * @route '/document-types'
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
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/document-types/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentTypeController::create
 * @see app/Http/Controllers/DocumentTypeController.php:55
 * @route '/document-types/create'
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
* @see \App\Http\Controllers\DocumentTypeController::store
 * @see app/Http/Controllers/DocumentTypeController.php:62
 * @route '/document-types'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/document-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::store
 * @see app/Http/Controllers/DocumentTypeController.php:62
 * @route '/document-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::store
 * @see app/Http/Controllers/DocumentTypeController.php:62
 * @route '/document-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::store
 * @see app/Http/Controllers/DocumentTypeController.php:62
 * @route '/document-types'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::store
 * @see app/Http/Controllers/DocumentTypeController.php:62
 * @route '/document-types'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
export const show = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/document-types/{document_type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
show.url = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document_type: args.document_type,
                }

    return show.definition.url
            .replace('{document_type}', parsedArgs.document_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
show.get = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
show.head = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
    const showForm = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
        showForm.get = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentTypeController::show
 * @see app/Http/Controllers/DocumentTypeController.php:73
 * @route '/document-types/{document_type}'
 */
        showForm.head = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
export const edit = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/document-types/{document_type}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
edit.url = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document_type: args.document_type,
                }

    return edit.definition.url
            .replace('{document_type}', parsedArgs.document_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
edit.get = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
edit.head = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
    const editForm = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
        editForm.get = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentTypeController::edit
 * @see app/Http/Controllers/DocumentTypeController.php:83
 * @route '/document-types/{document_type}/edit'
 */
        editForm.head = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
export const update = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/document-types/{document_type}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
update.url = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document_type: args.document_type,
                }

    return update.definition.url
            .replace('{document_type}', parsedArgs.document_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
update.put = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
update.patch = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
    const updateForm = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
        updateForm.put = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\DocumentTypeController::update
 * @see app/Http/Controllers/DocumentTypeController.php:94
 * @route '/document-types/{document_type}'
 */
        updateForm.patch = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DocumentTypeController::destroy
 * @see app/Http/Controllers/DocumentTypeController.php:105
 * @route '/document-types/{document_type}'
 */
export const destroy = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/document-types/{document_type}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DocumentTypeController::destroy
 * @see app/Http/Controllers/DocumentTypeController.php:105
 * @route '/document-types/{document_type}'
 */
destroy.url = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document_type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document_type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document_type: args.document_type,
                }

    return destroy.definition.url
            .replace('{document_type}', parsedArgs.document_type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentTypeController::destroy
 * @see app/Http/Controllers/DocumentTypeController.php:105
 * @route '/document-types/{document_type}'
 */
destroy.delete = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DocumentTypeController::destroy
 * @see app/Http/Controllers/DocumentTypeController.php:105
 * @route '/document-types/{document_type}'
 */
    const destroyForm = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DocumentTypeController::destroy
 * @see app/Http/Controllers/DocumentTypeController.php:105
 * @route '/document-types/{document_type}'
 */
        destroyForm.delete = (args: { document_type: string | number } | [document_type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const DocumentTypeController = { index, create, store, show, edit, update, destroy }

export default DocumentTypeController