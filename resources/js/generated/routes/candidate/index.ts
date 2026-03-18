import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/candidate/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:17
 * @route '/candidate/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/candidate/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:43
 * @route '/candidate/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/candidate/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateHubDashboardController::__invoke
 * @see app/Http/Controllers/CandidateHubDashboardController.php:15
 * @route '/candidate/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const candidate = {
    login: Object.assign(login, login),
register: Object.assign(register, register),
dashboard: Object.assign(dashboard, dashboard),
}

export default candidate