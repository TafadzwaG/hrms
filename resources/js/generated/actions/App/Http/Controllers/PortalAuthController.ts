import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
 */
export const showLogin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})

showLogin.definition = {
    methods: ["get","head"],
    url: '/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
 */
showLogin.url = (options?: RouteQueryOptions) => {
    return showLogin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
 */
showLogin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showLogin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
 */
showLogin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showLogin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
 */
    const showLoginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showLogin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
 */
        showLoginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showLogin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PortalAuthController::showLogin
 * @see app/Http/Controllers/PortalAuthController.php:28
 * @route '/login'
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
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
 */
export const showRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})

showRegister.definition = {
    methods: ["get","head"],
    url: '/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
 */
showRegister.url = (options?: RouteQueryOptions) => {
    return showRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
 */
showRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showRegister.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
 */
showRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showRegister.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
 */
    const showRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showRegister.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
 */
        showRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showRegister.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PortalAuthController::showRegister
 * @see app/Http/Controllers/PortalAuthController.php:43
 * @route '/register'
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
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/register'
 */
const registere9819db9819a1d19b38dd89a0c4218c4 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'post',
})

registere9819db9819a1d19b38dd89a0c4218c4.definition = {
    methods: ["post"],
    url: '/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/register'
 */
registere9819db9819a1d19b38dd89a0c4218c4.url = (options?: RouteQueryOptions) => {
    return registere9819db9819a1d19b38dd89a0c4218c4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/register'
 */
registere9819db9819a1d19b38dd89a0c4218c4.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registere9819db9819a1d19b38dd89a0c4218c4.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/register'
 */
    const registere9819db9819a1d19b38dd89a0c4218c4Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registere9819db9819a1d19b38dd89a0c4218c4.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/register'
 */
        registere9819db9819a1d19b38dd89a0c4218c4Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registere9819db9819a1d19b38dd89a0c4218c4.url(options),
            method: 'post',
        })
    
    registere9819db9819a1d19b38dd89a0c4218c4.form = registere9819db9819a1d19b38dd89a0c4218c4Form
    /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
const register1f597c23df26e24199d158bcc9fdb982 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'post',
})

register1f597c23df26e24199d158bcc9fdb982.definition = {
    methods: ["post"],
    url: '/candidate/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
register1f597c23df26e24199d158bcc9fdb982.url = (options?: RouteQueryOptions) => {
    return register1f597c23df26e24199d158bcc9fdb982.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
register1f597c23df26e24199d158bcc9fdb982.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
    const register1f597c23df26e24199d158bcc9fdb982Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register1f597c23df26e24199d158bcc9fdb982.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/candidate/register'
 */
        register1f597c23df26e24199d158bcc9fdb982Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register1f597c23df26e24199d158bcc9fdb982.url(options),
            method: 'post',
        })
    
    register1f597c23df26e24199d158bcc9fdb982.form = register1f597c23df26e24199d158bcc9fdb982Form
    /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/employer/register'
 */
const register74a4773be0b9c53b104aabbe135d020d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'post',
})

register74a4773be0b9c53b104aabbe135d020d.definition = {
    methods: ["post"],
    url: '/employer/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/employer/register'
 */
register74a4773be0b9c53b104aabbe135d020d.url = (options?: RouteQueryOptions) => {
    return register74a4773be0b9c53b104aabbe135d020d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/employer/register'
 */
register74a4773be0b9c53b104aabbe135d020d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/employer/register'
 */
    const register74a4773be0b9c53b104aabbe135d020dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register74a4773be0b9c53b104aabbe135d020d.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::register
 * @see app/Http/Controllers/PortalAuthController.php:69
 * @route '/employer/register'
 */
        register74a4773be0b9c53b104aabbe135d020dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register74a4773be0b9c53b104aabbe135d020d.url(options),
            method: 'post',
        })
    
    register74a4773be0b9c53b104aabbe135d020d.form = register74a4773be0b9c53b104aabbe135d020dForm

export const register = {
    '/register': registere9819db9819a1d19b38dd89a0c4218c4,
    '/candidate/register': register1f597c23df26e24199d158bcc9fdb982,
    '/employer/register': register74a4773be0b9c53b104aabbe135d020d,
}

/**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
export const switchPortal = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchPortal.url(args, options),
    method: 'get',
})

switchPortal.definition = {
    methods: ["get","head"],
    url: '/portal/switch/{portal}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
switchPortal.url = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { portal: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    portal: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        portal: args.portal,
                }

    return switchPortal.definition.url
            .replace('{portal}', parsedArgs.portal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
switchPortal.get = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: switchPortal.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
switchPortal.head = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: switchPortal.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
    const switchPortalForm = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: switchPortal.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
        switchPortalForm.get = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: switchPortal.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PortalAuthController::switchPortal
 * @see app/Http/Controllers/PortalAuthController.php:107
 * @route '/portal/switch/{portal}'
 */
        switchPortalForm.head = (args: { portal: string | number } | [portal: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: switchPortal.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    switchPortal.form = switchPortalForm
const PortalAuthController = { showLogin, showRegister, register, switchPortal }

export default PortalAuthController