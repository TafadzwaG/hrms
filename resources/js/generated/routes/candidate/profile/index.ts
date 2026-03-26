import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import summary from './summary'
import image from './image'
import experiences from './experiences'
/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:39
 * @route '/candidate/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:39
 * @route '/candidate/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:39
 * @route '/candidate/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:39
 * @route '/candidate/profile'
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
 * @see app/Http/Controllers/Candidate/ProfileController.php:39
 * @route '/candidate/profile'
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
const profile = {
    update: Object.assign(update, update),
summary: Object.assign(summary, summary),
image: Object.assign(image, image),
experiences: Object.assign(experiences, experiences),
}

export default profile