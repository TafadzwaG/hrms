import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/assets/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::register
 * @see app/Http/Controllers/Reports/AssetReportController.php:12
 * @route '/reports/assets/register'
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
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
export const byCategory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCategory.url(options),
    method: 'get',
})

byCategory.definition = {
    methods: ["get","head"],
    url: '/reports/assets/by-category',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
byCategory.url = (options?: RouteQueryOptions) => {
    return byCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
byCategory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCategory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
byCategory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byCategory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
    const byCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byCategory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
        byCategoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCategory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byCategory
 * @see app/Http/Controllers/Reports/AssetReportController.php:22
 * @route '/reports/assets/by-category'
 */
        byCategoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCategory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byCategory.form = byCategoryForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/assets/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byStatus
 * @see app/Http/Controllers/Reports/AssetReportController.php:27
 * @route '/reports/assets/by-status'
 */
        byStatusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byStatus.form = byStatusForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
export const byLocation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byLocation.url(options),
    method: 'get',
})

byLocation.definition = {
    methods: ["get","head"],
    url: '/reports/assets/by-location',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
byLocation.url = (options?: RouteQueryOptions) => {
    return byLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
byLocation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byLocation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
byLocation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byLocation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
    const byLocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byLocation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
        byLocationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byLocation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byLocation
 * @see app/Http/Controllers/Reports/AssetReportController.php:32
 * @route '/reports/assets/by-location'
 */
        byLocationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byLocation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byLocation.form = byLocationForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
export const byCondition = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCondition.url(options),
    method: 'get',
})

byCondition.definition = {
    methods: ["get","head"],
    url: '/reports/assets/by-condition',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
byCondition.url = (options?: RouteQueryOptions) => {
    return byCondition.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
byCondition.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCondition.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
byCondition.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byCondition.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
    const byConditionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byCondition.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
        byConditionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCondition.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::byCondition
 * @see app/Http/Controllers/Reports/AssetReportController.php:37
 * @route '/reports/assets/by-condition'
 */
        byConditionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCondition.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byCondition.form = byConditionForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
export const warrantyExpiring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: warrantyExpiring.url(options),
    method: 'get',
})

warrantyExpiring.definition = {
    methods: ["get","head"],
    url: '/reports/assets/warranty-expiring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
warrantyExpiring.url = (options?: RouteQueryOptions) => {
    return warrantyExpiring.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
warrantyExpiring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: warrantyExpiring.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
warrantyExpiring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: warrantyExpiring.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
    const warrantyExpiringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: warrantyExpiring.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
        warrantyExpiringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: warrantyExpiring.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::warrantyExpiring
 * @see app/Http/Controllers/Reports/AssetReportController.php:42
 * @route '/reports/assets/warranty-expiring'
 */
        warrantyExpiringForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: warrantyExpiring.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    warrantyExpiring.form = warrantyExpiringForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
export const assignments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignments.url(options),
    method: 'get',
})

assignments.definition = {
    methods: ["get","head"],
    url: '/reports/assets/assignments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
assignments.url = (options?: RouteQueryOptions) => {
    return assignments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
assignments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: assignments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
assignments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: assignments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
    const assignmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: assignments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
        assignmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assignments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::assignments
 * @see app/Http/Controllers/Reports/AssetReportController.php:53
 * @route '/reports/assets/assignments'
 */
        assignmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: assignments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    assignments.form = assignmentsForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
export const maintenance = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: maintenance.url(options),
    method: 'get',
})

maintenance.definition = {
    methods: ["get","head"],
    url: '/reports/assets/maintenance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
maintenance.url = (options?: RouteQueryOptions) => {
    return maintenance.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
maintenance.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: maintenance.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
maintenance.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: maintenance.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
    const maintenanceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: maintenance.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
        maintenanceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: maintenance.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::maintenance
 * @see app/Http/Controllers/Reports/AssetReportController.php:80
 * @route '/reports/assets/maintenance'
 */
        maintenanceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: maintenance.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    maintenance.form = maintenanceForm
/**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
export const depreciation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: depreciation.url(options),
    method: 'get',
})

depreciation.definition = {
    methods: ["get","head"],
    url: '/reports/assets/depreciation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
depreciation.url = (options?: RouteQueryOptions) => {
    return depreciation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
depreciation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: depreciation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
depreciation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: depreciation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
    const depreciationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: depreciation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
        depreciationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: depreciation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\AssetReportController::depreciation
 * @see app/Http/Controllers/Reports/AssetReportController.php:108
 * @route '/reports/assets/depreciation'
 */
        depreciationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: depreciation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    depreciation.form = depreciationForm
const assets = {
    register: Object.assign(register, register),
byCategory: Object.assign(byCategory, byCategory),
byStatus: Object.assign(byStatus, byStatus),
byLocation: Object.assign(byLocation, byLocation),
byCondition: Object.assign(byCondition, byCondition),
warrantyExpiring: Object.assign(warrantyExpiring, warrantyExpiring),
assignments: Object.assign(assignments, assignments),
maintenance: Object.assign(maintenance, maintenance),
depreciation: Object.assign(depreciation, depreciation),
}

export default assets