import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
export const scorecardRegister = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scorecardRegister.url(options),
    method: 'get',
})

scorecardRegister.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
scorecardRegister.url = (options?: RouteQueryOptions) => {
    return scorecardRegister.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
scorecardRegister.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scorecardRegister.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
scorecardRegister.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scorecardRegister.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
    const scorecardRegisterForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: scorecardRegister.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
        scorecardRegisterForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scorecardRegister.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::scorecardRegister
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:12
 * @route '/reports/performance-scorecards/register'
 */
        scorecardRegisterForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: scorecardRegister.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    scorecardRegister.form = scorecardRegisterForm
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
export const byPerspective = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byPerspective.url(options),
    method: 'get',
})

byPerspective.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/by-perspective',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
byPerspective.url = (options?: RouteQueryOptions) => {
    return byPerspective.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
byPerspective.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byPerspective.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
byPerspective.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byPerspective.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
    const byPerspectiveForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byPerspective.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
        byPerspectiveForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byPerspective.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byPerspective
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:59
 * @route '/reports/performance-scorecards/by-perspective'
 */
        byPerspectiveForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byPerspective.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byPerspective.form = byPerspectiveForm
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
 */
export const byCycle = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCycle.url(options),
    method: 'get',
})

byCycle.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/by-cycle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
 */
byCycle.url = (options?: RouteQueryOptions) => {
    return byCycle.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
 */
byCycle.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCycle.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
 */
byCycle.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byCycle.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
 */
    const byCycleForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byCycle.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
 */
        byCycleForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCycle.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byCycle
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:81
 * @route '/reports/performance-scorecards/by-cycle'
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
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
 */
export const byRating = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byRating.url(options),
    method: 'get',
})

byRating.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/by-rating',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
 */
byRating.url = (options?: RouteQueryOptions) => {
    return byRating.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
 */
byRating.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byRating.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
 */
byRating.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byRating.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
 */
    const byRatingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byRating.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
 */
        byRatingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byRating.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::byRating
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:107
 * @route '/reports/performance-scorecards/by-rating'
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
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
export const pendingReviews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingReviews.url(options),
    method: 'get',
})

pendingReviews.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/pending-reviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
pendingReviews.url = (options?: RouteQueryOptions) => {
    return pendingReviews.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
pendingReviews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingReviews.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
pendingReviews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingReviews.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
    const pendingReviewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingReviews.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
        pendingReviewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingReviews.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::pendingReviews
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:127
 * @route '/reports/performance-scorecards/pending-reviews'
 */
        pendingReviewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingReviews.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendingReviews.form = pendingReviewsForm
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
export const topPerformers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: topPerformers.url(options),
    method: 'get',
})

topPerformers.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/top-performers',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
topPerformers.url = (options?: RouteQueryOptions) => {
    return topPerformers.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
topPerformers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: topPerformers.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
topPerformers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: topPerformers.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
    const topPerformersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: topPerformers.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
        topPerformersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: topPerformers.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::topPerformers
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:166
 * @route '/reports/performance-scorecards/top-performers'
 */
        topPerformersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: topPerformers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    topPerformers.form = topPerformersForm
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
export const improvementPlans = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: improvementPlans.url(options),
    method: 'get',
})

improvementPlans.definition = {
    methods: ["get","head"],
    url: '/reports/performance-scorecards/improvement-plans',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
improvementPlans.url = (options?: RouteQueryOptions) => {
    return improvementPlans.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
improvementPlans.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: improvementPlans.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
improvementPlans.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: improvementPlans.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
    const improvementPlansForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: improvementPlans.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
        improvementPlansForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: improvementPlans.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\PerformanceScorecardReportController::improvementPlans
 * @see app/Http/Controllers/Reports/PerformanceScorecardReportController.php:207
 * @route '/reports/performance-scorecards/improvement-plans'
 */
        improvementPlansForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: improvementPlans.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    improvementPlans.form = improvementPlansForm
const PerformanceScorecardReportController = { scorecardRegister, byPerspective, byCycle, byRating, pendingReviews, topPerformers, improvementPlans }

export default PerformanceScorecardReportController