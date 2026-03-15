import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/learning-courses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LearningCourseController::index
 * @see app/Http/Controllers/LearningCourseController.php:15
 * @route '/learning-courses'
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
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/learning-courses/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LearningCourseController::create
 * @see app/Http/Controllers/LearningCourseController.php:46
 * @route '/learning-courses/create'
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
* @see \App\Http\Controllers\LearningCourseController::store
 * @see app/Http/Controllers/LearningCourseController.php:53
 * @route '/learning-courses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/learning-courses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LearningCourseController::store
 * @see app/Http/Controllers/LearningCourseController.php:53
 * @route '/learning-courses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::store
 * @see app/Http/Controllers/LearningCourseController.php:53
 * @route '/learning-courses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::store
 * @see app/Http/Controllers/LearningCourseController.php:53
 * @route '/learning-courses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::store
 * @see app/Http/Controllers/LearningCourseController.php:53
 * @route '/learning-courses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
export const show = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/learning-courses/{learning_course}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
show.url = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { learning_course: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    learning_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        learning_course: args.learning_course,
                }

    return show.definition.url
            .replace('{learning_course}', parsedArgs.learning_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
show.get = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
show.head = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
    const showForm = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
        showForm.get = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LearningCourseController::show
 * @see app/Http/Controllers/LearningCourseController.php:65
 * @route '/learning-courses/{learning_course}'
 */
        showForm.head = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
export const edit = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/learning-courses/{learning_course}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
edit.url = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { learning_course: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    learning_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        learning_course: args.learning_course,
                }

    return edit.definition.url
            .replace('{learning_course}', parsedArgs.learning_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
edit.get = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
edit.head = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
    const editForm = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
        editForm.get = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LearningCourseController::edit
 * @see app/Http/Controllers/LearningCourseController.php:72
 * @route '/learning-courses/{learning_course}/edit'
 */
        editForm.head = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
export const update = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/learning-courses/{learning_course}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
update.url = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { learning_course: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    learning_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        learning_course: args.learning_course,
                }

    return update.definition.url
            .replace('{learning_course}', parsedArgs.learning_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
update.put = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
update.patch = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
    const updateForm = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
        updateForm.put = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\LearningCourseController::update
 * @see app/Http/Controllers/LearningCourseController.php:80
 * @route '/learning-courses/{learning_course}'
 */
        updateForm.patch = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\LearningCourseController::destroy
 * @see app/Http/Controllers/LearningCourseController.php:92
 * @route '/learning-courses/{learning_course}'
 */
export const destroy = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/learning-courses/{learning_course}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LearningCourseController::destroy
 * @see app/Http/Controllers/LearningCourseController.php:92
 * @route '/learning-courses/{learning_course}'
 */
destroy.url = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { learning_course: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    learning_course: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        learning_course: args.learning_course,
                }

    return destroy.definition.url
            .replace('{learning_course}', parsedArgs.learning_course.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LearningCourseController::destroy
 * @see app/Http/Controllers/LearningCourseController.php:92
 * @route '/learning-courses/{learning_course}'
 */
destroy.delete = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LearningCourseController::destroy
 * @see app/Http/Controllers/LearningCourseController.php:92
 * @route '/learning-courses/{learning_course}'
 */
    const destroyForm = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LearningCourseController::destroy
 * @see app/Http/Controllers/LearningCourseController.php:92
 * @route '/learning-courses/{learning_course}'
 */
        destroyForm.delete = (args: { learning_course: string | number } | [learning_course: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const learningCourses = {
    index: Object.assign(index, index),
create: Object.assign(create, create),
store: Object.assign(store, store),
show: Object.assign(show, show),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default learningCourses