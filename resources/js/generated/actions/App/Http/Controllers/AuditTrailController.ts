import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/audit-trail',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditTrailController::index
 * @see app/Http/Controllers/AuditTrailController.php:16
 * @route '/audit-trail'
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
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
export const logs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})

logs.definition = {
    methods: ["get","head"],
    url: '/audit-trail/logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
logs.url = (options?: RouteQueryOptions) => {
    return logs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
logs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
logs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
    const logsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: logs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
        logsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditTrailController::logs
 * @see app/Http/Controllers/AuditTrailController.php:70
 * @route '/audit-trail/logs'
 */
        logsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    logs.form = logsForm
/**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/audit-trail/logs/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditTrailController::exportMethod
 * @see app/Http/Controllers/AuditTrailController.php:160
 * @route '/audit-trail/logs/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
export const show = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/audit-trail/logs/{auditLog}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
show.url = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { auditLog: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { auditLog: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    auditLog: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        auditLog: typeof args.auditLog === 'object'
                ? args.auditLog.id
                : args.auditLog,
                }

    return show.definition.url
            .replace('{auditLog}', parsedArgs.auditLog.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
show.get = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
show.head = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
    const showForm = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
        showForm.get = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AuditTrailController::show
 * @see app/Http/Controllers/AuditTrailController.php:111
 * @route '/audit-trail/logs/{auditLog}'
 */
        showForm.head = (args: { auditLog: number | { id: number } } | [auditLog: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const AuditTrailController = { index, logs, exportMethod, show, export: exportMethod }

export default AuditTrailController