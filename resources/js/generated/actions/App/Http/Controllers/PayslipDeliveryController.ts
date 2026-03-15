import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkEmail
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
export const bulkEmail = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkEmail.url(options),
    method: 'post',
})

bulkEmail.definition = {
    methods: ["post"],
    url: '/payroll/payslips/email',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkEmail
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
bulkEmail.url = (options?: RouteQueryOptions) => {
    return bulkEmail.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkEmail
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
bulkEmail.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkEmail.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkEmail
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
    const bulkEmailForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkEmail.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkEmail
 * @see app/Http/Controllers/PayslipDeliveryController.php:50
 * @route '/payroll/payslips/email'
 */
        bulkEmailForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkEmail.url(options),
            method: 'post',
        })
    
    bulkEmail.form = bulkEmailForm
/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkSms
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
export const bulkSms = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkSms.url(options),
    method: 'post',
})

bulkSms.definition = {
    methods: ["post"],
    url: '/payroll/payslips/sms',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkSms
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
bulkSms.url = (options?: RouteQueryOptions) => {
    return bulkSms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkSms
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
bulkSms.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkSms.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkSms
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
    const bulkSmsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkSms.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PayslipDeliveryController::bulkSms
 * @see app/Http/Controllers/PayslipDeliveryController.php:65
 * @route '/payroll/payslips/sms'
 */
        bulkSmsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkSms.url(options),
            method: 'post',
        })
    
    bulkSms.form = bulkSmsForm
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
const PayslipDeliveryController = { bulkEmail, bulkSms, email, sms }

export default PayslipDeliveryController