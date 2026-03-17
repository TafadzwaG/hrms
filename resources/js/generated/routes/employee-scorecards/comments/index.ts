import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
export const store = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employee-scorecards/{employee_scorecard}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
store.url = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee_scorecard: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    employee_scorecard: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee_scorecard: args.employee_scorecard,
                }

    return store.definition.url
            .replace('{employee_scorecard}', parsedArgs.employee_scorecard.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
store.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
    const storeForm = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeScorecardController::store
 * @see app/Http/Controllers/EmployeeScorecardController.php:338
 * @route '/employee-scorecards/{employee_scorecard}/comments'
 */
        storeForm.post = (args: { employee_scorecard: string | number } | [employee_scorecard: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
const comments = {
    store: Object.assign(store, store),
}

export default comments