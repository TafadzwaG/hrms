import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/reports/onboarding-tasks/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::register
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:10
 * @route '/reports/onboarding-tasks/register'
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
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
 */
export const byStatus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})

byStatus.definition = {
    methods: ["get","head"],
    url: '/reports/onboarding-tasks/by-status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
 */
byStatus.url = (options?: RouteQueryOptions) => {
    return byStatus.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
 */
byStatus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byStatus.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
 */
byStatus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byStatus.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
 */
    const byStatusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byStatus.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
 */
        byStatusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byStatus.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byStatus
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:17
 * @route '/reports/onboarding-tasks/by-status'
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
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
 */
export const byEmployee = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byEmployee.url(options),
    method: 'get',
})

byEmployee.definition = {
    methods: ["get","head"],
    url: '/reports/onboarding-tasks/by-employee',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
 */
byEmployee.url = (options?: RouteQueryOptions) => {
    return byEmployee.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
 */
byEmployee.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byEmployee.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
 */
byEmployee.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byEmployee.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
 */
    const byEmployeeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byEmployee.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
 */
        byEmployeeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byEmployee.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byEmployee
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:22
 * @route '/reports/onboarding-tasks/by-employee'
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
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
export const byOwner = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byOwner.url(options),
    method: 'get',
})

byOwner.definition = {
    methods: ["get","head"],
    url: '/reports/onboarding-tasks/by-owner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
byOwner.url = (options?: RouteQueryOptions) => {
    return byOwner.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
byOwner.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byOwner.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
byOwner.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byOwner.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
    const byOwnerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byOwner.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
        byOwnerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byOwner.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::byOwner
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:27
 * @route '/reports/onboarding-tasks/by-owner'
 */
        byOwnerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byOwner.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byOwner.form = byOwnerForm
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
 */
export const overdue = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})

overdue.definition = {
    methods: ["get","head"],
    url: '/reports/onboarding-tasks/overdue',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
 */
overdue.url = (options?: RouteQueryOptions) => {
    return overdue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
 */
overdue.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: overdue.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
 */
overdue.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: overdue.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
 */
    const overdueForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: overdue.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
 */
        overdueForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: overdue.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\OnboardingTaskReportController::overdue
 * @see app/Http/Controllers/Reports/OnboardingTaskReportController.php:32
 * @route '/reports/onboarding-tasks/overdue'
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
const OnboardingTaskReportController = { register, byStatus, byEmployee, byOwner, overdue }

export default OnboardingTaskReportController