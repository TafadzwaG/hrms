import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
export const showLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

showLogin.definition = {
    methods: ["get","head"],
    url: '/employer/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
showLogin.url = (options?: RouteQueryOptions) => {
    return showLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
showLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
showLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLogin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
    const showLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showLogin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
        showLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showLogin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployerAuthController::showLogin
 * @see app/Http/Controllers/EmployerAuthController.php:19
 * @route '/employer/login'
 */
        showLoginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showLogin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showLogin.form = showLoginForm
/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:27
 * @route '/employer/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/employer/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:27
 * @route '/employer/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:27
 * @route '/employer/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:27
 * @route '/employer/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployerAuthController::login
 * @see app/Http/Controllers/EmployerAuthController.php:27
 * @route '/employer/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
export const showRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

showRegister.definition = {
    methods: ["get","head"],
    url: '/employer/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
showRegister.url = (options?: RouteQueryOptions) => {
    return showRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
showRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
showRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRegister.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
    const showRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showRegister.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
        showRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showRegister.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployerAuthController::showRegister
 * @see app/Http/Controllers/EmployerAuthController.php:57
 * @route '/employer/register'
 */
        showRegisterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showRegister.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showRegister.form = showRegisterForm
/**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:73
 * @route '/employer/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/employer/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:73
 * @route '/employer/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:73
 * @route '/employer/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:73
 * @route '/employer/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployerAuthController::register
 * @see app/Http/Controllers/EmployerAuthController.php:73
 * @route '/employer/register'
 */
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
    
    register.form = registerForm
const EmployerAuthController = { showLogin, login, showRegister, register }

export default EmployerAuthController