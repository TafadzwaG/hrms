import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employer/interviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\InterviewsController::index
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
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
* @see \App\Http\Controllers\Employer\InterviewsController::store
 * @see app/Http/Controllers/Employer/InterviewsController.php:64
 * @route '/employer/interviews/{application}'
 */
export const store = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employer/interviews/{application}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Employer\InterviewsController::store
 * @see app/Http/Controllers/Employer/InterviewsController.php:64
 * @route '/employer/interviews/{application}'
 */
store.url = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { application: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    application: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        application: args.application,
                }

    return store.definition.url
            .replace('{application}', parsedArgs.application.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\InterviewsController::store
 * @see app/Http/Controllers/Employer/InterviewsController.php:64
 * @route '/employer/interviews/{application}'
 */
store.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Employer\InterviewsController::store
 * @see app/Http/Controllers/Employer/InterviewsController.php:64
 * @route '/employer/interviews/{application}'
 */
    const storeForm = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\InterviewsController::store
 * @see app/Http/Controllers/Employer/InterviewsController.php:64
 * @route '/employer/interviews/{application}'
 */
        storeForm.post = (args: { application: string | number } | [application: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Employer\InterviewsController::update
 * @see app/Http/Controllers/Employer/InterviewsController.php:109
 * @route '/employer/interviews/{interview}'
 */
export const update = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/employer/interviews/{interview}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employer\InterviewsController::update
 * @see app/Http/Controllers/Employer/InterviewsController.php:109
 * @route '/employer/interviews/{interview}'
 */
update.url = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { interview: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    interview: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        interview: args.interview,
                }

    return update.definition.url
            .replace('{interview}', parsedArgs.interview.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\InterviewsController::update
 * @see app/Http/Controllers/Employer/InterviewsController.php:109
 * @route '/employer/interviews/{interview}'
 */
update.patch = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employer\InterviewsController::update
 * @see app/Http/Controllers/Employer/InterviewsController.php:109
 * @route '/employer/interviews/{interview}'
 */
    const updateForm = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\InterviewsController::update
 * @see app/Http/Controllers/Employer/InterviewsController.php:109
 * @route '/employer/interviews/{interview}'
 */
        updateForm.patch = (args: { interview: string | number } | [interview: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const InterviewsController = { index, store, update }

export default InterviewsController