import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
export const candidateListings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidateListings.url(options),
    method: 'get',
})

candidateListings.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/candidate-listings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
candidateListings.url = (options?: RouteQueryOptions) => {
    return candidateListings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
candidateListings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidateListings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
candidateListings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: candidateListings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
    const candidateListingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: candidateListings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
        candidateListingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidateListings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidateListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:14
 * @route '/reports/recruitment/candidate-listings'
 */
        candidateListingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidateListings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    candidateListings.form = candidateListingsForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
export const vacanciesByCompany = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacanciesByCompany.url(options),
    method: 'get',
})

vacanciesByCompany.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/vacancies-by-company',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
vacanciesByCompany.url = (options?: RouteQueryOptions) => {
    return vacanciesByCompany.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
vacanciesByCompany.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vacanciesByCompany.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
vacanciesByCompany.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vacanciesByCompany.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
    const vacanciesByCompanyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vacanciesByCompany.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
        vacanciesByCompanyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vacanciesByCompany.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::vacanciesByCompany
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:42
 * @route '/reports/recruitment/vacancies-by-company'
 */
        vacanciesByCompanyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vacanciesByCompany.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vacanciesByCompany.form = vacanciesByCompanyForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
export const applicationsByVacancy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applicationsByVacancy.url(options),
    method: 'get',
})

applicationsByVacancy.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/applications-by-vacancy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
applicationsByVacancy.url = (options?: RouteQueryOptions) => {
    return applicationsByVacancy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
applicationsByVacancy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applicationsByVacancy.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
applicationsByVacancy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applicationsByVacancy.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
    const applicationsByVacancyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applicationsByVacancy.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
        applicationsByVacancyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applicationsByVacancy.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::applicationsByVacancy
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:70
 * @route '/reports/recruitment/applications-by-vacancy'
 */
        applicationsByVacancyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applicationsByVacancy.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    applicationsByVacancy.form = applicationsByVacancyForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
export const paymentSummary = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentSummary.url(options),
    method: 'get',
})

paymentSummary.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/payment-summary',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
paymentSummary.url = (options?: RouteQueryOptions) => {
    return paymentSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
paymentSummary.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paymentSummary.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
paymentSummary.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paymentSummary.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
    const paymentSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paymentSummary.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
        paymentSummaryForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentSummary.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::paymentSummary
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:99
 * @route '/reports/recruitment/payment-summary'
 */
        paymentSummaryForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paymentSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paymentSummary.form = paymentSummaryForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
export const listingRevenue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listingRevenue.url(options),
    method: 'get',
})

listingRevenue.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/listing-revenue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
listingRevenue.url = (options?: RouteQueryOptions) => {
    return listingRevenue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
listingRevenue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listingRevenue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
listingRevenue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listingRevenue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
    const listingRevenueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listingRevenue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
        listingRevenueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listingRevenue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::listingRevenue
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:127
 * @route '/reports/recruitment/listing-revenue'
 */
        listingRevenueForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listingRevenue.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listingRevenue.form = listingRevenueForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
export const employerActivity = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employerActivity.url(options),
    method: 'get',
})

employerActivity.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/employer-activity',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
employerActivity.url = (options?: RouteQueryOptions) => {
    return employerActivity.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
employerActivity.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employerActivity.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
employerActivity.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: employerActivity.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
    const employerActivityForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: employerActivity.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
        employerActivityForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employerActivity.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::employerActivity
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:149
 * @route '/reports/recruitment/employer-activity'
 */
        employerActivityForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employerActivity.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    employerActivity.form = employerActivityForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
export const candidatesByProfession = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidatesByProfession.url(options),
    method: 'get',
})

candidatesByProfession.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/candidates-by-profession',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
candidatesByProfession.url = (options?: RouteQueryOptions) => {
    return candidatesByProfession.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
candidatesByProfession.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidatesByProfession.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
candidatesByProfession.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: candidatesByProfession.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
    const candidatesByProfessionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: candidatesByProfession.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
        candidatesByProfessionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidatesByProfession.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::candidatesByProfession
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:175
 * @route '/reports/recruitment/candidates-by-profession'
 */
        candidatesByProfessionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidatesByProfession.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    candidatesByProfession.form = candidatesByProfessionForm
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
export const pendingListings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingListings.url(options),
    method: 'get',
})

pendingListings.definition = {
    methods: ["get","head"],
    url: '/reports/recruitment/pending-listings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
pendingListings.url = (options?: RouteQueryOptions) => {
    return pendingListings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
pendingListings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendingListings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
pendingListings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendingListings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
    const pendingListingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pendingListings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
        pendingListingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingListings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\RecruitmentReportController::pendingListings
 * @see app/Http/Controllers/Reports/RecruitmentReportController.php:197
 * @route '/reports/recruitment/pending-listings'
 */
        pendingListingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pendingListings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pendingListings.form = pendingListingsForm
const recruitment = {
    candidateListings: Object.assign(candidateListings, candidateListings),
vacanciesByCompany: Object.assign(vacanciesByCompany, vacanciesByCompany),
applicationsByVacancy: Object.assign(applicationsByVacancy, applicationsByVacancy),
paymentSummary: Object.assign(paymentSummary, paymentSummary),
listingRevenue: Object.assign(listingRevenue, listingRevenue),
employerActivity: Object.assign(employerActivity, employerActivity),
candidatesByProfession: Object.assign(candidatesByProfession, candidatesByProfession),
pendingListings: Object.assign(pendingListings, pendingListings),
}

export default recruitment