import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::register
 * @see app/Http/Controllers/Reports/BenefitReportController.php:12
 * @route '/reports/benefits/register'
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
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
export const activeEnrollments = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activeEnrollments.url(options),
    method: 'get',
})

activeEnrollments.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/active-enrollments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
activeEnrollments.url = (options?: RouteQueryOptions) => {
    return activeEnrollments.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
activeEnrollments.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activeEnrollments.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
activeEnrollments.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activeEnrollments.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
    const activeEnrollmentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: activeEnrollments.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
        activeEnrollmentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activeEnrollments.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::activeEnrollments
 * @see app/Http/Controllers/Reports/BenefitReportController.php:21
 * @route '/reports/benefits/active-enrollments'
 */
        activeEnrollmentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activeEnrollments.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    activeEnrollments.form = activeEnrollmentsForm
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
export const byDepartment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDepartment.url(options),
    method: 'get',
})

byDepartment.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/by-department',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
byDepartment.url = (options?: RouteQueryOptions) => {
    return byDepartment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
byDepartment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byDepartment.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
byDepartment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byDepartment.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
    const byDepartmentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byDepartment.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
        byDepartmentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDepartment.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::byDepartment
 * @see app/Http/Controllers/Reports/BenefitReportController.php:51
 * @route '/reports/benefits/by-department'
 */
        byDepartmentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byDepartment.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byDepartment.form = byDepartmentForm
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
export const employerContributions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employerContributions.url(options),
    method: 'get',
})

employerContributions.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/employer-contributions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
employerContributions.url = (options?: RouteQueryOptions) => {
    return employerContributions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
employerContributions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employerContributions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
employerContributions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: employerContributions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
    const employerContributionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: employerContributions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
        employerContributionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employerContributions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::employerContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:77
 * @route '/reports/benefits/employer-contributions'
 */
        employerContributionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employerContributions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    employerContributions.form = employerContributionsForm
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
export const employeeContributions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employeeContributions.url(options),
    method: 'get',
})

employeeContributions.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/employee-contributions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
employeeContributions.url = (options?: RouteQueryOptions) => {
    return employeeContributions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
employeeContributions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: employeeContributions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
employeeContributions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: employeeContributions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
    const employeeContributionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: employeeContributions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
        employeeContributionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employeeContributions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::employeeContributions
 * @see app/Http/Controllers/Reports/BenefitReportController.php:104
 * @route '/reports/benefits/employee-contributions'
 */
        employeeContributionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: employeeContributions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    employeeContributions.form = employeeContributionsForm
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
export const dependants = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dependants.url(options),
    method: 'get',
})

dependants.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/dependants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
dependants.url = (options?: RouteQueryOptions) => {
    return dependants.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
dependants.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dependants.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
dependants.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dependants.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
    const dependantsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dependants.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
        dependantsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dependants.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::dependants
 * @see app/Http/Controllers/Reports/BenefitReportController.php:131
 * @route '/reports/benefits/dependants'
 */
        dependantsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dependants.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dependants.form = dependantsForm
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
export const byCost = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCost.url(options),
    method: 'get',
})

byCost.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/by-cost',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
byCost.url = (options?: RouteQueryOptions) => {
    return byCost.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
byCost.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byCost.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
byCost.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byCost.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
    const byCostForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byCost.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
        byCostForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCost.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::byCost
 * @see app/Http/Controllers/Reports/BenefitReportController.php:163
 * @route '/reports/benefits/by-cost'
 */
        byCostForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byCost.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byCost.form = byCostForm
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
export const expiredSuspended = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiredSuspended.url(options),
    method: 'get',
})

expiredSuspended.definition = {
    methods: ["get","head"],
    url: '/reports/benefits/expired-suspended',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
expiredSuspended.url = (options?: RouteQueryOptions) => {
    return expiredSuspended.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
expiredSuspended.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: expiredSuspended.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
expiredSuspended.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: expiredSuspended.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
    const expiredSuspendedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: expiredSuspended.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
        expiredSuspendedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiredSuspended.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\BenefitReportController::expiredSuspended
 * @see app/Http/Controllers/Reports/BenefitReportController.php:189
 * @route '/reports/benefits/expired-suspended'
 */
        expiredSuspendedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: expiredSuspended.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    expiredSuspended.form = expiredSuspendedForm
const BenefitReportController = { register, activeEnrollments, byDepartment, employerContributions, employeeContributions, dependants, byCost, expiredSuspended }

export default BenefitReportController