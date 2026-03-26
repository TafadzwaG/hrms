import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:25
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
 * @see app/Http/Controllers/PayslipController.php:25
 * @route '/payroll/payslips'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:25
 * @route '/payroll/payslips'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:25
 * @route '/payroll/payslips'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:25
 * @route '/payroll/payslips'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:25
 * @route '/payroll/payslips'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayslipController::index
 * @see app/Http/Controllers/PayslipController.php:25
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
 * @see app/Http/Controllers/PayslipController.php:153
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
 * @see app/Http/Controllers/PayslipController.php:153
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
 * @see app/Http/Controllers/PayslipController.php:153
 * @route '/payroll/payslips/{result}'
 */
show.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:153
 * @route '/payroll/payslips/{result}'
 */
show.head = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:153
 * @route '/payroll/payslips/{result}'
 */
    const showForm = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:153
 * @route '/payroll/payslips/{result}'
 */
        showForm.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayslipController::show
 * @see app/Http/Controllers/PayslipController.php:153
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
 * @see app/Http/Controllers/PayslipController.php:164
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
 * @see app/Http/Controllers/PayslipController.php:164
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
 * @see app/Http/Controllers/PayslipController.php:164
 * @route '/payroll/payslips/{result}/download'
 */
download.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:164
 * @route '/payroll/payslips/{result}/download'
 */
download.head = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:164
 * @route '/payroll/payslips/{result}/download'
 */
    const downloadForm = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:164
 * @route '/payroll/payslips/{result}/download'
 */
        downloadForm.get = (args: { result: string | number } | [result: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayslipController::download
 * @see app/Http/Controllers/PayslipController.php:164
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
const PayslipController = { index, show, download }

export default PayslipController