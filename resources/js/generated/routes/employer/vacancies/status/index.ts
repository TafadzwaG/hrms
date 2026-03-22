import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:168
 * @route '/employer/vacancies/{vacancy}/status'
 */
export const update = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/employer/vacancies/{vacancy}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:168
 * @route '/employer/vacancies/{vacancy}/status'
 */
update.url = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vacancy: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    vacancy: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vacancy: args.vacancy,
                }

    return update.definition.url
            .replace('{vacancy}', parsedArgs.vacancy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:168
 * @route '/employer/vacancies/{vacancy}/status'
 */
update.patch = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:168
 * @route '/employer/vacancies/{vacancy}/status'
 */
    const updateForm = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Employer\VacanciesController::update
 * @see app/Http/Controllers/Employer/VacanciesController.php:168
 * @route '/employer/vacancies/{vacancy}/status'
 */
        updateForm.patch = (args: { vacancy: string | number } | [vacancy: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const status = {
    update: Object.assign(update, update),
}

export default status