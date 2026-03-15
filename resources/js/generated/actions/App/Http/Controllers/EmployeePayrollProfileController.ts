import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/payroll/profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::index
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:21
 * @route '/payroll/profiles'
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
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/payroll/profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::store
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:133
 * @route '/payroll/profiles'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
export const update = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/payroll/profiles/{profile}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
update.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                }

    return update.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
update.put = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
    const updateForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::update
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:143
 * @route '/payroll/profiles/{profile}'
 */
        updateForm.put = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
export const destroy = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/payroll/profiles/{profile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
destroy.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                }

    return destroy.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
destroy.delete = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
    const destroyForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroy
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:152
 * @route '/payroll/profiles/{profile}'
 */
        destroyForm.delete = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
export const storeRecurringItem = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRecurringItem.url(args, options),
    method: 'post',
})

storeRecurringItem.definition = {
    methods: ["post"],
    url: '/payroll/profiles/{profile}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
storeRecurringItem.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                }

    return storeRecurringItem.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
storeRecurringItem.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeRecurringItem.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
    const storeRecurringItemForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeRecurringItem.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:168
 * @route '/payroll/profiles/{profile}/items'
 */
        storeRecurringItemForm.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeRecurringItem.url(args, options),
            method: 'post',
        })
    
    storeRecurringItem.form = storeRecurringItemForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
export const updateRecurringItem = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRecurringItem.url(args, options),
    method: 'put',
})

updateRecurringItem.definition = {
    methods: ["put"],
    url: '/payroll/profiles/{profile}/items/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
updateRecurringItem.url = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                item: args.item,
                }

    return updateRecurringItem.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
updateRecurringItem.put = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateRecurringItem.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
    const updateRecurringItemForm = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateRecurringItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:188
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
        updateRecurringItemForm.put = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateRecurringItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateRecurringItem.form = updateRecurringItemForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroyRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
export const destroyRecurringItem = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyRecurringItem.url(args, options),
    method: 'delete',
})

destroyRecurringItem.definition = {
    methods: ["delete"],
    url: '/payroll/profiles/{profile}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroyRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
destroyRecurringItem.url = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                item: args.item,
                }

    return destroyRecurringItem.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroyRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
destroyRecurringItem.delete = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyRecurringItem.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroyRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
    const destroyRecurringItemForm = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyRecurringItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroyRecurringItem
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:204
 * @route '/payroll/profiles/{profile}/items/{item}'
 */
        destroyRecurringItemForm.delete = (args: { profile: string | number, item: string | number } | [profile: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyRecurringItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyRecurringItem.form = destroyRecurringItemForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
export const storeSettlementRule = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSettlementRule.url(args, options),
    method: 'post',
})

storeSettlementRule.definition = {
    methods: ["post"],
    url: '/payroll/profiles/{profile}/settlements',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
storeSettlementRule.url = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { profile: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                }

    return storeSettlementRule.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
storeSettlementRule.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSettlementRule.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
    const storeSettlementRuleForm = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeSettlementRule.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::storeSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:220
 * @route '/payroll/profiles/{profile}/settlements'
 */
        storeSettlementRuleForm.post = (args: { profile: string | number } | [profile: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeSettlementRule.url(args, options),
            method: 'post',
        })
    
    storeSettlementRule.form = storeSettlementRuleForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
export const updateSettlementRule = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSettlementRule.url(args, options),
    method: 'put',
})

updateSettlementRule.definition = {
    methods: ["put"],
    url: '/payroll/profiles/{profile}/settlements/{settlement}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
updateSettlementRule.url = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    settlement: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                settlement: args.settlement,
                }

    return updateSettlementRule.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
updateSettlementRule.put = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSettlementRule.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
    const updateSettlementRuleForm = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSettlementRule.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::updateSettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:236
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
        updateSettlementRuleForm.put = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSettlementRule.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSettlementRule.form = updateSettlementRuleForm
/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroySettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
export const destroySettlementRule = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySettlementRule.url(args, options),
    method: 'delete',
})

destroySettlementRule.definition = {
    methods: ["delete"],
    url: '/payroll/profiles/{profile}/settlements/{settlement}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroySettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
destroySettlementRule.url = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    profile: args[0],
                    settlement: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        profile: args.profile,
                                settlement: args.settlement,
                }

    return destroySettlementRule.definition.url
            .replace('{profile}', parsedArgs.profile.toString())
            .replace('{settlement}', parsedArgs.settlement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroySettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
destroySettlementRule.delete = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySettlementRule.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroySettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
    const destroySettlementRuleForm = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroySettlementRule.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeePayrollProfileController::destroySettlementRule
 * @see app/Http/Controllers/EmployeePayrollProfileController.php:254
 * @route '/payroll/profiles/{profile}/settlements/{settlement}'
 */
        destroySettlementRuleForm.delete = (args: { profile: string | number, settlement: string | number } | [profile: string | number, settlement: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroySettlementRule.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroySettlementRule.form = destroySettlementRuleForm
const EmployeePayrollProfileController = { index, store, update, destroy, storeRecurringItem, updateRecurringItem, destroyRecurringItem, storeSettlementRule, updateSettlementRule, destroySettlementRule }

export default EmployeePayrollProfileController