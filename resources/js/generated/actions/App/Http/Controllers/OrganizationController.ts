import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
export const members = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: members.url(args, options),
    method: 'get',
})

members.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}/members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
members.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return members.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
members.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: members.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
members.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: members.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
    const membersForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: members.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
        membersForm.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: members.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::members
 * @see app/Http/Controllers/OrganizationController.php:221
 * @route '/organizations/{organization}/members'
 */
        membersForm.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: members.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    members.form = membersForm
/**
* @see \App\Http\Controllers\OrganizationController::storeMember
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
export const storeMember = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMember.url(args, options),
    method: 'post',
})

storeMember.definition = {
    methods: ["post"],
    url: '/organizations/{organization}/members',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::storeMember
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
storeMember.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return storeMember.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::storeMember
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
storeMember.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeMember.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::storeMember
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
    const storeMemberForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeMember.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::storeMember
 * @see app/Http/Controllers/OrganizationController.php:326
 * @route '/organizations/{organization}/members'
 */
        storeMemberForm.post = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeMember.url(args, options),
            method: 'post',
        })
    
    storeMember.form = storeMemberForm
/**
* @see \App\Http\Controllers\OrganizationController::updateMember
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
export const updateMember = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMember.url(args, options),
    method: 'put',
})

updateMember.definition = {
    methods: ["put"],
    url: '/organizations/{organization}/members/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\OrganizationController::updateMember
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
updateMember.url = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return updateMember.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::updateMember
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
updateMember.put = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateMember.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\OrganizationController::updateMember
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
    const updateMemberForm = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateMember.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::updateMember
 * @see app/Http/Controllers/OrganizationController.php:366
 * @route '/organizations/{organization}/members/{user}'
 */
        updateMemberForm.put = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateMember.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateMember.form = updateMemberForm
/**
* @see \App\Http\Controllers\OrganizationController::destroyMember
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
export const destroyMember = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMember.url(args, options),
    method: 'delete',
})

destroyMember.definition = {
    methods: ["delete"],
    url: '/organizations/{organization}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrganizationController::destroyMember
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
destroyMember.url = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                    user: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                                user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return destroyMember.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::destroyMember
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
destroyMember.delete = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyMember.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrganizationController::destroyMember
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
    const destroyMemberForm = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyMember.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::destroyMember
 * @see app/Http/Controllers/OrganizationController.php:412
 * @route '/organizations/{organization}/members/{user}'
 */
        destroyMemberForm.delete = (args: { organization: number | { id: number }, user: number | { id: number } } | [organization: number | { id: number }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyMember.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyMember.form = destroyMemberForm
/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/organizations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::index
 * @see app/Http/Controllers/OrganizationController.php:23
 * @route '/organizations'
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
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/organizations/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::create
 * @see app/Http/Controllers/OrganizationController.php:83
 * @route '/organizations/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/organizations'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/organizations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/organizations'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/organizations'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/organizations'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::store
 * @see app/Http/Controllers/OrganizationController.php:92
 * @route '/organizations'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
export const show = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
show.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return show.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
show.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
show.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
    const showForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
        showForm.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::show
 * @see app/Http/Controllers/OrganizationController.php:128
 * @route '/organizations/{organization}'
 */
        showForm.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
export const edit = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/organizations/{organization}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
edit.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return edit.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
edit.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
edit.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
    const editForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
        editForm.get = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::edit
 * @see app/Http/Controllers/OrganizationController.php:152
 * @route '/organizations/{organization}/edit'
 */
        editForm.head = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
export const update = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
update.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return update.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
update.put = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
update.patch = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
    const updateForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
        updateForm.put = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\OrganizationController::update
 * @see app/Http/Controllers/OrganizationController.php:176
 * @route '/organizations/{organization}'
 */
        updateForm.patch = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:196
 * @route '/organizations/{organization}'
 */
export const destroy = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/organizations/{organization}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:196
 * @route '/organizations/{organization}'
 */
destroy.url = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { organization: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { organization: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    organization: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        organization: typeof args.organization === 'object'
                ? args.organization.id
                : args.organization,
                }

    return destroy.definition.url
            .replace('{organization}', parsedArgs.organization.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:196
 * @route '/organizations/{organization}'
 */
destroy.delete = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:196
 * @route '/organizations/{organization}'
 */
    const destroyForm = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\OrganizationController::destroy
 * @see app/Http/Controllers/OrganizationController.php:196
 * @route '/organizations/{organization}'
 */
        destroyForm.delete = (args: { organization: number | { id: number } } | [organization: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const OrganizationController = { members, storeMember, updateMember, destroyMember, index, create, store, show, edit, update, destroy }

export default OrganizationController