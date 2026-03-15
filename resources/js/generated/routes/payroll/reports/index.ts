import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/reports',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::index
 * @see app/Http/Controllers/PayrollReportController.php:16
 * @route '/payroll/reports'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
export const register = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(args, options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/payroll/reports/runs/{run}/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
register.url = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    run: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        run: args.run,
                }

    return register.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
register.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
register.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
    const registerForm = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
        registerForm.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::register
 * @see app/Http/Controllers/PayrollReportController.php:95
 * @route '/payroll/reports/runs/{run}/register'
 */
        registerForm.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
export const earnings = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: earnings.url(args, options),
    method: 'get',
})

earnings.definition = {
    methods: ["get","head"],
    url: '/payroll/reports/runs/{run}/earnings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
earnings.url = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    run: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        run: args.run,
                }

    return earnings.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
earnings.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: earnings.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
earnings.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: earnings.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
    const earningsForm = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: earnings.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
        earningsForm.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: earnings.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::earnings
 * @see app/Http/Controllers/PayrollReportController.php:115
 * @route '/payroll/reports/runs/{run}/earnings'
 */
        earningsForm.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: earnings.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    earnings.form = earningsForm
/**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
export const deductions = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deductions.url(args, options),
    method: 'get',
})

deductions.definition = {
    methods: ["get","head"],
    url: '/payroll/reports/runs/{run}/deductions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
deductions.url = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    run: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        run: args.run,
                }

    return deductions.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
deductions.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: deductions.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
deductions.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: deductions.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
    const deductionsForm = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: deductions.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
        deductionsForm.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: deductions.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::deductions
 * @see app/Http/Controllers/PayrollReportController.php:139
 * @route '/payroll/reports/runs/{run}/deductions'
 */
        deductionsForm.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: deductions.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    deductions.form = deductionsForm
/**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
export const statutory = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statutory.url(args, options),
    method: 'get',
})

statutory.definition = {
    methods: ["get","head"],
    url: '/payroll/reports/runs/{run}/statutory',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
statutory.url = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    run: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        run: args.run,
                }

    return statutory.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
statutory.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: statutory.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
statutory.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: statutory.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
    const statutoryForm = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: statutory.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
        statutoryForm.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statutory.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::statutory
 * @see app/Http/Controllers/PayrollReportController.php:163
 * @route '/payroll/reports/runs/{run}/statutory'
 */
        statutoryForm.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: statutory.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    statutory.form = statutoryForm
/**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
export const bank = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bank.url(args, options),
    method: 'get',
})

bank.definition = {
    methods: ["get","head"],
    url: '/payroll/reports/runs/{run}/bank',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
bank.url = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    run: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        run: args.run,
                }

    return bank.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
bank.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bank.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
bank.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bank.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
    const bankForm = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bank.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
        bankForm.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bank.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::bank
 * @see app/Http/Controllers/PayrollReportController.php:182
 * @route '/payroll/reports/runs/{run}/bank'
 */
        bankForm.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bank.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bank.form = bankForm
/**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
export const journal = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: journal.url(args, options),
    method: 'get',
})

journal.definition = {
    methods: ["get","head"],
    url: '/payroll/reports/runs/{run}/journal',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
journal.url = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { run: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    run: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        run: args.run,
                }

    return journal.definition.url
            .replace('{run}', parsedArgs.run.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
journal.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: journal.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
journal.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: journal.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
    const journalForm = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: journal.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
        journalForm.get = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: journal.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PayrollReportController::journal
 * @see app/Http/Controllers/PayrollReportController.php:215
 * @route '/payroll/reports/runs/{run}/journal'
 */
        journalForm.head = (args: { run: string | number } | [run: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: journal.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    journal.form = journalForm
const reports = {
    index: Object.assign(index, index),
register: Object.assign(register, register),
earnings: Object.assign(earnings, earnings),
deductions: Object.assign(deductions, deductions),
statutory: Object.assign(statutory, statutory),
bank: Object.assign(bank, bank),
journal: Object.assign(journal, journal),
}

export default reports