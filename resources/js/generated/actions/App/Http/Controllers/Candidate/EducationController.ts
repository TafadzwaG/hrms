import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/candidate/education',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\EducationController::index
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
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
* @see \App\Http\Controllers\Candidate\EducationController::store
 * @see app/Http/Controllers/Candidate/EducationController.php:33
 * @route '/candidate/education'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate/education',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\EducationController::store
 * @see app/Http/Controllers/Candidate/EducationController.php:33
 * @route '/candidate/education'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\EducationController::store
 * @see app/Http/Controllers/Candidate/EducationController.php:33
 * @route '/candidate/education'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\EducationController::store
 * @see app/Http/Controllers/Candidate/EducationController.php:33
 * @route '/candidate/education'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\EducationController::store
 * @see app/Http/Controllers/Candidate/EducationController.php:33
 * @route '/candidate/education'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Candidate\EducationController::update
 * @see app/Http/Controllers/Candidate/EducationController.php:46
 * @route '/candidate/education/{education}'
 */
export const update = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/education/{education}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\EducationController::update
 * @see app/Http/Controllers/Candidate/EducationController.php:46
 * @route '/candidate/education/{education}'
 */
update.url = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { education: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { education: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    education: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        education: typeof args.education === 'object'
                ? args.education.id
                : args.education,
                }

    return update.definition.url
            .replace('{education}', parsedArgs.education.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\EducationController::update
 * @see app/Http/Controllers/Candidate/EducationController.php:46
 * @route '/candidate/education/{education}'
 */
update.put = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\EducationController::update
 * @see app/Http/Controllers/Candidate/EducationController.php:46
 * @route '/candidate/education/{education}'
 */
    const updateForm = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\EducationController::update
 * @see app/Http/Controllers/Candidate/EducationController.php:46
 * @route '/candidate/education/{education}'
 */
        updateForm.put = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Candidate\EducationController::destroy
 * @see app/Http/Controllers/Candidate/EducationController.php:61
 * @route '/candidate/education/{education}'
 */
export const destroy = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate/education/{education}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Candidate\EducationController::destroy
 * @see app/Http/Controllers/Candidate/EducationController.php:61
 * @route '/candidate/education/{education}'
 */
destroy.url = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { education: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { education: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    education: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        education: typeof args.education === 'object'
                ? args.education.id
                : args.education,
                }

    return destroy.definition.url
            .replace('{education}', parsedArgs.education.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\EducationController::destroy
 * @see app/Http/Controllers/Candidate/EducationController.php:61
 * @route '/candidate/education/{education}'
 */
destroy.delete = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Candidate\EducationController::destroy
 * @see app/Http/Controllers/Candidate/EducationController.php:61
 * @route '/candidate/education/{education}'
 */
    const destroyForm = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\EducationController::destroy
 * @see app/Http/Controllers/Candidate/EducationController.php:61
 * @route '/candidate/education/{education}'
 */
        destroyForm.delete = (args: { education: number | { id: number } } | [education: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const EducationController = { index, store, update, destroy }

export default EducationController