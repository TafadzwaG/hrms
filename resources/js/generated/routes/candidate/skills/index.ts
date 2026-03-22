import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\SkillsController::store
 * @see app/Http/Controllers/Candidate/SkillsController.php:34
 * @route '/candidate/skills'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate/skills',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\SkillsController::store
 * @see app/Http/Controllers/Candidate/SkillsController.php:34
 * @route '/candidate/skills'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SkillsController::store
 * @see app/Http/Controllers/Candidate/SkillsController.php:34
 * @route '/candidate/skills'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\SkillsController::store
 * @see app/Http/Controllers/Candidate/SkillsController.php:34
 * @route '/candidate/skills'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\SkillsController::store
 * @see app/Http/Controllers/Candidate/SkillsController.php:34
 * @route '/candidate/skills'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Candidate\SkillsController::update
 * @see app/Http/Controllers/Candidate/SkillsController.php:47
 * @route '/candidate/skills/{skill}'
 */
export const update = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/skills/{skill}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\SkillsController::update
 * @see app/Http/Controllers/Candidate/SkillsController.php:47
 * @route '/candidate/skills/{skill}'
 */
update.url = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { skill: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { skill: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    skill: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        skill: typeof args.skill === 'object'
                ? args.skill.id
                : args.skill,
                }

    return update.definition.url
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SkillsController::update
 * @see app/Http/Controllers/Candidate/SkillsController.php:47
 * @route '/candidate/skills/{skill}'
 */
update.put = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\SkillsController::update
 * @see app/Http/Controllers/Candidate/SkillsController.php:47
 * @route '/candidate/skills/{skill}'
 */
    const updateForm = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\SkillsController::update
 * @see app/Http/Controllers/Candidate/SkillsController.php:47
 * @route '/candidate/skills/{skill}'
 */
        updateForm.put = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Candidate\SkillsController::destroy
 * @see app/Http/Controllers/Candidate/SkillsController.php:62
 * @route '/candidate/skills/{skill}'
 */
export const destroy = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate/skills/{skill}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Candidate\SkillsController::destroy
 * @see app/Http/Controllers/Candidate/SkillsController.php:62
 * @route '/candidate/skills/{skill}'
 */
destroy.url = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { skill: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { skill: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    skill: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        skill: typeof args.skill === 'object'
                ? args.skill.id
                : args.skill,
                }

    return destroy.definition.url
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SkillsController::destroy
 * @see app/Http/Controllers/Candidate/SkillsController.php:62
 * @route '/candidate/skills/{skill}'
 */
destroy.delete = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Candidate\SkillsController::destroy
 * @see app/Http/Controllers/Candidate/SkillsController.php:62
 * @route '/candidate/skills/{skill}'
 */
    const destroyForm = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\SkillsController::destroy
 * @see app/Http/Controllers/Candidate/SkillsController.php:62
 * @route '/candidate/skills/{skill}'
 */
        destroyForm.delete = (args: { skill: number | { id: number } } | [skill: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const skills = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default skills