import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:55
 * @route '/candidate/profile/summary'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/profile/summary',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:55
 * @route '/candidate/profile/summary'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:55
 * @route '/candidate/profile/summary'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:55
 * @route '/candidate/profile/summary'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:55
 * @route '/candidate/profile/summary'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const summary = {
    update: Object.assign(update, update),
}

export default summary