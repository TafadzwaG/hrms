import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/documentation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentationController::index
 * @see app/Http/Controllers/DocumentationController.php:14
 * @route '/documentation'
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
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
export const download = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/documentation/{section}/{slug}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
download.url = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    section: args[0],
                    slug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        section: args.section,
                                slug: args.slug,
                }

    return download.definition.url
            .replace('{section}', parsedArgs.section.toString())
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
download.get = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
download.head = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
    const downloadForm = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
        downloadForm.get = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentationController::download
 * @see app/Http/Controllers/DocumentationController.php:35
 * @route '/documentation/{section}/{slug}/pdf'
 */
        downloadForm.head = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
export const show = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/documentation/{section}/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
show.url = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    section: args[0],
                    slug: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        section: args.section,
                                slug: args.slug,
                }

    return show.definition.url
            .replace('{section}', parsedArgs.section.toString())
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
show.get = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
show.head = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
    const showForm = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
        showForm.get = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DocumentationController::show
 * @see app/Http/Controllers/DocumentationController.php:21
 * @route '/documentation/{section}/{slug}'
 */
        showForm.head = (args: { section: string | number, slug: string | number } | [section: string | number, slug: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const DocumentationController = { index, download, show }

export default DocumentationController