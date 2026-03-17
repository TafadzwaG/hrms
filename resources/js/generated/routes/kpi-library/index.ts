import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/kpi-library',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiLibraryController::index
 * @see app/Http/Controllers/KpiLibraryController.php:14
 * @route '/kpi-library'
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
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/kpi-library/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiLibraryController::create
 * @see app/Http/Controllers/KpiLibraryController.php:47
 * @route '/kpi-library/create'
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
* @see \App\Http\Controllers\KpiLibraryController::store
 * @see app/Http/Controllers/KpiLibraryController.php:55
 * @route '/kpi-library'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/kpi-library',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::store
 * @see app/Http/Controllers/KpiLibraryController.php:55
 * @route '/kpi-library'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::store
 * @see app/Http/Controllers/KpiLibraryController.php:55
 * @route '/kpi-library'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::store
 * @see app/Http/Controllers/KpiLibraryController.php:55
 * @route '/kpi-library'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::store
 * @see app/Http/Controllers/KpiLibraryController.php:55
 * @route '/kpi-library'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
export const show = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/kpi-library/{kpi_library}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
show.url = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_library: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_library: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_library: args.kpi_library,
                }

    return show.definition.url
            .replace('{kpi_library}', parsedArgs.kpi_library.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
show.get = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
show.head = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
    const showForm = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
        showForm.get = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiLibraryController::show
 * @see app/Http/Controllers/KpiLibraryController.php:66
 * @route '/kpi-library/{kpi_library}'
 */
        showForm.head = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
export const edit = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/kpi-library/{kpi_library}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
edit.url = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_library: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_library: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_library: args.kpi_library,
                }

    return edit.definition.url
            .replace('{kpi_library}', parsedArgs.kpi_library.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
edit.get = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
edit.head = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
    const editForm = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
        editForm.get = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\KpiLibraryController::edit
 * @see app/Http/Controllers/KpiLibraryController.php:75
 * @route '/kpi-library/{kpi_library}/edit'
 */
        editForm.head = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
export const update = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/kpi-library/{kpi_library}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
update.url = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_library: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_library: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_library: args.kpi_library,
                }

    return update.definition.url
            .replace('{kpi_library}', parsedArgs.kpi_library.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
update.put = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
update.patch = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
    const updateForm = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
        updateForm.put = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\KpiLibraryController::update
 * @see app/Http/Controllers/KpiLibraryController.php:84
 * @route '/kpi-library/{kpi_library}'
 */
        updateForm.patch = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\KpiLibraryController::destroy
 * @see app/Http/Controllers/KpiLibraryController.php:95
 * @route '/kpi-library/{kpi_library}'
 */
export const destroy = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/kpi-library/{kpi_library}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\KpiLibraryController::destroy
 * @see app/Http/Controllers/KpiLibraryController.php:95
 * @route '/kpi-library/{kpi_library}'
 */
destroy.url = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { kpi_library: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    kpi_library: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        kpi_library: args.kpi_library,
                }

    return destroy.definition.url
            .replace('{kpi_library}', parsedArgs.kpi_library.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\KpiLibraryController::destroy
 * @see app/Http/Controllers/KpiLibraryController.php:95
 * @route '/kpi-library/{kpi_library}'
 */
destroy.delete = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\KpiLibraryController::destroy
 * @see app/Http/Controllers/KpiLibraryController.php:95
 * @route '/kpi-library/{kpi_library}'
 */
    const destroyForm = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\KpiLibraryController::destroy
 * @see app/Http/Controllers/KpiLibraryController.php:95
 * @route '/kpi-library/{kpi_library}'
 */
        destroyForm.delete = (args: { kpi_library: string | number } | [kpi_library: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const kpiLibrary = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default kpiLibrary