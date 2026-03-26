import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/candidate/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\ProfileController::edit
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:36
 * @route '/candidate/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/candidate/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:36
 * @route '/candidate/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:36
 * @route '/candidate/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:36
 * @route '/candidate/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::update
 * @see app/Http/Controllers/Candidate/ProfileController.php:36
 * @route '/candidate/profile'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::updateSummary
 * @see app/Http/Controllers/Candidate/ProfileController.php:52
 * @route '/candidate/profile/summary'
 */
export const updateSummary = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSummary.url(options),
    method: 'put',
})

updateSummary.definition = {
    methods: ["put"],
    url: '/candidate/profile/summary',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::updateSummary
 * @see app/Http/Controllers/Candidate/ProfileController.php:52
 * @route '/candidate/profile/summary'
 */
updateSummary.url = (options?: RouteQueryOptions) => {
    return updateSummary.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::updateSummary
 * @see app/Http/Controllers/Candidate/ProfileController.php:52
 * @route '/candidate/profile/summary'
 */
updateSummary.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSummary.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::updateSummary
 * @see app/Http/Controllers/Candidate/ProfileController.php:52
 * @route '/candidate/profile/summary'
 */
    const updateSummaryForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSummary.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::updateSummary
 * @see app/Http/Controllers/Candidate/ProfileController.php:52
 * @route '/candidate/profile/summary'
 */
        updateSummaryForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSummary.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSummary.form = updateSummaryForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::storeExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:65
 * @route '/candidate/profile/experiences'
 */
export const storeExperience = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExperience.url(options),
    method: 'post',
})

storeExperience.definition = {
    methods: ["post"],
    url: '/candidate/profile/experiences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::storeExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:65
 * @route '/candidate/profile/experiences'
 */
storeExperience.url = (options?: RouteQueryOptions) => {
    return storeExperience.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::storeExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:65
 * @route '/candidate/profile/experiences'
 */
storeExperience.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExperience.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::storeExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:65
 * @route '/candidate/profile/experiences'
 */
    const storeExperienceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeExperience.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::storeExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:65
 * @route '/candidate/profile/experiences'
 */
        storeExperienceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeExperience.url(options),
            method: 'post',
        })
    
    storeExperience.form = storeExperienceForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::updateExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:82
 * @route '/candidate/profile/experiences/{experience}'
 */
export const updateExperience = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExperience.url(args, options),
    method: 'put',
})

updateExperience.definition = {
    methods: ["put"],
    url: '/candidate/profile/experiences/{experience}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::updateExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:82
 * @route '/candidate/profile/experiences/{experience}'
 */
updateExperience.url = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experience: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experience: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experience: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experience: typeof args.experience === 'object'
                ? args.experience.id
                : args.experience,
                }

    return updateExperience.definition.url
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::updateExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:82
 * @route '/candidate/profile/experiences/{experience}'
 */
updateExperience.put = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExperience.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::updateExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:82
 * @route '/candidate/profile/experiences/{experience}'
 */
    const updateExperienceForm = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateExperience.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::updateExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:82
 * @route '/candidate/profile/experiences/{experience}'
 */
        updateExperienceForm.put = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateExperience.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateExperience.form = updateExperienceForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroyExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:101
 * @route '/candidate/profile/experiences/{experience}'
 */
export const destroyExperience = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExperience.url(args, options),
    method: 'delete',
})

destroyExperience.definition = {
    methods: ["delete"],
    url: '/candidate/profile/experiences/{experience}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroyExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:101
 * @route '/candidate/profile/experiences/{experience}'
 */
destroyExperience.url = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { experience: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { experience: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    experience: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        experience: typeof args.experience === 'object'
                ? args.experience.id
                : args.experience,
                }

    return destroyExperience.definition.url
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::destroyExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:101
 * @route '/candidate/profile/experiences/{experience}'
 */
destroyExperience.delete = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExperience.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::destroyExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:101
 * @route '/candidate/profile/experiences/{experience}'
 */
    const destroyExperienceForm = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyExperience.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::destroyExperience
 * @see app/Http/Controllers/Candidate/ProfileController.php:101
 * @route '/candidate/profile/experiences/{experience}'
 */
        destroyExperienceForm.delete = (args: { experience: number | { id: number } } | [experience: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyExperience.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyExperience.form = destroyExperienceForm
const ProfileController = { edit, update, updateSummary, storeExperience, updateExperience, destroyExperience }

export default ProfileController