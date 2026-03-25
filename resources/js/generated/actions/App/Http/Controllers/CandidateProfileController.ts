import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
export const createForRequisition = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createForRequisition.url(args, options),
    method: 'get',
})

createForRequisition.definition = {
    methods: ["get","head"],
    url: '/job-requisitions/{jobRequisition}/candidates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
createForRequisition.url = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { jobRequisition: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    jobRequisition: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        jobRequisition: args.jobRequisition,
                }

    return createForRequisition.definition.url
            .replace('{jobRequisition}', parsedArgs.jobRequisition.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
createForRequisition.get = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createForRequisition.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
createForRequisition.head = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createForRequisition.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
    const createForRequisitionForm = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createForRequisition.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
        createForRequisitionForm.get = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createForRequisition.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::createForRequisition
 * @see app/Http/Controllers/CandidateProfileController.php:0
 * @route '/job-requisitions/{jobRequisition}/candidates/create'
 */
        createForRequisitionForm.head = (args: { jobRequisition: string | number } | [jobRequisition: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createForRequisition.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createForRequisition.form = createForRequisitionForm
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
const index08f5d6e925bb68db325924c899e72549 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index08f5d6e925bb68db325924c899e72549.url(options),
    method: 'get',
})

index08f5d6e925bb68db325924c899e72549.definition = {
    methods: ["get","head"],
    url: '/candidates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
index08f5d6e925bb68db325924c899e72549.url = (options?: RouteQueryOptions) => {
    return index08f5d6e925bb68db325924c899e72549.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
index08f5d6e925bb68db325924c899e72549.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index08f5d6e925bb68db325924c899e72549.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
index08f5d6e925bb68db325924c899e72549.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index08f5d6e925bb68db325924c899e72549.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
    const index08f5d6e925bb68db325924c899e72549Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index08f5d6e925bb68db325924c899e72549.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
        index08f5d6e925bb68db325924c899e72549Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index08f5d6e925bb68db325924c899e72549.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidates'
 */
        index08f5d6e925bb68db325924c899e72549Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index08f5d6e925bb68db325924c899e72549.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index08f5d6e925bb68db325924c899e72549.form = index08f5d6e925bb68db325924c899e72549Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
const index006294c53cf64ef43d33a0127d95ce96 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index006294c53cf64ef43d33a0127d95ce96.url(options),
    method: 'get',
})

index006294c53cf64ef43d33a0127d95ce96.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
index006294c53cf64ef43d33a0127d95ce96.url = (options?: RouteQueryOptions) => {
    return index006294c53cf64ef43d33a0127d95ce96.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
index006294c53cf64ef43d33a0127d95ce96.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index006294c53cf64ef43d33a0127d95ce96.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
index006294c53cf64ef43d33a0127d95ce96.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index006294c53cf64ef43d33a0127d95ce96.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
    const index006294c53cf64ef43d33a0127d95ce96Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index006294c53cf64ef43d33a0127d95ce96.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
        index006294c53cf64ef43d33a0127d95ce96Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index006294c53cf64ef43d33a0127d95ce96.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::index
 * @see app/Http/Controllers/CandidateProfileController.php:19
 * @route '/candidate-profiles'
 */
        index006294c53cf64ef43d33a0127d95ce96Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index006294c53cf64ef43d33a0127d95ce96.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index006294c53cf64ef43d33a0127d95ce96.form = index006294c53cf64ef43d33a0127d95ce96Form

export const index = {
    '/candidates': index08f5d6e925bb68db325924c899e72549,
    '/candidate-profiles': index006294c53cf64ef43d33a0127d95ce96,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
const createcf9895392071aefa3d1a94ebc3d9d092 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createcf9895392071aefa3d1a94ebc3d9d092.url(options),
    method: 'get',
})

createcf9895392071aefa3d1a94ebc3d9d092.definition = {
    methods: ["get","head"],
    url: '/candidates/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
createcf9895392071aefa3d1a94ebc3d9d092.url = (options?: RouteQueryOptions) => {
    return createcf9895392071aefa3d1a94ebc3d9d092.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
createcf9895392071aefa3d1a94ebc3d9d092.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createcf9895392071aefa3d1a94ebc3d9d092.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
createcf9895392071aefa3d1a94ebc3d9d092.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createcf9895392071aefa3d1a94ebc3d9d092.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
    const createcf9895392071aefa3d1a94ebc3d9d092Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createcf9895392071aefa3d1a94ebc3d9d092.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
        createcf9895392071aefa3d1a94ebc3d9d092Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createcf9895392071aefa3d1a94ebc3d9d092.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidates/create'
 */
        createcf9895392071aefa3d1a94ebc3d9d092Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createcf9895392071aefa3d1a94ebc3d9d092.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createcf9895392071aefa3d1a94ebc3d9d092.form = createcf9895392071aefa3d1a94ebc3d9d092Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
const createad6b405c03869c5965b3f64426fb61be = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createad6b405c03869c5965b3f64426fb61be.url(options),
    method: 'get',
})

createad6b405c03869c5965b3f64426fb61be.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
createad6b405c03869c5965b3f64426fb61be.url = (options?: RouteQueryOptions) => {
    return createad6b405c03869c5965b3f64426fb61be.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
createad6b405c03869c5965b3f64426fb61be.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createad6b405c03869c5965b3f64426fb61be.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
createad6b405c03869c5965b3f64426fb61be.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createad6b405c03869c5965b3f64426fb61be.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
    const createad6b405c03869c5965b3f64426fb61beForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createad6b405c03869c5965b3f64426fb61be.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
        createad6b405c03869c5965b3f64426fb61beForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createad6b405c03869c5965b3f64426fb61be.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::create
 * @see app/Http/Controllers/CandidateProfileController.php:108
 * @route '/candidate-profiles/create'
 */
        createad6b405c03869c5965b3f64426fb61beForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createad6b405c03869c5965b3f64426fb61be.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createad6b405c03869c5965b3f64426fb61be.form = createad6b405c03869c5965b3f64426fb61beForm

export const create = {
    '/candidates/create': createcf9895392071aefa3d1a94ebc3d9d092,
    '/candidate-profiles/create': createad6b405c03869c5965b3f64426fb61be,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidates'
 */
const store08f5d6e925bb68db325924c899e72549 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store08f5d6e925bb68db325924c899e72549.url(options),
    method: 'post',
})

store08f5d6e925bb68db325924c899e72549.definition = {
    methods: ["post"],
    url: '/candidates',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidates'
 */
store08f5d6e925bb68db325924c899e72549.url = (options?: RouteQueryOptions) => {
    return store08f5d6e925bb68db325924c899e72549.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidates'
 */
store08f5d6e925bb68db325924c899e72549.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store08f5d6e925bb68db325924c899e72549.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidates'
 */
    const store08f5d6e925bb68db325924c899e72549Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store08f5d6e925bb68db325924c899e72549.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidates'
 */
        store08f5d6e925bb68db325924c899e72549Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store08f5d6e925bb68db325924c899e72549.url(options),
            method: 'post',
        })
    
    store08f5d6e925bb68db325924c899e72549.form = store08f5d6e925bb68db325924c899e72549Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidate-profiles'
 */
const store006294c53cf64ef43d33a0127d95ce96 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store006294c53cf64ef43d33a0127d95ce96.url(options),
    method: 'post',
})

store006294c53cf64ef43d33a0127d95ce96.definition = {
    methods: ["post"],
    url: '/candidate-profiles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidate-profiles'
 */
store006294c53cf64ef43d33a0127d95ce96.url = (options?: RouteQueryOptions) => {
    return store006294c53cf64ef43d33a0127d95ce96.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidate-profiles'
 */
store006294c53cf64ef43d33a0127d95ce96.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store006294c53cf64ef43d33a0127d95ce96.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidate-profiles'
 */
    const store006294c53cf64ef43d33a0127d95ce96Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store006294c53cf64ef43d33a0127d95ce96.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::store
 * @see app/Http/Controllers/CandidateProfileController.php:115
 * @route '/candidate-profiles'
 */
        store006294c53cf64ef43d33a0127d95ce96Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store006294c53cf64ef43d33a0127d95ce96.url(options),
            method: 'post',
        })
    
    store006294c53cf64ef43d33a0127d95ce96.form = store006294c53cf64ef43d33a0127d95ce96Form

export const store = {
    '/candidates': store08f5d6e925bb68db325924c899e72549,
    '/candidate-profiles': store006294c53cf64ef43d33a0127d95ce96,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
const showff89b22c476064d42cdb07e8286271a8 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'get',
})

showff89b22c476064d42cdb07e8286271a8.definition = {
    methods: ["get","head"],
    url: '/candidates/{candidate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
showff89b22c476064d42cdb07e8286271a8.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return showff89b22c476064d42cdb07e8286271a8.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
showff89b22c476064d42cdb07e8286271a8.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
showff89b22c476064d42cdb07e8286271a8.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
    const showff89b22c476064d42cdb07e8286271a8Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showff89b22c476064d42cdb07e8286271a8.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
        showff89b22c476064d42cdb07e8286271a8Form.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showff89b22c476064d42cdb07e8286271a8.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidates/{candidate}'
 */
        showff89b22c476064d42cdb07e8286271a8Form.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showff89b22c476064d42cdb07e8286271a8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showff89b22c476064d42cdb07e8286271a8.form = showff89b22c476064d42cdb07e8286271a8Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
const showa2a60c60f28ca16a6afb8c6072c9d536 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'get',
})

showa2a60c60f28ca16a6afb8c6072c9d536.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
showa2a60c60f28ca16a6afb8c6072c9d536.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return showa2a60c60f28ca16a6afb8c6072c9d536.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
showa2a60c60f28ca16a6afb8c6072c9d536.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showa2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
showa2a60c60f28ca16a6afb8c6072c9d536.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showa2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
    const showa2a60c60f28ca16a6afb8c6072c9d536Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showa2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
        showa2a60c60f28ca16a6afb8c6072c9d536Form.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showa2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::show
 * @see app/Http/Controllers/CandidateProfileController.php:133
 * @route '/candidate-profiles/{candidate}'
 */
        showa2a60c60f28ca16a6afb8c6072c9d536Form.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showa2a60c60f28ca16a6afb8c6072c9d536.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showa2a60c60f28ca16a6afb8c6072c9d536.form = showa2a60c60f28ca16a6afb8c6072c9d536Form

export const show = {
    '/candidates/{candidate}': showff89b22c476064d42cdb07e8286271a8,
    '/candidate-profiles/{candidate}': showa2a60c60f28ca16a6afb8c6072c9d536,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
const editf3a32e3361b1cc962203b7afe3285012 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editf3a32e3361b1cc962203b7afe3285012.url(args, options),
    method: 'get',
})

editf3a32e3361b1cc962203b7afe3285012.definition = {
    methods: ["get","head"],
    url: '/candidates/{candidate}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
editf3a32e3361b1cc962203b7afe3285012.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return editf3a32e3361b1cc962203b7afe3285012.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
editf3a32e3361b1cc962203b7afe3285012.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editf3a32e3361b1cc962203b7afe3285012.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
editf3a32e3361b1cc962203b7afe3285012.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editf3a32e3361b1cc962203b7afe3285012.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
    const editf3a32e3361b1cc962203b7afe3285012Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editf3a32e3361b1cc962203b7afe3285012.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
        editf3a32e3361b1cc962203b7afe3285012Form.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editf3a32e3361b1cc962203b7afe3285012.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidates/{candidate}/edit'
 */
        editf3a32e3361b1cc962203b7afe3285012Form.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editf3a32e3361b1cc962203b7afe3285012.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    editf3a32e3361b1cc962203b7afe3285012.form = editf3a32e3361b1cc962203b7afe3285012Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
const edit72ad3604be230afc7164ac6311e53fef = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit72ad3604be230afc7164ac6311e53fef.url(args, options),
    method: 'get',
})

edit72ad3604be230afc7164ac6311e53fef.definition = {
    methods: ["get","head"],
    url: '/candidate-profiles/{candidate}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
edit72ad3604be230afc7164ac6311e53fef.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return edit72ad3604be230afc7164ac6311e53fef.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
edit72ad3604be230afc7164ac6311e53fef.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit72ad3604be230afc7164ac6311e53fef.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
edit72ad3604be230afc7164ac6311e53fef.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit72ad3604be230afc7164ac6311e53fef.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
    const edit72ad3604be230afc7164ac6311e53fefForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit72ad3604be230afc7164ac6311e53fef.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
        edit72ad3604be230afc7164ac6311e53fefForm.get = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit72ad3604be230afc7164ac6311e53fef.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::edit
 * @see app/Http/Controllers/CandidateProfileController.php:149
 * @route '/candidate-profiles/{candidate}/edit'
 */
        edit72ad3604be230afc7164ac6311e53fefForm.head = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit72ad3604be230afc7164ac6311e53fef.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit72ad3604be230afc7164ac6311e53fef.form = edit72ad3604be230afc7164ac6311e53fefForm

export const edit = {
    '/candidates/{candidate}/edit': editf3a32e3361b1cc962203b7afe3285012,
    '/candidate-profiles/{candidate}/edit': edit72ad3604be230afc7164ac6311e53fef,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
const updateff89b22c476064d42cdb07e8286271a8 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'put',
})

updateff89b22c476064d42cdb07e8286271a8.definition = {
    methods: ["put","patch"],
    url: '/candidates/{candidate}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
updateff89b22c476064d42cdb07e8286271a8.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return updateff89b22c476064d42cdb07e8286271a8.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
updateff89b22c476064d42cdb07e8286271a8.put = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
updateff89b22c476064d42cdb07e8286271a8.patch = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
    const updateff89b22c476064d42cdb07e8286271a8Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateff89b22c476064d42cdb07e8286271a8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
        updateff89b22c476064d42cdb07e8286271a8Form.put = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateff89b22c476064d42cdb07e8286271a8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidates/{candidate}'
 */
        updateff89b22c476064d42cdb07e8286271a8Form.patch = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateff89b22c476064d42cdb07e8286271a8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateff89b22c476064d42cdb07e8286271a8.form = updateff89b22c476064d42cdb07e8286271a8Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
const updatea2a60c60f28ca16a6afb8c6072c9d536 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatea2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'put',
})

updatea2a60c60f28ca16a6afb8c6072c9d536.definition = {
    methods: ["put","patch"],
    url: '/candidate-profiles/{candidate}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
updatea2a60c60f28ca16a6afb8c6072c9d536.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return updatea2a60c60f28ca16a6afb8c6072c9d536.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
updatea2a60c60f28ca16a6afb8c6072c9d536.put = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatea2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
updatea2a60c60f28ca16a6afb8c6072c9d536.patch = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatea2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
    const updatea2a60c60f28ca16a6afb8c6072c9d536Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatea2a60c60f28ca16a6afb8c6072c9d536.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
        updatea2a60c60f28ca16a6afb8c6072c9d536Form.put = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatea2a60c60f28ca16a6afb8c6072c9d536.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CandidateProfileController::update
 * @see app/Http/Controllers/CandidateProfileController.php:157
 * @route '/candidate-profiles/{candidate}'
 */
        updatea2a60c60f28ca16a6afb8c6072c9d536Form.patch = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatea2a60c60f28ca16a6afb8c6072c9d536.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatea2a60c60f28ca16a6afb8c6072c9d536.form = updatea2a60c60f28ca16a6afb8c6072c9d536Form

export const update = {
    '/candidates/{candidate}': updateff89b22c476064d42cdb07e8286271a8,
    '/candidate-profiles/{candidate}': updatea2a60c60f28ca16a6afb8c6072c9d536,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidates/{candidate}'
 */
const destroyff89b22c476064d42cdb07e8286271a8 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'delete',
})

destroyff89b22c476064d42cdb07e8286271a8.definition = {
    methods: ["delete"],
    url: '/candidates/{candidate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidates/{candidate}'
 */
destroyff89b22c476064d42cdb07e8286271a8.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return destroyff89b22c476064d42cdb07e8286271a8.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidates/{candidate}'
 */
destroyff89b22c476064d42cdb07e8286271a8.delete = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyff89b22c476064d42cdb07e8286271a8.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidates/{candidate}'
 */
    const destroyff89b22c476064d42cdb07e8286271a8Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyff89b22c476064d42cdb07e8286271a8.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidates/{candidate}'
 */
        destroyff89b22c476064d42cdb07e8286271a8Form.delete = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyff89b22c476064d42cdb07e8286271a8.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyff89b22c476064d42cdb07e8286271a8.form = destroyff89b22c476064d42cdb07e8286271a8Form
    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidate-profiles/{candidate}'
 */
const destroya2a60c60f28ca16a6afb8c6072c9d536 = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroya2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'delete',
})

destroya2a60c60f28ca16a6afb8c6072c9d536.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidate-profiles/{candidate}'
 */
destroya2a60c60f28ca16a6afb8c6072c9d536.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return destroya2a60c60f28ca16a6afb8c6072c9d536.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidate-profiles/{candidate}'
 */
destroya2a60c60f28ca16a6afb8c6072c9d536.delete = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroya2a60c60f28ca16a6afb8c6072c9d536.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidate-profiles/{candidate}'
 */
    const destroya2a60c60f28ca16a6afb8c6072c9d536Form = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroya2a60c60f28ca16a6afb8c6072c9d536.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroy
 * @see app/Http/Controllers/CandidateProfileController.php:172
 * @route '/candidate-profiles/{candidate}'
 */
        destroya2a60c60f28ca16a6afb8c6072c9d536Form.delete = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroya2a60c60f28ca16a6afb8c6072c9d536.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroya2a60c60f28ca16a6afb8c6072c9d536.form = destroya2a60c60f28ca16a6afb8c6072c9d536Form

export const destroy = {
    '/candidates/{candidate}': destroyff89b22c476064d42cdb07e8286271a8,
    '/candidate-profiles/{candidate}': destroya2a60c60f28ca16a6afb8c6072c9d536,
}

/**
* @see \App\Http\Controllers\CandidateProfileController::storeEducation
 * @see app/Http/Controllers/CandidateProfileController.php:188
 * @route '/candidate-profiles/{candidate}/educations'
 */
export const storeEducation = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEducation.url(args, options),
    method: 'post',
})

storeEducation.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/educations',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::storeEducation
 * @see app/Http/Controllers/CandidateProfileController.php:188
 * @route '/candidate-profiles/{candidate}/educations'
 */
storeEducation.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return storeEducation.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::storeEducation
 * @see app/Http/Controllers/CandidateProfileController.php:188
 * @route '/candidate-profiles/{candidate}/educations'
 */
storeEducation.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeEducation.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::storeEducation
 * @see app/Http/Controllers/CandidateProfileController.php:188
 * @route '/candidate-profiles/{candidate}/educations'
 */
    const storeEducationForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeEducation.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::storeEducation
 * @see app/Http/Controllers/CandidateProfileController.php:188
 * @route '/candidate-profiles/{candidate}/educations'
 */
        storeEducationForm.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeEducation.url(args, options),
            method: 'post',
        })
    
    storeEducation.form = storeEducationForm
/**
* @see \App\Http\Controllers\CandidateProfileController::updateEducation
 * @see app/Http/Controllers/CandidateProfileController.php:195
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
export const updateEducation = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateEducation.url(args, options),
    method: 'put',
})

updateEducation.definition = {
    methods: ["put"],
    url: '/candidate-profiles/{candidate}/educations/{education}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::updateEducation
 * @see app/Http/Controllers/CandidateProfileController.php:195
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
updateEducation.url = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    education: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                education: typeof args.education === 'object'
                ? args.education.id
                : args.education,
                }

    return updateEducation.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{education}', parsedArgs.education.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::updateEducation
 * @see app/Http/Controllers/CandidateProfileController.php:195
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
updateEducation.put = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateEducation.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::updateEducation
 * @see app/Http/Controllers/CandidateProfileController.php:195
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
    const updateEducationForm = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateEducation.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::updateEducation
 * @see app/Http/Controllers/CandidateProfileController.php:195
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
        updateEducationForm.put = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateEducation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateEducation.form = updateEducationForm
/**
* @see \App\Http\Controllers\CandidateProfileController::destroyEducation
 * @see app/Http/Controllers/CandidateProfileController.php:204
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
export const destroyEducation = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEducation.url(args, options),
    method: 'delete',
})

destroyEducation.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/educations/{education}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroyEducation
 * @see app/Http/Controllers/CandidateProfileController.php:204
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
destroyEducation.url = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    education: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                education: typeof args.education === 'object'
                ? args.education.id
                : args.education,
                }

    return destroyEducation.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{education}', parsedArgs.education.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroyEducation
 * @see app/Http/Controllers/CandidateProfileController.php:204
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
destroyEducation.delete = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyEducation.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroyEducation
 * @see app/Http/Controllers/CandidateProfileController.php:204
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
    const destroyEducationForm = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyEducation.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroyEducation
 * @see app/Http/Controllers/CandidateProfileController.php:204
 * @route '/candidate-profiles/{candidate}/educations/{education}'
 */
        destroyEducationForm.delete = (args: { candidate: number | { id: number }, education: number | { id: number } } | [candidate: number | { id: number }, education: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyEducation.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyEducation.form = destroyEducationForm
/**
* @see \App\Http\Controllers\CandidateProfileController::storeExperience
 * @see app/Http/Controllers/CandidateProfileController.php:213
 * @route '/candidate-profiles/{candidate}/experiences'
 */
export const storeExperience = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExperience.url(args, options),
    method: 'post',
})

storeExperience.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/experiences',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::storeExperience
 * @see app/Http/Controllers/CandidateProfileController.php:213
 * @route '/candidate-profiles/{candidate}/experiences'
 */
storeExperience.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return storeExperience.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::storeExperience
 * @see app/Http/Controllers/CandidateProfileController.php:213
 * @route '/candidate-profiles/{candidate}/experiences'
 */
storeExperience.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeExperience.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::storeExperience
 * @see app/Http/Controllers/CandidateProfileController.php:213
 * @route '/candidate-profiles/{candidate}/experiences'
 */
    const storeExperienceForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeExperience.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::storeExperience
 * @see app/Http/Controllers/CandidateProfileController.php:213
 * @route '/candidate-profiles/{candidate}/experiences'
 */
        storeExperienceForm.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeExperience.url(args, options),
            method: 'post',
        })
    
    storeExperience.form = storeExperienceForm
/**
* @see \App\Http\Controllers\CandidateProfileController::updateExperience
 * @see app/Http/Controllers/CandidateProfileController.php:220
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
export const updateExperience = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExperience.url(args, options),
    method: 'put',
})

updateExperience.definition = {
    methods: ["put"],
    url: '/candidate-profiles/{candidate}/experiences/{experience}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::updateExperience
 * @see app/Http/Controllers/CandidateProfileController.php:220
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
updateExperience.url = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    experience: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                experience: typeof args.experience === 'object'
                ? args.experience.id
                : args.experience,
                }

    return updateExperience.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::updateExperience
 * @see app/Http/Controllers/CandidateProfileController.php:220
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
updateExperience.put = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateExperience.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::updateExperience
 * @see app/Http/Controllers/CandidateProfileController.php:220
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
    const updateExperienceForm = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateExperience.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::updateExperience
 * @see app/Http/Controllers/CandidateProfileController.php:220
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
        updateExperienceForm.put = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CandidateProfileController::destroyExperience
 * @see app/Http/Controllers/CandidateProfileController.php:229
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
export const destroyExperience = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExperience.url(args, options),
    method: 'delete',
})

destroyExperience.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/experiences/{experience}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroyExperience
 * @see app/Http/Controllers/CandidateProfileController.php:229
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
destroyExperience.url = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    experience: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                experience: typeof args.experience === 'object'
                ? args.experience.id
                : args.experience,
                }

    return destroyExperience.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{experience}', parsedArgs.experience.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroyExperience
 * @see app/Http/Controllers/CandidateProfileController.php:229
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
destroyExperience.delete = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyExperience.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroyExperience
 * @see app/Http/Controllers/CandidateProfileController.php:229
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
    const destroyExperienceForm = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyExperience.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroyExperience
 * @see app/Http/Controllers/CandidateProfileController.php:229
 * @route '/candidate-profiles/{candidate}/experiences/{experience}'
 */
        destroyExperienceForm.delete = (args: { candidate: number | { id: number }, experience: number | { id: number } } | [candidate: number | { id: number }, experience: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyExperience.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyExperience.form = destroyExperienceForm
/**
* @see \App\Http\Controllers\CandidateProfileController::storeSkill
 * @see app/Http/Controllers/CandidateProfileController.php:238
 * @route '/candidate-profiles/{candidate}/skills'
 */
export const storeSkill = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSkill.url(args, options),
    method: 'post',
})

storeSkill.definition = {
    methods: ["post"],
    url: '/candidate-profiles/{candidate}/skills',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::storeSkill
 * @see app/Http/Controllers/CandidateProfileController.php:238
 * @route '/candidate-profiles/{candidate}/skills'
 */
storeSkill.url = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { candidate: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { candidate: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                }

    return storeSkill.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::storeSkill
 * @see app/Http/Controllers/CandidateProfileController.php:238
 * @route '/candidate-profiles/{candidate}/skills'
 */
storeSkill.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSkill.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::storeSkill
 * @see app/Http/Controllers/CandidateProfileController.php:238
 * @route '/candidate-profiles/{candidate}/skills'
 */
    const storeSkillForm = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeSkill.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::storeSkill
 * @see app/Http/Controllers/CandidateProfileController.php:238
 * @route '/candidate-profiles/{candidate}/skills'
 */
        storeSkillForm.post = (args: { candidate: number | { id: number } } | [candidate: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeSkill.url(args, options),
            method: 'post',
        })
    
    storeSkill.form = storeSkillForm
/**
* @see \App\Http\Controllers\CandidateProfileController::destroySkill
 * @see app/Http/Controllers/CandidateProfileController.php:245
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
export const destroySkill = (args: { candidate: number | { id: number }, skill: number | { id: number } } | [candidate: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySkill.url(args, options),
    method: 'delete',
})

destroySkill.definition = {
    methods: ["delete"],
    url: '/candidate-profiles/{candidate}/skills/{skill}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CandidateProfileController::destroySkill
 * @see app/Http/Controllers/CandidateProfileController.php:245
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
destroySkill.url = (args: { candidate: number | { id: number }, skill: number | { id: number } } | [candidate: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    candidate: args[0],
                    skill: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        candidate: typeof args.candidate === 'object'
                ? args.candidate.id
                : args.candidate,
                                skill: typeof args.skill === 'object'
                ? args.skill.id
                : args.skill,
                }

    return destroySkill.definition.url
            .replace('{candidate}', parsedArgs.candidate.toString())
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CandidateProfileController::destroySkill
 * @see app/Http/Controllers/CandidateProfileController.php:245
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
destroySkill.delete = (args: { candidate: number | { id: number }, skill: number | { id: number } } | [candidate: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySkill.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CandidateProfileController::destroySkill
 * @see app/Http/Controllers/CandidateProfileController.php:245
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
    const destroySkillForm = (args: { candidate: number | { id: number }, skill: number | { id: number } } | [candidate: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroySkill.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CandidateProfileController::destroySkill
 * @see app/Http/Controllers/CandidateProfileController.php:245
 * @route '/candidate-profiles/{candidate}/skills/{skill}'
 */
        destroySkillForm.delete = (args: { candidate: number | { id: number }, skill: number | { id: number } } | [candidate: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroySkill.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroySkill.form = destroySkillForm
const CandidateProfileController = { createForRequisition, index, create, store, show, edit, update, destroy, storeEducation, updateEducation, destroyEducation, storeExperience, updateExperience, destroyExperience, storeSkill, destroySkill }

export default CandidateProfileController