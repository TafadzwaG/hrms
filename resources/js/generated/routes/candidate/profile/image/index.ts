import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:68
 * @route '/candidate/profile/image'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/candidate/profile/image',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:68
 * @route '/candidate/profile/image'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:68
 * @route '/candidate/profile/image'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:68
 * @route '/candidate/profile/image'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:68
 * @route '/candidate/profile/image'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:96
 * @route '/candidate/profile/image'
 */
export const destroy = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate/profile/image',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:96
 * @route '/candidate/profile/image'
 */
destroy.url = (options?: RouteQueryOptions) => {
    return destroy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:96
 * @route '/candidate/profile/image'
 */
destroy.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:96
 * @route '/candidate/profile/image'
 */
    const destroyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::destroy
 * @see app/Http/Controllers/Candidate/ProfileController.php:96
 * @route '/candidate/profile/image'
 */
        destroyForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const image = {
    update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default image