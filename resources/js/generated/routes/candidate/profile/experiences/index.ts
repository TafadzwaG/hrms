import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\ProfileController::store
 * @see app/Http/Controllers/Candidate/ProfileController.php:120
 * @route '/candidate/profile/experiences'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate/profile/experiences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::store
 * @see app/Http/Controllers/Candidate/ProfileController.php:120
 * @route '/candidate/profile/experiences'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::store
 * @see app/Http/Controllers/Candidate/ProfileController.php:120
 * @route '/candidate/profile/experiences'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::store
 * @see app/Http/Controllers/Candidate/ProfileController.php:120
 * @route '/candidate/profile/experiences'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::store
 * @see app/Http/Controllers/Candidate/ProfileController.php:120
 * @route '/candidate/profile/experiences'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:137
 * @route '/candidate/profile/experiences/{experience}'
 */
export const update = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/profile/experiences/{experience}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:137
 * @route '/candidate/profile/experiences/{experience}'
 */
update.url = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experience: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experience: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experience: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experience: typeof args.experience === 'object'
                ? args.experience.id
                : args.experience,
                }

    return update.definition.url
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:137
 * @route '/candidate/profile/experiences/{experience}'
 */
update.put = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:137
 * @route '/candidate/profile/experiences/{experience}'
 */
    const updateForm = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:137
 * @route '/candidate/profile/experiences/{experience}'
 */
        updateForm.put = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:156
 * @route '/candidate/profile/experiences/{experience}'
 */
export const destroy = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate/profile/experiences/{experience}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:156
 * @route '/candidate/profile/experiences/{experience}'
 */
destroy.url = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experience: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experience: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experience: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experience: typeof args.experience === 'object'
                ? args.experience.id
                : args.experience,
                }

    return destroy.definition.url
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:156
 * @route '/candidate/profile/experiences/{experience}'
 */
destroy.delete = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:156
 * @route '/candidate/profile/experiences/{experience}'
 */
    const destroyForm = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:156
 * @route '/candidate/profile/experiences/{experience}'
 */
        destroyForm.delete = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const experiences = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default experiences