import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/assets/import',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetImportController::create
 * @see app/Http/Controllers/AssetImportController.php:21
 * @route '/assets/import'
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
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
export const template = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})

template.definition = {
    methods: ["get","head"],
    url: '/assets/import/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
template.url = (options?: RouteQueryOptions) => {
    return template.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
template.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: template.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
template.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: template.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
    const templateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: template.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
        templateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\AssetImportController::template
 * @see app/Http/Controllers/AssetImportController.php:28
 * @route '/assets/import/template'
 */
        templateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: template.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    template.form = templateForm
/**
* @see \App\Http\Controllers\AssetImportController::store
 * @see app/Http/Controllers/AssetImportController.php:97
 * @route '/assets/import'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/assets/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AssetImportController::store
 * @see app/Http/Controllers/AssetImportController.php:97
 * @route '/assets/import'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AssetImportController::store
 * @see app/Http/Controllers/AssetImportController.php:97
 * @route '/assets/import'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\AssetImportController::store
 * @see app/Http/Controllers/AssetImportController.php:97
 * @route '/assets/import'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\AssetImportController::store
 * @see app/Http/Controllers/AssetImportController.php:97
 * @route '/assets/import'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const AssetImportController = { create, template, store }

export default AssetImportController