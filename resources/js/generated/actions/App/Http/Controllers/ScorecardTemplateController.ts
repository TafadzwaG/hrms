import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/scorecard-templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScorecardTemplateController::index
 * @see app/Http/Controllers/ScorecardTemplateController.php:16
 * @route '/scorecard-templates'
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
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/scorecard-templates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScorecardTemplateController::create
 * @see app/Http/Controllers/ScorecardTemplateController.php:38
 * @route '/scorecard-templates/create'
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
* @see \App\Http\Controllers\ScorecardTemplateController::store
 * @see app/Http/Controllers/ScorecardTemplateController.php:49
 * @route '/scorecard-templates'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/scorecard-templates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::store
 * @see app/Http/Controllers/ScorecardTemplateController.php:49
 * @route '/scorecard-templates'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::store
 * @see app/Http/Controllers/ScorecardTemplateController.php:49
 * @route '/scorecard-templates'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::store
 * @see app/Http/Controllers/ScorecardTemplateController.php:49
 * @route '/scorecard-templates'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::store
 * @see app/Http/Controllers/ScorecardTemplateController.php:49
 * @route '/scorecard-templates'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
export const show = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/scorecard-templates/{scorecard_template}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
show.url = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scorecard_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    scorecard_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scorecard_template: args.scorecard_template,
                }

    return show.definition.url
            .replace('{scorecard_template}', parsedArgs.scorecard_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
show.get = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
show.head = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
    const showForm = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
        showForm.get = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScorecardTemplateController::show
 * @see app/Http/Controllers/ScorecardTemplateController.php:71
 * @route '/scorecard-templates/{scorecard_template}'
 */
        showForm.head = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
export const edit = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/scorecard-templates/{scorecard_template}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
edit.url = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scorecard_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    scorecard_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scorecard_template: args.scorecard_template,
                }

    return edit.definition.url
            .replace('{scorecard_template}', parsedArgs.scorecard_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
edit.get = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
edit.head = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
    const editForm = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
        editForm.get = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ScorecardTemplateController::edit
 * @see app/Http/Controllers/ScorecardTemplateController.php:86
 * @route '/scorecard-templates/{scorecard_template}/edit'
 */
        editForm.head = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
export const update = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/scorecard-templates/{scorecard_template}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
update.url = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scorecard_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    scorecard_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scorecard_template: args.scorecard_template,
                }

    return update.definition.url
            .replace('{scorecard_template}', parsedArgs.scorecard_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
update.put = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
update.patch = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
    const updateForm = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
        updateForm.put = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ScorecardTemplateController::update
 * @see app/Http/Controllers/ScorecardTemplateController.php:106
 * @route '/scorecard-templates/{scorecard_template}'
 */
        updateForm.patch = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ScorecardTemplateController::destroy
 * @see app/Http/Controllers/ScorecardTemplateController.php:128
 * @route '/scorecard-templates/{scorecard_template}'
 */
export const destroy = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/scorecard-templates/{scorecard_template}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ScorecardTemplateController::destroy
 * @see app/Http/Controllers/ScorecardTemplateController.php:128
 * @route '/scorecard-templates/{scorecard_template}'
 */
destroy.url = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { scorecard_template: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    scorecard_template: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        scorecard_template: args.scorecard_template,
                }

    return destroy.definition.url
            .replace('{scorecard_template}', parsedArgs.scorecard_template.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ScorecardTemplateController::destroy
 * @see app/Http/Controllers/ScorecardTemplateController.php:128
 * @route '/scorecard-templates/{scorecard_template}'
 */
destroy.delete = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ScorecardTemplateController::destroy
 * @see app/Http/Controllers/ScorecardTemplateController.php:128
 * @route '/scorecard-templates/{scorecard_template}'
 */
    const destroyForm = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ScorecardTemplateController::destroy
 * @see app/Http/Controllers/ScorecardTemplateController.php:128
 * @route '/scorecard-templates/{scorecard_template}'
 */
        destroyForm.delete = (args: { scorecard_template: string | number } | [scorecard_template: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ScorecardTemplateController = { index, create, store, show, edit, update, destroy }

export default ScorecardTemplateController