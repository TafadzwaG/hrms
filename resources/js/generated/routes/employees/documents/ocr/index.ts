import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
export const show = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/documents/{document}/ocr',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
show.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
show.get = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
show.head = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
    const showForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
        showForm.get = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OcrController::show
 * @see app/Http/Controllers/OcrController.php:21
 * @route '/employees/{employee}/documents/{document}/ocr'
 */
        showForm.head = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\OcrController::retry
 * @see app/Http/Controllers/OcrController.php:114
 * @route '/employees/{employee}/documents/{document}/ocr/retry'
 */
export const retry = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

retry.definition = {
    methods: ["post"],
    url: '/employees/{employee}/documents/{document}/ocr/retry',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OcrController::retry
 * @see app/Http/Controllers/OcrController.php:114
 * @route '/employees/{employee}/documents/{document}/ocr/retry'
 */
retry.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return retry.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OcrController::retry
 * @see app/Http/Controllers/OcrController.php:114
 * @route '/employees/{employee}/documents/{document}/ocr/retry'
 */
retry.post = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retry.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OcrController::retry
 * @see app/Http/Controllers/OcrController.php:114
 * @route '/employees/{employee}/documents/{document}/ocr/retry'
 */
    const retryForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retry.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OcrController::retry
 * @see app/Http/Controllers/OcrController.php:114
 * @route '/employees/{employee}/documents/{document}/ocr/retry'
 */
        retryForm.post = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retry.url(args, options),
            method: 'post',
        })
    
    retry.form = retryForm
/**
* @see \App\Http\Controllers\OcrController::processNow
 * @see app/Http/Controllers/OcrController.php:82
 * @route '/employees/{employee}/documents/{document}/ocr/process-now'
 */
export const processNow = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processNow.url(args, options),
    method: 'post',
})

processNow.definition = {
    methods: ["post"],
    url: '/employees/{employee}/documents/{document}/ocr/process-now',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OcrController::processNow
 * @see app/Http/Controllers/OcrController.php:82
 * @route '/employees/{employee}/documents/{document}/ocr/process-now'
 */
processNow.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return processNow.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OcrController::processNow
 * @see app/Http/Controllers/OcrController.php:82
 * @route '/employees/{employee}/documents/{document}/ocr/process-now'
 */
processNow.post = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processNow.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OcrController::processNow
 * @see app/Http/Controllers/OcrController.php:82
 * @route '/employees/{employee}/documents/{document}/ocr/process-now'
 */
    const processNowForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: processNow.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OcrController::processNow
 * @see app/Http/Controllers/OcrController.php:82
 * @route '/employees/{employee}/documents/{document}/ocr/process-now'
 */
        processNowForm.post = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: processNow.url(args, options),
            method: 'post',
        })
    
    processNow.form = processNowForm
const ocr = {
    show: Object.assign(show, show),
retry: Object.assign(retry, retry),
processNow: Object.assign(processNow, processNow),
}

export default ocr