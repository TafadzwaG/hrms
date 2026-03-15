import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
export const catalog = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(options),
    method: 'get',
})

catalog.definition = {
    methods: ["get","head"],
    url: '/reports/learning-courses/catalog',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
catalog.url = (options?: RouteQueryOptions) => {
    return catalog.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
catalog.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: catalog.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
catalog.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: catalog.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
    const catalogForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: catalog.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
        catalogForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::catalog
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:10
 * @route '/reports/learning-courses/catalog'
 */
        catalogForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: catalog.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    catalog.form = catalogForm
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
 */
export const byCategory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCategory.url(options),
    method: 'get',
})

byCategory.definition = {
    methods: ["get","head"],
    url: '/reports/learning-courses/by-category',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
 */
byCategory.url = (options?: RouteQueryOptions) => {
    return byCategory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
 */
byCategory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCategory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
 */
byCategory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byCategory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
 */
    const byCategoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byCategory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
 */
        byCategoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCategory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byCategory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:17
 * @route '/reports/learning-courses/by-category'
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
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/learning-courses/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::byStatus
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:22
 * @route '/reports/learning-courses/by-status'
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
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
export const mandatory = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mandatory.url(options),
    method: 'get',
})

mandatory.definition = {
    methods: ["get","head"],
    url: '/reports/learning-courses/mandatory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
mandatory.url = (options?: RouteQueryOptions) => {
    return mandatory.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
mandatory.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mandatory.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
mandatory.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mandatory.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
    const mandatoryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mandatory.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
        mandatoryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mandatory.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::mandatory
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:27
 * @route '/reports/learning-courses/mandatory'
 */
        mandatoryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mandatory.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mandatory.form = mandatoryForm
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
 */
export const expiring = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiring.url(options),
    method: 'get',
})

expiring.definition = {
    methods: ["get","head"],
    url: '/reports/learning-courses/expiring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
 */
expiring.url = (options?: RouteQueryOptions) => {
    return expiring.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
 */
expiring.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiring.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
 */
expiring.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expiring.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
 */
    const expiringForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expiring.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
 */
        expiringForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiring.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expiring
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:39
 * @route '/reports/learning-courses/expiring'
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
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
 */
export const expired = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})

expired.definition = {
    methods: ["get","head"],
    url: '/reports/learning-courses/expired',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
 */
expired.url = (options?: RouteQueryOptions) => {
    return expired.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
 */
expired.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expired.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
 */
expired.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expired.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
 */
    const expiredForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expired.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
 */
        expiredForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expired.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\LearningCourseReportController::expired
 * @see app/Http/Controllers/Reports/LearningCourseReportController.php:50
 * @route '/reports/learning-courses/expired'
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
const learningCourses = {
    catalog: Object.assign(catalog, catalog),
byCategory: Object.assign(byCategory, byCategory),
byStatus: Object.assign(byStatus, byStatus),
mandatory: Object.assign(mandatory, mandatory),
expiring: Object.assign(expiring, expiring),
expired: Object.assign(expired, expired),
}

export default learningCourses