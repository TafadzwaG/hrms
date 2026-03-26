import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::store
 * @see app/Http/Controllers/Candidate/DocumentsController.php:37
 * @route '/candidate/documents'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/candidate/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::store
 * @see app/Http/Controllers/Candidate/DocumentsController.php:37
 * @route '/candidate/documents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::store
 * @see app/Http/Controllers/Candidate/DocumentsController.php:37
 * @route '/candidate/documents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Candidate\DocumentsController::store
 * @see app/Http/Controllers/Candidate/DocumentsController.php:37
 * @route '/candidate/documents'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::store
 * @see app/Http/Controllers/Candidate/DocumentsController.php:37
 * @route '/candidate/documents'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
export const download = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/candidate/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
download.url = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: args.document,
                }

    return download.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
download.get = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
download.head = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
    const downloadForm = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
        downloadForm.get = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::download
 * @see app/Http/Controllers/Candidate/DocumentsController.php:70
 * @route '/candidate/documents/{document}/download'
 */
        downloadForm.head = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
export const preview = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/candidate/documents/{document}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
preview.url = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: args.document,
                }

    return preview.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
preview.get = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
preview.head = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
    const previewForm = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
        previewForm.get = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::preview
 * @see app/Http/Controllers/Candidate/DocumentsController.php:91
 * @route '/candidate/documents/{document}/preview'
 */
        previewForm.head = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::primary
 * @see app/Http/Controllers/Candidate/DocumentsController.php:119
 * @route '/candidate/documents/{document}/primary'
 */
export const primary = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: primary.url(args, options),
    method: 'put',
})

primary.definition = {
    methods: ["put"],
    url: '/candidate/documents/{document}/primary',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::primary
 * @see app/Http/Controllers/Candidate/DocumentsController.php:119
 * @route '/candidate/documents/{document}/primary'
 */
primary.url = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: args.document,
                }

    return primary.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::primary
 * @see app/Http/Controllers/Candidate/DocumentsController.php:119
 * @route '/candidate/documents/{document}/primary'
 */
primary.put = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: primary.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Candidate\DocumentsController::primary
 * @see app/Http/Controllers/Candidate/DocumentsController.php:119
 * @route '/candidate/documents/{document}/primary'
 */
    const primaryForm = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: primary.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::primary
 * @see app/Http/Controllers/Candidate/DocumentsController.php:119
 * @route '/candidate/documents/{document}/primary'
 */
        primaryForm.put = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: primary.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    primary.form = primaryForm
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::destroy
 * @see app/Http/Controllers/Candidate/DocumentsController.php:137
 * @route '/candidate/documents/{document}'
 */
export const destroy = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/candidate/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::destroy
 * @see app/Http/Controllers/Candidate/DocumentsController.php:137
 * @route '/candidate/documents/{document}'
 */
destroy.url = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { document: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    document: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        document: args.document,
                }

    return destroy.definition.url
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::destroy
 * @see app/Http/Controllers/Candidate/DocumentsController.php:137
 * @route '/candidate/documents/{document}'
 */
destroy.delete = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Candidate\DocumentsController::destroy
 * @see app/Http/Controllers/Candidate/DocumentsController.php:137
 * @route '/candidate/documents/{document}'
 */
    const destroyForm = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::destroy
 * @see app/Http/Controllers/Candidate/DocumentsController.php:137
 * @route '/candidate/documents/{document}'
 */
        destroyForm.delete = (args: { document: string | number } | [document: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const documents = {
    store: Object.assign(store, store),
download: Object.assign(download, download),
preview: Object.assign(preview, preview),
primary: Object.assign(primary, primary),
destroy: Object.assign(destroy, destroy),
}

export default documents