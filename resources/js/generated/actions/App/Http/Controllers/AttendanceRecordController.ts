import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/attendance-records',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceRecordController::index
 * @see app/Http/Controllers/AttendanceRecordController.php:25
 * @route '/attendance-records'
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
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/attendance-records/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceRecordController::create
 * @see app/Http/Controllers/AttendanceRecordController.php:101
 * @route '/attendance-records/create'
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
* @see \App\Http\Controllers\AttendanceRecordController::store
 * @see app/Http/Controllers/AttendanceRecordController.php:109
 * @route '/attendance-records'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/attendance-records',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::store
 * @see app/Http/Controllers/AttendanceRecordController.php:109
 * @route '/attendance-records'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::store
 * @see app/Http/Controllers/AttendanceRecordController.php:109
 * @route '/attendance-records'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::store
 * @see app/Http/Controllers/AttendanceRecordController.php:109
 * @route '/attendance-records'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::store
 * @see app/Http/Controllers/AttendanceRecordController.php:109
 * @route '/attendance-records'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
export const show = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/attendance-records/{attendance_record}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
show.url = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance_record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance_record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance_record: args.attendance_record,
                }

    return show.definition.url
            .replace('{attendance_record}', parsedArgs.attendance_record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
show.get = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
show.head = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
    const showForm = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
        showForm.get = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceRecordController::show
 * @see app/Http/Controllers/AttendanceRecordController.php:121
 * @route '/attendance-records/{attendance_record}'
 */
        showForm.head = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
export const edit = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/attendance-records/{attendance_record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
edit.url = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance_record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance_record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance_record: args.attendance_record,
                }

    return edit.definition.url
            .replace('{attendance_record}', parsedArgs.attendance_record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
edit.get = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
edit.head = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
    const editForm = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
        editForm.get = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AttendanceRecordController::edit
 * @see app/Http/Controllers/AttendanceRecordController.php:136
 * @route '/attendance-records/{attendance_record}/edit'
 */
        editForm.head = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
export const update = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/attendance-records/{attendance_record}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
update.url = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance_record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance_record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance_record: args.attendance_record,
                }

    return update.definition.url
            .replace('{attendance_record}', parsedArgs.attendance_record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
update.put = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
update.patch = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
    const updateForm = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
        updateForm.put = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\AttendanceRecordController::update
 * @see app/Http/Controllers/AttendanceRecordController.php:151
 * @route '/attendance-records/{attendance_record}'
 */
        updateForm.patch = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\AttendanceRecordController::destroy
 * @see app/Http/Controllers/AttendanceRecordController.php:167
 * @route '/attendance-records/{attendance_record}'
 */
export const destroy = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/attendance-records/{attendance_record}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\AttendanceRecordController::destroy
 * @see app/Http/Controllers/AttendanceRecordController.php:167
 * @route '/attendance-records/{attendance_record}'
 */
destroy.url = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { attendance_record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    attendance_record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        attendance_record: args.attendance_record,
                }

    return destroy.definition.url
            .replace('{attendance_record}', parsedArgs.attendance_record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AttendanceRecordController::destroy
 * @see app/Http/Controllers/AttendanceRecordController.php:167
 * @route '/attendance-records/{attendance_record}'
 */
destroy.delete = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\AttendanceRecordController::destroy
 * @see app/Http/Controllers/AttendanceRecordController.php:167
 * @route '/attendance-records/{attendance_record}'
 */
    const destroyForm = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AttendanceRecordController::destroy
 * @see app/Http/Controllers/AttendanceRecordController.php:167
 * @route '/attendance-records/{attendance_record}'
 */
        destroyForm.delete = (args: { attendance_record: string | number } | [attendance_record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AttendanceRecordController = { index, create, store, show, edit, update, destroy }

export default AttendanceRecordController