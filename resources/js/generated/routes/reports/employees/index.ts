import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
export const masterList = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: masterList.url(options),
    method: 'get',
})

masterList.definition = {
    methods: ["get","head"],
    url: '/reports/employees/master-list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
masterList.url = (options?: RouteQueryOptions) => {
    return masterList.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
masterList.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: masterList.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
masterList.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: masterList.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
    const masterListForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: masterList.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
        masterListForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: masterList.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::masterList
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:11
 * @route '/reports/employees/master-list'
 */
        masterListForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: masterList.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    masterList.form = masterListForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
export const activeInactive = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activeInactive.url(options),
    method: 'get',
})

activeInactive.definition = {
    methods: ["get","head"],
    url: '/reports/employees/active-inactive',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
activeInactive.url = (options?: RouteQueryOptions) => {
    return activeInactive.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
activeInactive.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: activeInactive.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
activeInactive.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: activeInactive.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
    const activeInactiveForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: activeInactive.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
        activeInactiveForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activeInactive.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::activeInactive
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:20
 * @route '/reports/employees/active-inactive'
 */
        activeInactiveForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: activeInactive.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    activeInactive.form = activeInactiveForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
export const headcountByDepartment = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByDepartment.url(options),
    method: 'get',
})

headcountByDepartment.definition = {
    methods: ["get","head"],
    url: '/reports/employees/headcount-by-department',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
headcountByDepartment.url = (options?: RouteQueryOptions) => {
    return headcountByDepartment.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
headcountByDepartment.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByDepartment.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
headcountByDepartment.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: headcountByDepartment.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
    const headcountByDepartmentForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: headcountByDepartment.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
        headcountByDepartmentForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByDepartment.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByDepartment
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:25
 * @route '/reports/employees/headcount-by-department'
 */
        headcountByDepartmentForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByDepartment.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    headcountByDepartment.form = headcountByDepartmentForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
export const headcountByLocation = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByLocation.url(options),
    method: 'get',
})

headcountByLocation.definition = {
    methods: ["get","head"],
    url: '/reports/employees/headcount-by-location',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
headcountByLocation.url = (options?: RouteQueryOptions) => {
    return headcountByLocation.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
headcountByLocation.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByLocation.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
headcountByLocation.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: headcountByLocation.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
    const headcountByLocationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: headcountByLocation.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
        headcountByLocationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByLocation.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByLocation
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:30
 * @route '/reports/employees/headcount-by-location'
 */
        headcountByLocationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByLocation.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    headcountByLocation.form = headcountByLocationForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
export const headcountByPosition = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByPosition.url(options),
    method: 'get',
})

headcountByPosition.definition = {
    methods: ["get","head"],
    url: '/reports/employees/headcount-by-position',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
headcountByPosition.url = (options?: RouteQueryOptions) => {
    return headcountByPosition.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
headcountByPosition.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByPosition.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
headcountByPosition.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: headcountByPosition.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
    const headcountByPositionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: headcountByPosition.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
        headcountByPositionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByPosition.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByPosition
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:35
 * @route '/reports/employees/headcount-by-position'
 */
        headcountByPositionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByPosition.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    headcountByPosition.form = headcountByPositionForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
export const headcountByManager = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByManager.url(options),
    method: 'get',
})

headcountByManager.definition = {
    methods: ["get","head"],
    url: '/reports/employees/headcount-by-manager',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
headcountByManager.url = (options?: RouteQueryOptions) => {
    return headcountByManager.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
headcountByManager.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: headcountByManager.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
headcountByManager.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: headcountByManager.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
    const headcountByManagerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: headcountByManager.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
        headcountByManagerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByManager.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::headcountByManager
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:40
 * @route '/reports/employees/headcount-by-manager'
 */
        headcountByManagerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: headcountByManager.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    headcountByManager.form = headcountByManagerForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
export const newHiresByMonth = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newHiresByMonth.url(options),
    method: 'get',
})

newHiresByMonth.definition = {
    methods: ["get","head"],
    url: '/reports/employees/new-hires-by-month',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
newHiresByMonth.url = (options?: RouteQueryOptions) => {
    return newHiresByMonth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
newHiresByMonth.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: newHiresByMonth.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
newHiresByMonth.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: newHiresByMonth.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
    const newHiresByMonthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: newHiresByMonth.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
        newHiresByMonthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newHiresByMonth.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::newHiresByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:45
 * @route '/reports/employees/new-hires-by-month'
 */
        newHiresByMonthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: newHiresByMonth.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    newHiresByMonth.form = newHiresByMonthForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
export const terminationsByMonth = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terminationsByMonth.url(options),
    method: 'get',
})

terminationsByMonth.definition = {
    methods: ["get","head"],
    url: '/reports/employees/terminations-by-month',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
terminationsByMonth.url = (options?: RouteQueryOptions) => {
    return terminationsByMonth.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
terminationsByMonth.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terminationsByMonth.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
terminationsByMonth.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terminationsByMonth.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
    const terminationsByMonthForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: terminationsByMonth.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
        terminationsByMonthForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terminationsByMonth.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::terminationsByMonth
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:50
 * @route '/reports/employees/terminations-by-month'
 */
        terminationsByMonthForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: terminationsByMonth.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    terminationsByMonth.form = terminationsByMonthForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
export const tenure = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tenure.url(options),
    method: 'get',
})

tenure.definition = {
    methods: ["get","head"],
    url: '/reports/employees/tenure',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
tenure.url = (options?: RouteQueryOptions) => {
    return tenure.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
tenure.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tenure.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
tenure.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tenure.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
    const tenureForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tenure.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
        tenureForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tenure.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::tenure
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:55
 * @route '/reports/employees/tenure'
 */
        tenureForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tenure.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tenure.form = tenureForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
export const birthdays = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: birthdays.url(options),
    method: 'get',
})

birthdays.definition = {
    methods: ["get","head"],
    url: '/reports/employees/birthdays',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
birthdays.url = (options?: RouteQueryOptions) => {
    return birthdays.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
birthdays.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: birthdays.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
birthdays.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: birthdays.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
    const birthdaysForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: birthdays.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
        birthdaysForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: birthdays.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::birthdays
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:78
 * @route '/reports/employees/birthdays'
 */
        birthdaysForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: birthdays.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    birthdays.form = birthdaysForm
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
export const missingProfileFields = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingProfileFields.url(options),
    method: 'get',
})

missingProfileFields.definition = {
    methods: ["get","head"],
    url: '/reports/employees/missing-profile-fields',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
missingProfileFields.url = (options?: RouteQueryOptions) => {
    return missingProfileFields.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
missingProfileFields.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: missingProfileFields.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
missingProfileFields.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: missingProfileFields.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
    const missingProfileFieldsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: missingProfileFields.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
        missingProfileFieldsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingProfileFields.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Reports\EmployeeReportController::missingProfileFields
 * @see app/Http/Controllers/Reports/EmployeeReportController.php:103
 * @route '/reports/employees/missing-profile-fields'
 */
        missingProfileFieldsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: missingProfileFields.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    missingProfileFields.form = missingProfileFieldsForm
const employees = {
    masterList: Object.assign(masterList, masterList),
activeInactive: Object.assign(activeInactive, activeInactive),
headcountByDepartment: Object.assign(headcountByDepartment, headcountByDepartment),
headcountByLocation: Object.assign(headcountByLocation, headcountByLocation),
headcountByPosition: Object.assign(headcountByPosition, headcountByPosition),
headcountByManager: Object.assign(headcountByManager, headcountByManager),
newHiresByMonth: Object.assign(newHiresByMonth, newHiresByMonth),
terminationsByMonth: Object.assign(terminationsByMonth, terminationsByMonth),
tenure: Object.assign(tenure, tenure),
birthdays: Object.assign(birthdays, birthdays),
missingProfileFields: Object.assign(missingProfileFields, missingProfileFields),
}

export default employees