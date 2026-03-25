import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
const RedirectControllere16df71af2350cd877b0048cac145c3e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'get',
})

RedirectControllere16df71af2350cd877b0048cac145c3e.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/candidate/login',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.url = (options?: RouteQueryOptions) => {
    return RedirectControllere16df71af2350cd877b0048cac145c3e.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
RedirectControllere16df71af2350cd877b0048cac145c3e.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
    const RedirectControllere16df71af2350cd877b0048cac145c3eForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url({
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
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url({
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
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url({
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
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url({
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
 * @route '/candidate/login'
 */
        RedirectControllere16df71af2350cd877b0048cac145c3eForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllere16df71af2350cd877b0048cac145c3e.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectControllere16df71af2350cd877b0048cac145c3e.form = RedirectControllere16df71af2350cd877b0048cac145c3eForm
    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
const RedirectControllerac561c5215e752dcc511435c71596741 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'get',
})

RedirectControllerac561c5215e752dcc511435c71596741.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/employer/login',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.url = (options?: RouteQueryOptions) => {
    return RedirectControllerac561c5215e752dcc511435c71596741.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
RedirectControllerac561c5215e752dcc511435c71596741.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
    const RedirectControllerac561c5215e752dcc511435c71596741Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        RedirectControllerac561c5215e752dcc511435c71596741Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        RedirectControllerac561c5215e752dcc511435c71596741Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url({
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
        RedirectControllerac561c5215e752dcc511435c71596741Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/login'
 */
        RedirectControllerac561c5215e752dcc511435c71596741Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url({
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
        RedirectControllerac561c5215e752dcc511435c71596741Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url({
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
        RedirectControllerac561c5215e752dcc511435c71596741Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url({
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
        RedirectControllerac561c5215e752dcc511435c71596741Form.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectControllerac561c5215e752dcc511435c71596741.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectControllerac561c5215e752dcc511435c71596741.form = RedirectControllerac561c5215e752dcc511435c71596741Form
    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
const RedirectController1f597c23df26e24199d158bcc9fdb982 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'get',
})

RedirectController1f597c23df26e24199d158bcc9fdb982.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/candidate/register',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.url = (options?: RouteQueryOptions) => {
    return RedirectController1f597c23df26e24199d158bcc9fdb982.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
RedirectController1f597c23df26e24199d158bcc9fdb982.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
    const RedirectController1f597c23df26e24199d158bcc9fdb982Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url({
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
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url({
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
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url({
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
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url({
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
 * @route '/candidate/register'
 */
        RedirectController1f597c23df26e24199d158bcc9fdb982Form.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController1f597c23df26e24199d158bcc9fdb982.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectController1f597c23df26e24199d158bcc9fdb982.form = RedirectController1f597c23df26e24199d158bcc9fdb982Form
    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
const RedirectController74a4773be0b9c53b104aabbe135d020d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'get',
})

RedirectController74a4773be0b9c53b104aabbe135d020d.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/employer/register',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.url = (options?: RouteQueryOptions) => {
    return RedirectController74a4773be0b9c53b104aabbe135d020d.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
RedirectController74a4773be0b9c53b104aabbe135d020d.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
    const RedirectController74a4773be0b9c53b104aabbe135d020dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url({
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
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/employer/register'
 */
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url({
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
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url({
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
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url({
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
        RedirectController74a4773be0b9c53b104aabbe135d020dForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController74a4773be0b9c53b104aabbe135d020d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectController74a4773be0b9c53b104aabbe135d020d.form = RedirectController74a4773be0b9c53b104aabbe135d020dForm
    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
const RedirectController4b87d2df7e3aa853f6720faea796e36c = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'get',
})

RedirectController4b87d2df7e3aa853f6720faea796e36c.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/settings',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.url = (options?: RouteQueryOptions) => {
    return RedirectController4b87d2df7e3aa853f6720faea796e36c.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
RedirectController4b87d2df7e3aa853f6720faea796e36c.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
    const RedirectController4b87d2df7e3aa853f6720faea796e36cForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url({
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
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url({
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
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url({
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
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url({
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
 * @route '/settings'
 */
        RedirectController4b87d2df7e3aa853f6720faea796e36cForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: RedirectController4b87d2df7e3aa853f6720faea796e36c.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    RedirectController4b87d2df7e3aa853f6720faea796e36c.form = RedirectController4b87d2df7e3aa853f6720faea796e36cForm

const RedirectController = {
    '/candidate/login': RedirectControllere16df71af2350cd877b0048cac145c3e,
    '/employer/login': RedirectControllerac561c5215e752dcc511435c71596741,
    '/candidate/register': RedirectController1f597c23df26e24199d158bcc9fdb982,
    '/employer/register': RedirectController74a4773be0b9c53b104aabbe135d020d,
    '/settings': RedirectController4b87d2df7e3aa853f6720faea796e36c,
}

export default RedirectController