import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BenefitContributionRuleController::store
 * @see app/Http/Controllers/BenefitContributionRuleController.php:13
 * @route '/benefits/{benefit}/contribution-rules'
 */
export const store = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/benefits/{benefit}/contribution-rules',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BenefitContributionRuleController::store
 * @see app/Http/Controllers/BenefitContributionRuleController.php:13
 * @route '/benefits/{benefit}/contribution-rules'
 */
store.url = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { benefit: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                }

    return store.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitContributionRuleController::store
 * @see app/Http/Controllers/BenefitContributionRuleController.php:13
 * @route '/benefits/{benefit}/contribution-rules'
 */
store.post = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BenefitContributionRuleController::store
 * @see app/Http/Controllers/BenefitContributionRuleController.php:13
 * @route '/benefits/{benefit}/contribution-rules'
 */
    const storeForm = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitContributionRuleController::store
 * @see app/Http/Controllers/BenefitContributionRuleController.php:13
 * @route '/benefits/{benefit}/contribution-rules'
 */
        storeForm.post = (args: { benefit: string | number } | [benefit: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BenefitContributionRuleController::update
 * @see app/Http/Controllers/BenefitContributionRuleController.php:25
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
export const update = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/benefits/{benefit}/contribution-rules/{rule}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BenefitContributionRuleController::update
 * @see app/Http/Controllers/BenefitContributionRuleController.php:25
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
update.url = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                    rule: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                                rule: args.rule,
                }

    return update.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace('{rule}', parsedArgs.rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitContributionRuleController::update
 * @see app/Http/Controllers/BenefitContributionRuleController.php:25
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
update.put = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\BenefitContributionRuleController::update
 * @see app/Http/Controllers/BenefitContributionRuleController.php:25
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
    const updateForm = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitContributionRuleController::update
 * @see app/Http/Controllers/BenefitContributionRuleController.php:25
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
        updateForm.put = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BenefitContributionRuleController::destroy
 * @see app/Http/Controllers/BenefitContributionRuleController.php:36
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
export const destroy = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/benefits/{benefit}/contribution-rules/{rule}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BenefitContributionRuleController::destroy
 * @see app/Http/Controllers/BenefitContributionRuleController.php:36
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
destroy.url = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    benefit: args[0],
                    rule: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        benefit: args.benefit,
                                rule: args.rule,
                }

    return destroy.definition.url
            .replace('{benefit}', parsedArgs.benefit.toString())
            .replace('{rule}', parsedArgs.rule.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BenefitContributionRuleController::destroy
 * @see app/Http/Controllers/BenefitContributionRuleController.php:36
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
destroy.delete = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BenefitContributionRuleController::destroy
 * @see app/Http/Controllers/BenefitContributionRuleController.php:36
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
    const destroyForm = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BenefitContributionRuleController::destroy
 * @see app/Http/Controllers/BenefitContributionRuleController.php:36
 * @route '/benefits/{benefit}/contribution-rules/{rule}'
 */
        destroyForm.delete = (args: { benefit: string | number, rule: string | number } | [benefit: string | number, rule: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const BenefitContributionRuleController = { store, update, destroy }

export default BenefitContributionRuleController