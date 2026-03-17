import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
export const upload = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upload.url(options),
    method: 'get',
})

upload.definition = {
    methods: ["get","head"],
    url: '/employees/upload',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
upload.url = (options?: RouteQueryOptions) => {
    return upload.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
upload.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: upload.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
upload.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: upload.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
    const uploadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: upload.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
        uploadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upload.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::upload
 * @see app/Http/Controllers/EmployeeController.php:614
 * @route '/employees/upload'
 */
        uploadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: upload.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    upload.form = uploadForm
/**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
export const downloadTemplate = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})

downloadTemplate.definition = {
    methods: ["get","head"],
    url: '/employees/template',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
downloadTemplate.url = (options?: RouteQueryOptions) => {
    return downloadTemplate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
downloadTemplate.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadTemplate.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
downloadTemplate.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadTemplate.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
    const downloadTemplateForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadTemplate.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
        downloadTemplateForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::downloadTemplate
 * @see app/Http/Controllers/EmployeeController.php:619
 * @route '/employees/template'
 */
        downloadTemplateForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadTemplate.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadTemplate.form = downloadTemplateForm
/**
* @see \App\Http\Controllers\EmployeeController::importMethod
 * @see app/Http/Controllers/EmployeeController.php:677
 * @route '/employees/import'
 */
export const importMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/employees/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::importMethod
 * @see app/Http/Controllers/EmployeeController.php:677
 * @route '/employees/import'
 */
importMethod.url = (options?: RouteQueryOptions) => {
    return importMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::importMethod
 * @see app/Http/Controllers/EmployeeController.php:677
 * @route '/employees/import'
 */
importMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::importMethod
 * @see app/Http/Controllers/EmployeeController.php:677
 * @route '/employees/import'
 */
    const importMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::importMethod
 * @see app/Http/Controllers/EmployeeController.php:677
 * @route '/employees/import'
 */
        importMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importMethod.url(options),
            method: 'post',
        })
    
    importMethod.form = importMethodForm
/**
* @see \App\Http\Controllers\EmployeeController::storeDocument
 * @see app/Http/Controllers/EmployeeController.php:422
 * @route '/employees/{employee}/documents'
 */
export const storeDocument = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

storeDocument.definition = {
    methods: ["post"],
    url: '/employees/{employee}/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storeDocument
 * @see app/Http/Controllers/EmployeeController.php:422
 * @route '/employees/{employee}/documents'
 */
storeDocument.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return storeDocument.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storeDocument
 * @see app/Http/Controllers/EmployeeController.php:422
 * @route '/employees/{employee}/documents'
 */
storeDocument.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDocument.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::storeDocument
 * @see app/Http/Controllers/EmployeeController.php:422
 * @route '/employees/{employee}/documents'
 */
    const storeDocumentForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDocument.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::storeDocument
 * @see app/Http/Controllers/EmployeeController.php:422
 * @route '/employees/{employee}/documents'
 */
        storeDocumentForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDocument.url(args, options),
            method: 'post',
        })
    
    storeDocument.form = storeDocumentForm
/**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
export const downloadDocument = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})

downloadDocument.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/documents/{document}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
downloadDocument.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return downloadDocument.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
downloadDocument.get = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadDocument.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
downloadDocument.head = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadDocument.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
    const downloadDocumentForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloadDocument.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
        downloadDocumentForm.get = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::downloadDocument
 * @see app/Http/Controllers/EmployeeController.php:457
 * @route '/employees/{employee}/documents/{document}/download'
 */
        downloadDocumentForm.head = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloadDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloadDocument.form = downloadDocumentForm
/**
* @see \App\Http\Controllers\EmployeeController::destroyDocument
 * @see app/Http/Controllers/EmployeeController.php:483
 * @route '/employees/{employee}/documents/{document}'
 */
export const destroyDocument = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDocument.url(args, options),
    method: 'delete',
})

destroyDocument.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/documents/{document}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroyDocument
 * @see app/Http/Controllers/EmployeeController.php:483
 * @route '/employees/{employee}/documents/{document}'
 */
destroyDocument.url = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    document: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                document: typeof args.document === 'object'
                ? args.document.id
                : args.document,
                }

    return destroyDocument.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{document}', parsedArgs.document.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroyDocument
 * @see app/Http/Controllers/EmployeeController.php:483
 * @route '/employees/{employee}/documents/{document}'
 */
destroyDocument.delete = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyDocument.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroyDocument
 * @see app/Http/Controllers/EmployeeController.php:483
 * @route '/employees/{employee}/documents/{document}'
 */
    const destroyDocumentForm = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyDocument.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroyDocument
 * @see app/Http/Controllers/EmployeeController.php:483
 * @route '/employees/{employee}/documents/{document}'
 */
        destroyDocumentForm.delete = (args: { employee: number | { id: number }, document: number | { id: number } } | [employee: number | { id: number }, document: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyDocument.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyDocument.form = destroyDocumentForm
/**
* @see \App\Http\Controllers\EmployeeController::storeNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:491
 * @route '/employees/{employee}/next-of-kin'
 */
export const storeNextOfKin = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNextOfKin.url(args, options),
    method: 'post',
})

storeNextOfKin.definition = {
    methods: ["post"],
    url: '/employees/{employee}/next-of-kin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storeNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:491
 * @route '/employees/{employee}/next-of-kin'
 */
storeNextOfKin.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return storeNextOfKin.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storeNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:491
 * @route '/employees/{employee}/next-of-kin'
 */
storeNextOfKin.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeNextOfKin.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::storeNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:491
 * @route '/employees/{employee}/next-of-kin'
 */
    const storeNextOfKinForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeNextOfKin.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::storeNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:491
 * @route '/employees/{employee}/next-of-kin'
 */
        storeNextOfKinForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeNextOfKin.url(args, options),
            method: 'post',
        })
    
    storeNextOfKin.form = storeNextOfKinForm
/**
* @see \App\Http\Controllers\EmployeeController::updateNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:510
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
export const updateNextOfKin = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNextOfKin.url(args, options),
    method: 'put',
})

updateNextOfKin.definition = {
    methods: ["put"],
    url: '/employees/{employee}/next-of-kin/{nextOfKin}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:510
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
updateNextOfKin.url = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    nextOfKin: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                nextOfKin: typeof args.nextOfKin === 'object'
                ? args.nextOfKin.id
                : args.nextOfKin,
                }

    return updateNextOfKin.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{nextOfKin}', parsedArgs.nextOfKin.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:510
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
updateNextOfKin.put = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateNextOfKin.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:510
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
    const updateNextOfKinForm = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateNextOfKin.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:510
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
        updateNextOfKinForm.put = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateNextOfKin.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateNextOfKin.form = updateNextOfKinForm
/**
* @see \App\Http\Controllers\EmployeeController::destroyNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:532
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
export const destroyNextOfKin = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyNextOfKin.url(args, options),
    method: 'delete',
})

destroyNextOfKin.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/next-of-kin/{nextOfKin}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroyNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:532
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
destroyNextOfKin.url = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    nextOfKin: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                nextOfKin: typeof args.nextOfKin === 'object'
                ? args.nextOfKin.id
                : args.nextOfKin,
                }

    return destroyNextOfKin.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{nextOfKin}', parsedArgs.nextOfKin.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroyNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:532
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
destroyNextOfKin.delete = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyNextOfKin.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroyNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:532
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
    const destroyNextOfKinForm = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyNextOfKin.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroyNextOfKin
 * @see app/Http/Controllers/EmployeeController.php:532
 * @route '/employees/{employee}/next-of-kin/{nextOfKin}'
 */
        destroyNextOfKinForm.delete = (args: { employee: number | { id: number }, nextOfKin: number | { id: number } } | [employee: number | { id: number }, nextOfKin: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyNextOfKin.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyNextOfKin.form = destroyNextOfKinForm
/**
* @see \App\Http\Controllers\EmployeeController::storePhysicalProfile
 * @see app/Http/Controllers/EmployeeController.php:548
 * @route '/employees/{employee}/physical-profile'
 */
export const storePhysicalProfile = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePhysicalProfile.url(args, options),
    method: 'post',
})

storePhysicalProfile.definition = {
    methods: ["post"],
    url: '/employees/{employee}/physical-profile',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storePhysicalProfile
 * @see app/Http/Controllers/EmployeeController.php:548
 * @route '/employees/{employee}/physical-profile'
 */
storePhysicalProfile.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return storePhysicalProfile.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storePhysicalProfile
 * @see app/Http/Controllers/EmployeeController.php:548
 * @route '/employees/{employee}/physical-profile'
 */
storePhysicalProfile.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePhysicalProfile.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::storePhysicalProfile
 * @see app/Http/Controllers/EmployeeController.php:548
 * @route '/employees/{employee}/physical-profile'
 */
    const storePhysicalProfileForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storePhysicalProfile.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::storePhysicalProfile
 * @see app/Http/Controllers/EmployeeController.php:548
 * @route '/employees/{employee}/physical-profile'
 */
        storePhysicalProfileForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storePhysicalProfile.url(args, options),
            method: 'post',
        })
    
    storePhysicalProfile.form = storePhysicalProfileForm
/**
* @see \App\Http\Controllers\EmployeeController::storeSkill
 * @see app/Http/Controllers/EmployeeController.php:558
 * @route '/employees/{employee}/skills'
 */
export const storeSkill = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSkill.url(args, options),
    method: 'post',
})

storeSkill.definition = {
    methods: ["post"],
    url: '/employees/{employee}/skills',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storeSkill
 * @see app/Http/Controllers/EmployeeController.php:558
 * @route '/employees/{employee}/skills'
 */
storeSkill.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return storeSkill.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storeSkill
 * @see app/Http/Controllers/EmployeeController.php:558
 * @route '/employees/{employee}/skills'
 */
storeSkill.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSkill.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::storeSkill
 * @see app/Http/Controllers/EmployeeController.php:558
 * @route '/employees/{employee}/skills'
 */
    const storeSkillForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeSkill.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::storeSkill
 * @see app/Http/Controllers/EmployeeController.php:558
 * @route '/employees/{employee}/skills'
 */
        storeSkillForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeSkill.url(args, options),
            method: 'post',
        })
    
    storeSkill.form = storeSkillForm
/**
* @see \App\Http\Controllers\EmployeeController::updateSkill
 * @see app/Http/Controllers/EmployeeController.php:565
 * @route '/employees/{employee}/skills/{skill}'
 */
export const updateSkill = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSkill.url(args, options),
    method: 'put',
})

updateSkill.definition = {
    methods: ["put"],
    url: '/employees/{employee}/skills/{skill}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateSkill
 * @see app/Http/Controllers/EmployeeController.php:565
 * @route '/employees/{employee}/skills/{skill}'
 */
updateSkill.url = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    skill: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                skill: typeof args.skill === 'object'
                ? args.skill.id
                : args.skill,
                }

    return updateSkill.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateSkill
 * @see app/Http/Controllers/EmployeeController.php:565
 * @route '/employees/{employee}/skills/{skill}'
 */
updateSkill.put = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateSkill.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateSkill
 * @see app/Http/Controllers/EmployeeController.php:565
 * @route '/employees/{employee}/skills/{skill}'
 */
    const updateSkillForm = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateSkill.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateSkill
 * @see app/Http/Controllers/EmployeeController.php:565
 * @route '/employees/{employee}/skills/{skill}'
 */
        updateSkillForm.put = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateSkill.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateSkill.form = updateSkillForm
/**
* @see \App\Http\Controllers\EmployeeController::destroySkill
 * @see app/Http/Controllers/EmployeeController.php:573
 * @route '/employees/{employee}/skills/{skill}'
 */
export const destroySkill = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySkill.url(args, options),
    method: 'delete',
})

destroySkill.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/skills/{skill}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroySkill
 * @see app/Http/Controllers/EmployeeController.php:573
 * @route '/employees/{employee}/skills/{skill}'
 */
destroySkill.url = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    skill: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                skill: typeof args.skill === 'object'
                ? args.skill.id
                : args.skill,
                }

    return destroySkill.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{skill}', parsedArgs.skill.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroySkill
 * @see app/Http/Controllers/EmployeeController.php:573
 * @route '/employees/{employee}/skills/{skill}'
 */
destroySkill.delete = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroySkill.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroySkill
 * @see app/Http/Controllers/EmployeeController.php:573
 * @route '/employees/{employee}/skills/{skill}'
 */
    const destroySkillForm = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroySkill.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroySkill
 * @see app/Http/Controllers/EmployeeController.php:573
 * @route '/employees/{employee}/skills/{skill}'
 */
        destroySkillForm.delete = (args: { employee: number | { id: number }, skill: number | { id: number } } | [employee: number | { id: number }, skill: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroySkill.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroySkill.form = destroySkillForm
/**
* @see \App\Http\Controllers\EmployeeController::storeJobProfile
 * @see app/Http/Controllers/EmployeeController.php:581
 * @route '/employees/{employee}/job-profile'
 */
export const storeJobProfile = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeJobProfile.url(args, options),
    method: 'post',
})

storeJobProfile.definition = {
    methods: ["post"],
    url: '/employees/{employee}/job-profile',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storeJobProfile
 * @see app/Http/Controllers/EmployeeController.php:581
 * @route '/employees/{employee}/job-profile'
 */
storeJobProfile.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return storeJobProfile.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storeJobProfile
 * @see app/Http/Controllers/EmployeeController.php:581
 * @route '/employees/{employee}/job-profile'
 */
storeJobProfile.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeJobProfile.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::storeJobProfile
 * @see app/Http/Controllers/EmployeeController.php:581
 * @route '/employees/{employee}/job-profile'
 */
    const storeJobProfileForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeJobProfile.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::storeJobProfile
 * @see app/Http/Controllers/EmployeeController.php:581
 * @route '/employees/{employee}/job-profile'
 */
        storeJobProfileForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeJobProfile.url(args, options),
            method: 'post',
        })
    
    storeJobProfile.form = storeJobProfileForm
/**
* @see \App\Http\Controllers\EmployeeController::storeKpi
 * @see app/Http/Controllers/EmployeeController.php:591
 * @route '/employees/{employee}/kpis'
 */
export const storeKpi = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKpi.url(args, options),
    method: 'post',
})

storeKpi.definition = {
    methods: ["post"],
    url: '/employees/{employee}/kpis',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::storeKpi
 * @see app/Http/Controllers/EmployeeController.php:591
 * @route '/employees/{employee}/kpis'
 */
storeKpi.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return storeKpi.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::storeKpi
 * @see app/Http/Controllers/EmployeeController.php:591
 * @route '/employees/{employee}/kpis'
 */
storeKpi.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeKpi.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::storeKpi
 * @see app/Http/Controllers/EmployeeController.php:591
 * @route '/employees/{employee}/kpis'
 */
    const storeKpiForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeKpi.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::storeKpi
 * @see app/Http/Controllers/EmployeeController.php:591
 * @route '/employees/{employee}/kpis'
 */
        storeKpiForm.post = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeKpi.url(args, options),
            method: 'post',
        })
    
    storeKpi.form = storeKpiForm
/**
* @see \App\Http\Controllers\EmployeeController::updateKpi
 * @see app/Http/Controllers/EmployeeController.php:598
 * @route '/employees/{employee}/kpis/{kpi}'
 */
export const updateKpi = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateKpi.url(args, options),
    method: 'put',
})

updateKpi.definition = {
    methods: ["put"],
    url: '/employees/{employee}/kpis/{kpi}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\EmployeeController::updateKpi
 * @see app/Http/Controllers/EmployeeController.php:598
 * @route '/employees/{employee}/kpis/{kpi}'
 */
updateKpi.url = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    kpi: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                kpi: typeof args.kpi === 'object'
                ? args.kpi.id
                : args.kpi,
                }

    return updateKpi.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{kpi}', parsedArgs.kpi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::updateKpi
 * @see app/Http/Controllers/EmployeeController.php:598
 * @route '/employees/{employee}/kpis/{kpi}'
 */
updateKpi.put = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateKpi.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\EmployeeController::updateKpi
 * @see app/Http/Controllers/EmployeeController.php:598
 * @route '/employees/{employee}/kpis/{kpi}'
 */
    const updateKpiForm = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateKpi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::updateKpi
 * @see app/Http/Controllers/EmployeeController.php:598
 * @route '/employees/{employee}/kpis/{kpi}'
 */
        updateKpiForm.put = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateKpi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateKpi.form = updateKpiForm
/**
* @see \App\Http\Controllers\EmployeeController::destroyKpi
 * @see app/Http/Controllers/EmployeeController.php:606
 * @route '/employees/{employee}/kpis/{kpi}'
 */
export const destroyKpi = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyKpi.url(args, options),
    method: 'delete',
})

destroyKpi.definition = {
    methods: ["delete"],
    url: '/employees/{employee}/kpis/{kpi}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroyKpi
 * @see app/Http/Controllers/EmployeeController.php:606
 * @route '/employees/{employee}/kpis/{kpi}'
 */
destroyKpi.url = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                    kpi: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                                kpi: typeof args.kpi === 'object'
                ? args.kpi.id
                : args.kpi,
                }

    return destroyKpi.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace('{kpi}', parsedArgs.kpi.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroyKpi
 * @see app/Http/Controllers/EmployeeController.php:606
 * @route '/employees/{employee}/kpis/{kpi}'
 */
destroyKpi.delete = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyKpi.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroyKpi
 * @see app/Http/Controllers/EmployeeController.php:606
 * @route '/employees/{employee}/kpis/{kpi}'
 */
    const destroyKpiForm = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyKpi.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroyKpi
 * @see app/Http/Controllers/EmployeeController.php:606
 * @route '/employees/{employee}/kpis/{kpi}'
 */
        destroyKpiForm.delete = (args: { employee: number | { id: number }, kpi: number | { id: number } } | [employee: number | { id: number }, kpi: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyKpi.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyKpi.form = destroyKpiForm
/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/employees',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::index
 * @see app/Http/Controllers/EmployeeController.php:34
 * @route '/employees'
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
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/employees/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::create
 * @see app/Http/Controllers/EmployeeController.php:135
 * @route '/employees/create'
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
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:156
 * @route '/employees'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/employees',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:156
 * @route '/employees'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:156
 * @route '/employees'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:156
 * @route '/employees'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::store
 * @see app/Http/Controllers/EmployeeController.php:156
 * @route '/employees'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
export const show = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
show.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return show.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
show.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
show.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
    const showForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
        showForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::show
 * @see app/Http/Controllers/EmployeeController.php:177
 * @route '/employees/{employee}'
 */
        showForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
export const edit = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/employees/{employee}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
edit.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return edit.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
edit.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
edit.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
    const editForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
        editForm.get = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::edit
 * @see app/Http/Controllers/EmployeeController.php:348
 * @route '/employees/{employee}/edit'
 */
        editForm.head = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
export const update = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
update.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return update.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
update.put = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
update.patch = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
    const updateForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
        updateForm.put = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\EmployeeController::update
 * @see app/Http/Controllers/EmployeeController.php:392
 * @route '/employees/{employee}'
 */
        updateForm.patch = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:413
 * @route '/employees/{employee}'
 */
export const destroy = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/employees/{employee}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:413
 * @route '/employees/{employee}'
 */
destroy.url = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { employee: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { employee: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    employee: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        employee: typeof args.employee === 'object'
                ? args.employee.id
                : args.employee,
                }

    return destroy.definition.url
            .replace('{employee}', parsedArgs.employee.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:413
 * @route '/employees/{employee}'
 */
destroy.delete = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:413
 * @route '/employees/{employee}'
 */
    const destroyForm = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmployeeController::destroy
 * @see app/Http/Controllers/EmployeeController.php:413
 * @route '/employees/{employee}'
 */
        destroyForm.delete = (args: { employee: number | { id: number } } | [employee: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const EmployeeController = { upload, downloadTemplate, importMethod, storeDocument, downloadDocument, destroyDocument, storeNextOfKin, updateNextOfKin, destroyNextOfKin, storePhysicalProfile, storeSkill, updateSkill, destroySkill, storeJobProfile, storeKpi, updateKpi, destroyKpi, index, create, store, show, edit, update, destroy, import: importMethod }

export default EmployeeController