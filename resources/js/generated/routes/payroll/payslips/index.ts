import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/payslips',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:21
 * @route '/payroll/payslips'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
export const show = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/payroll/payslips/{result}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
show.url = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { result: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    result: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        result: args.result,
                }

    return show.definition.url
            .replace('{result}', parsedArgs.result.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
show.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
show.head = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
    const showForm = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
        showForm.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:147
 * @route '/payroll/payslips/{result}'
 */
        showForm.head = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
export const download = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/payroll/payslips/{result}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
download.url = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { result: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    result: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        result: args.result,
                }

    return download.definition.url
            .replace('{result}', parsedArgs.result.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
download.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
download.head = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
    const downloadForm = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
        downloadForm.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:157
 * @route '/payroll/payslips/{result}/download'
 */
        downloadForm.head = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\PayslipDeliveryController::email
 * @see app/Http/Controllers/PayslipDeliveryController.php:16
 * @route '/payroll/payslips/{result}/email'
 */
export const email = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: email.url(args, options),
    method: 'post',
})

email.definition = {
    methods: ["post"],
    url: '/payroll/payslips/{result}/email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayslipDeliveryController::email
 * @see app/Http/Controllers/PayslipDeliveryController.php:16
 * @route '/payroll/payslips/{result}/email'
 */
email.url = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { result: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    result: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        result: args.result,
                }

    return email.definition.url
            .replace('{result}', parsedArgs.result.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipDeliveryController::email
 * @see app/Http/Controllers/PayslipDeliveryController.php:16
 * @route '/payroll/payslips/{result}/email'
 */
email.post = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: email.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayslipDeliveryController::email
 * @see app/Http/Controllers/PayslipDeliveryController.php:16
 * @route '/payroll/payslips/{result}/email'
 */
    const emailForm = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: email.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayslipDeliveryController::email
 * @see app/Http/Controllers/PayslipDeliveryController.php:16
 * @route '/payroll/payslips/{result}/email'
 */
        emailForm.post = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: email.url(args, options),
            method: 'post',
        })
    
    email.form = emailForm
/**
* @see \App\Http\Controllers\PayslipDeliveryController::sms
 * @see app/Http/Controllers/PayslipDeliveryController.php:33
 * @route '/payroll/payslips/{result}/sms'
 */
export const sms = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sms.url(args, options),
    method: 'post',
})

sms.definition = {
    methods: ["post"],
    url: '/payroll/payslips/{result}/sms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayslipDeliveryController::sms
 * @see app/Http/Controllers/PayslipDeliveryController.php:33
 * @route '/payroll/payslips/{result}/sms'
 */
sms.url = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { result: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    result: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        result: args.result,
                }

    return sms.definition.url
            .replace('{result}', parsedArgs.result.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipDeliveryController::sms
 * @see app/Http/Controllers/PayslipDeliveryController.php:33
 * @route '/payroll/payslips/{result}/sms'
 */
sms.post = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sms.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayslipDeliveryController::sms
 * @see app/Http/Controllers/PayslipDeliveryController.php:33
 * @route '/payroll/payslips/{result}/sms'
 */
    const smsForm = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sms.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayslipDeliveryController::sms
 * @see app/Http/Controllers/PayslipDeliveryController.php:33
 * @route '/payroll/payslips/{result}/sms'
 */
        smsForm.post = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sms.url(args, options),
            method: 'post',
        })
    
    sms.form = smsForm
const payslips = {
    index: Object.assign(index, index),
email: Object.assign(email, email),
sms: Object.assign(sms, sms),
show: Object.assign(show, show),
download: Object.assign(download, download),
}

export default payslips