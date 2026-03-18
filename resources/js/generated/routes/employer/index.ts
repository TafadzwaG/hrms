import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/employer/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:18
 * @route '/employer/login'
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
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/employer/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:44
 * @route '/employer/register'
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
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/employer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployerHubDashboardController::__invoke
 * @see app/Http/Controllers/EmployerHubDashboardController.php:15
 * @route '/employer/dashboard'
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
const employer = {
    login: Object.assign(login, login),
register: Object.assign(register, register),
dashboard: Object.assign(dashboard, dashboard),
}

export default employer