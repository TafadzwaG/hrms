import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/documents/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::register
 * @see app/Http/Controllers/Reports/DocumentReportController.php:10
 * @route '/reports/documents/register'
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
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
export const byType = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(options),
    method: 'get',
})

byType.definition = {
    methods: ["get","head"],
    url: '/reports/documents/by-type',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
byType.url = (options?: RouteQueryOptions) => {
    return byType.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
byType.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
byType.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byType.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
    const byTypeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byType.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
        byTypeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byType.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::byType
 * @see app/Http/Controllers/Reports/DocumentReportController.php:17
 * @route '/reports/documents/by-type'
 */
        byTypeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byType.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byType.form = byTypeForm
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
export const byEmployee = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byEmployee.url(options),
    method: 'get',
})

byEmployee.definition = {
    methods: ["get","head"],
    url: '/reports/documents/by-employee',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
byEmployee.url = (options?: RouteQueryOptions) => {
    return byEmployee.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
byEmployee.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byEmployee.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
byEmployee.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byEmployee.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
    const byEmployeeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byEmployee.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
        byEmployeeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byEmployee.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::byEmployee
 * @see app/Http/Controllers/Reports/DocumentReportController.php:22
 * @route '/reports/documents/by-employee'
 */
        byEmployeeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byEmployee.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byEmployee.form = byEmployeeForm
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
export const expiring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiring.url(options),
    method: 'get',
})

expiring.definition = {
    methods: ["get","head"],
    url: '/reports/documents/expiring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
expiring.url = (options?: RouteQueryOptions) => {
    return expiring.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
expiring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiring.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
expiring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expiring.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
    const expiringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expiring.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
        expiringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiring.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::expiring
 * @see app/Http/Controllers/Reports/DocumentReportController.php:27
 * @route '/reports/documents/expiring'
 */
        expiringForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiring.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    expiring.form = expiringForm
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
export const expired = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})

expired.definition = {
    methods: ["get","head"],
    url: '/reports/documents/expired',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
expired.url = (options?: RouteQueryOptions) => {
    return expired.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
expired.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
expired.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expired.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
    const expiredForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expired.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
        expiredForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expired.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::expired
 * @see app/Http/Controllers/Reports/DocumentReportController.php:38
 * @route '/reports/documents/expired'
 */
        expiredForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expired.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    expired.form = expiredForm
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
export const missingFileReference = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingFileReference.url(options),
    method: 'get',
})

missingFileReference.definition = {
    methods: ["get","head"],
    url: '/reports/documents/missing-file-reference',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
missingFileReference.url = (options?: RouteQueryOptions) => {
    return missingFileReference.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
missingFileReference.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingFileReference.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
missingFileReference.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: missingFileReference.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
    const missingFileReferenceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: missingFileReference.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
        missingFileReferenceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingFileReference.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\DocumentReportController::missingFileReference
 * @see app/Http/Controllers/Reports/DocumentReportController.php:49
 * @route '/reports/documents/missing-file-reference'
 */
        missingFileReferenceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingFileReference.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    missingFileReference.form = missingFileReferenceForm
const documents = {
    register: Object.assign(register, register),
byType: Object.assign(byType, byType),
byEmployee: Object.assign(byEmployee, byEmployee),
expiring: Object.assign(expiring, expiring),
expired: Object.assign(expired, expired),
missingFileReference: Object.assign(missingFileReference, missingFileReference),
}

export default documents