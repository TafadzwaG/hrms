import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
 */
export const showLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

showLogin.definition = {
    methods: ["get","head"],
    url: '/candidate/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
 */
showLogin.url = (options?: RouteQueryOptions) => {
    return showLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
 */
showLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
 */
showLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLogin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
 */
    const showLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showLogin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
 */
        showLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showLogin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateAuthController::showLogin
 * @see app/Http/Controllers/CandidateAuthController.php:18
 * @route '/candidate/login'
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
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:26
 * @route '/candidate/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/candidate/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:26
 * @route '/candidate/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:26
 * @route '/candidate/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:26
 * @route '/candidate/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateAuthController::login
 * @see app/Http/Controllers/CandidateAuthController.php:26
 * @route '/candidate/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
 */
export const showRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

showRegister.definition = {
    methods: ["get","head"],
    url: '/candidate/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
 */
showRegister.url = (options?: RouteQueryOptions) => {
    return showRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
 */
showRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
 */
showRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRegister.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
 */
    const showRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showRegister.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
 */
        showRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showRegister.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateAuthController::showRegister
 * @see app/Http/Controllers/CandidateAuthController.php:56
 * @route '/candidate/register'
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
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:72
 * @route '/candidate/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/candidate/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:72
 * @route '/candidate/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:72
 * @route '/candidate/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:72
 * @route '/candidate/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateAuthController::register
 * @see app/Http/Controllers/CandidateAuthController.php:72
 * @route '/candidate/register'
 */
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
    
    register.form = registerForm
const CandidateAuthController = { showLogin, login, showRegister, register }

export default CandidateAuthController