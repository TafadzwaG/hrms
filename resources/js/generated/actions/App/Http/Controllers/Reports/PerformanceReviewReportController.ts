import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/performance-reviews/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::register
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:10
 * @route '/reports/performance-reviews/register'
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
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/performance-reviews/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byStatus
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:17
 * @route '/reports/performance-reviews/by-status'
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
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
export const byCycle = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCycle.url(options),
    method: 'get',
})

byCycle.definition = {
    methods: ["get","head"],
    url: '/reports/performance-reviews/by-cycle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
byCycle.url = (options?: RouteQueryOptions) => {
    return byCycle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
byCycle.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCycle.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
byCycle.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byCycle.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
    const byCycleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byCycle.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
        byCycleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCycle.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:22
 * @route '/reports/performance-reviews/by-cycle'
 */
        byCycleForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCycle.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byCycle.form = byCycleForm
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
export const byReviewer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byReviewer.url(options),
    method: 'get',
})

byReviewer.definition = {
    methods: ["get","head"],
    url: '/reports/performance-reviews/by-reviewer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
byReviewer.url = (options?: RouteQueryOptions) => {
    return byReviewer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
byReviewer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byReviewer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
byReviewer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byReviewer.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
    const byReviewerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byReviewer.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
        byReviewerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byReviewer.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byReviewer
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:27
 * @route '/reports/performance-reviews/by-reviewer'
 */
        byReviewerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byReviewer.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byReviewer.form = byReviewerForm
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
export const byRating = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byRating.url(options),
    method: 'get',
})

byRating.definition = {
    methods: ["get","head"],
    url: '/reports/performance-reviews/by-rating',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
byRating.url = (options?: RouteQueryOptions) => {
    return byRating.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
byRating.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byRating.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
byRating.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byRating.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
    const byRatingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byRating.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
        byRatingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byRating.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:32
 * @route '/reports/performance-reviews/by-rating'
 */
        byRatingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byRating.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byRating.form = byRatingForm
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
export const overdue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})

overdue.definition = {
    methods: ["get","head"],
    url: '/reports/performance-reviews/overdue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
overdue.url = (options?: RouteQueryOptions) => {
    return overdue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
overdue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
overdue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overdue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
    const overdueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overdue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
        overdueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceReviewReportController::overdue
 * @see app/Http/Controllers/Reports/PerformanceReviewReportController.php:37
 * @route '/reports/performance-reviews/overdue'
 */
        overdueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    overdue.form = overdueForm
const PerformanceReviewReportController = { register, byStatus, byCycle, byReviewer, byRating, overdue }

export default PerformanceReviewReportController