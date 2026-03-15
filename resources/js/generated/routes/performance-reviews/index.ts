import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/performance-reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceReviewController::index
 * @see app/Http/Controllers/PerformanceReviewController.php:15
 * @route '/performance-reviews'
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
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/performance-reviews/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceReviewController::create
 * @see app/Http/Controllers/PerformanceReviewController.php:55
 * @route '/performance-reviews/create'
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
* @see \App\Http\Controllers\PerformanceReviewController::store
 * @see app/Http/Controllers/PerformanceReviewController.php:63
 * @route '/performance-reviews'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/performance-reviews',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::store
 * @see app/Http/Controllers/PerformanceReviewController.php:63
 * @route '/performance-reviews'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::store
 * @see app/Http/Controllers/PerformanceReviewController.php:63
 * @route '/performance-reviews'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::store
 * @see app/Http/Controllers/PerformanceReviewController.php:63
 * @route '/performance-reviews'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::store
 * @see app/Http/Controllers/PerformanceReviewController.php:63
 * @route '/performance-reviews'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
export const show = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/performance-reviews/{performance_review}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
show.url = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_review: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_review: args.performance_review,
                }

    return show.definition.url
            .replace('{performance_review}', parsedArgs.performance_review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
show.get = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
show.head = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
    const showForm = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
        showForm.get = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceReviewController::show
 * @see app/Http/Controllers/PerformanceReviewController.php:74
 * @route '/performance-reviews/{performance_review}'
 */
        showForm.head = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
export const edit = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/performance-reviews/{performance_review}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
edit.url = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_review: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_review: args.performance_review,
                }

    return edit.definition.url
            .replace('{performance_review}', parsedArgs.performance_review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
edit.get = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
edit.head = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
    const editForm = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
        editForm.get = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PerformanceReviewController::edit
 * @see app/Http/Controllers/PerformanceReviewController.php:83
 * @route '/performance-reviews/{performance_review}/edit'
 */
        editForm.head = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
export const update = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/performance-reviews/{performance_review}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
update.url = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_review: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_review: args.performance_review,
                }

    return update.definition.url
            .replace('{performance_review}', parsedArgs.performance_review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
update.put = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
update.patch = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
    const updateForm = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
        updateForm.put = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\PerformanceReviewController::update
 * @see app/Http/Controllers/PerformanceReviewController.php:94
 * @route '/performance-reviews/{performance_review}'
 */
        updateForm.patch = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PerformanceReviewController::destroy
 * @see app/Http/Controllers/PerformanceReviewController.php:105
 * @route '/performance-reviews/{performance_review}'
 */
export const destroy = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/performance-reviews/{performance_review}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PerformanceReviewController::destroy
 * @see app/Http/Controllers/PerformanceReviewController.php:105
 * @route '/performance-reviews/{performance_review}'
 */
destroy.url = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { performance_review: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    performance_review: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        performance_review: args.performance_review,
                }

    return destroy.definition.url
            .replace('{performance_review}', parsedArgs.performance_review.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PerformanceReviewController::destroy
 * @see app/Http/Controllers/PerformanceReviewController.php:105
 * @route '/performance-reviews/{performance_review}'
 */
destroy.delete = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\PerformanceReviewController::destroy
 * @see app/Http/Controllers/PerformanceReviewController.php:105
 * @route '/performance-reviews/{performance_review}'
 */
    const destroyForm = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PerformanceReviewController::destroy
 * @see app/Http/Controllers/PerformanceReviewController.php:105
 * @route '/performance-reviews/{performance_review}'
 */
        destroyForm.delete = (args: { performance_review: string | number } | [performance_review: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const performanceReviews = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default performanceReviews