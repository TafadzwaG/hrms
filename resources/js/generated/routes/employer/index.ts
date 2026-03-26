import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import vacancies from './vacancies'
import candidatesC822a9 from './candidates'
import company890735 from './company'
import billingFfcdcb from './billing'
import interviews9b91d6 from './interviews'
import loginDf2c2a from './login'
import register702019 from './register'
/**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/employer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\DashboardController::__invoke
 * @see app/Http/Controllers/Employer/DashboardController.php:13
 * @route '/employer/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
export const candidates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidates.url(options),
    method: 'get',
})

candidates.definition = {
    methods: ["get","head"],
    url: '/employer/candidates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
candidates.url = (options?: RouteQueryOptions) => {
    return candidates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
candidates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: candidates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
candidates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: candidates.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
    const candidatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: candidates.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
        candidatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidates.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CandidatesController::candidates
 * @see app/Http/Controllers/Employer/CandidatesController.php:17
 * @route '/employer/candidates'
 */
        candidatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: candidates.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    candidates.form = candidatesForm
/**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
export const reports = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})

reports.definition = {
    methods: ["get","head"],
    url: '/employer/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
reports.url = (options?: RouteQueryOptions) => {
    return reports.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
reports.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reports.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
reports.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reports.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
    const reportsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reports.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
        reportsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\ReportsController::reports
 * @see app/Http/Controllers/Employer/ReportsController.php:14
 * @route '/employer/reports'
 */
        reportsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reports.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reports.form = reportsForm
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
export const company = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: company.url(options),
    method: 'get',
})

company.definition = {
    methods: ["get","head"],
    url: '/employer/company',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
company.url = (options?: RouteQueryOptions) => {
    return company.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
company.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: company.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
company.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: company.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
    const companyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: company.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
        companyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: company.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\CompanyProfileController::company
 * @see app/Http/Controllers/Employer/CompanyProfileController.php:16
 * @route '/employer/company'
 */
        companyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: company.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    company.form = companyForm
/**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
export const billing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})

billing.definition = {
    methods: ["get","head"],
    url: '/employer/billing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
billing.url = (options?: RouteQueryOptions) => {
    return billing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
billing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: billing.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
billing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: billing.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
    const billingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: billing.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
        billingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: billing.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\BillingController::billing
 * @see app/Http/Controllers/Employer/BillingController.php:17
 * @route '/employer/billing'
 */
        billingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: billing.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    billing.form = billingForm
/**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
export const interviews = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: interviews.url(options),
    method: 'get',
})

interviews.definition = {
    methods: ["get","head"],
    url: '/employer/interviews',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
interviews.url = (options?: RouteQueryOptions) => {
    return interviews.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
interviews.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: interviews.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
interviews.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: interviews.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
    const interviewsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: interviews.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
        interviewsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: interviews.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Employer\InterviewsController::interviews
 * @see app/Http/Controllers/Employer/InterviewsController.php:18
 * @route '/employer/interviews'
 */
        interviewsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: interviews.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    interviews.form = interviewsForm
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/employer/login',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: login.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: login.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: login.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
login.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: login.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        loginForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/employer/register',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: register.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: register.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: register.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
register.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: register.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
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
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        registerForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        registerForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        registerForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        registerForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
const employer = {
    dashboard: Object.assign(dashboard, dashboard),
vacancies: Object.assign(vacancies, vacancies),
candidates: Object.assign(candidates, candidatesC822a9),
reports: Object.assign(reports, reports),
company: Object.assign(company, company890735),
billing: Object.assign(billing, billingFfcdcb),
interviews: Object.assign(interviews, interviews9b91d6),
login: Object.assign(login, loginDf2c2a),
register: Object.assign(register, register702019),
}

export default employer