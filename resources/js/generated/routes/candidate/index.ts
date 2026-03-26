import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import applications17f98b from './applications'
import jobsF3446c from './jobs'
import profile937a89 from './profile'
import documentsC2fd24 from './documents'
import education001c63 from './education'
import skillsC32d22 from './skills'
import settings69f00b from './settings'
import interviews from './interviews'
import loginDf2c2a from './login'
import register702019 from './register'
/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/candidate/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\DashboardController::__invoke
 * @see app/Http/Controllers/Candidate/DashboardController.php:13
 * @route '/candidate/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
export const applications = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})

applications.definition = {
    methods: ["get","head"],
    url: '/candidate/applications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
applications.url = (options?: RouteQueryOptions) => {
    return applications.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
applications.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: applications.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
applications.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: applications.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
    const applicationsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: applications.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
        applicationsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\ApplicationsController::applications
 * @see app/Http/Controllers/Candidate/ApplicationsController.php:15
 * @route '/candidate/applications'
 */
        applicationsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: applications.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    applications.form = applicationsForm
/**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
export const jobs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jobs.url(options),
    method: 'get',
})

jobs.definition = {
    methods: ["get","head"],
    url: '/candidate/jobs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
jobs.url = (options?: RouteQueryOptions) => {
    return jobs.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
jobs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: jobs.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
jobs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: jobs.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
    const jobsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: jobs.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
        jobsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jobs.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\JobsController::jobs
 * @see app/Http/Controllers/Candidate/JobsController.php:17
 * @route '/candidate/jobs'
 */
        jobsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: jobs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    jobs.form = jobsForm
/**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
export const profile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})

profile.definition = {
    methods: ["get","head"],
    url: '/candidate/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
profile.url = (options?: RouteQueryOptions) => {
    return profile.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
profile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: profile.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
profile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: profile.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
    const profileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: profile.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
        profileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\ProfileController::profile
 * @see app/Http/Controllers/Candidate/ProfileController.php:16
 * @route '/candidate/profile'
 */
        profileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: profile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    profile.form = profileForm
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
export const documents = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documents.url(options),
    method: 'get',
})

documents.definition = {
    methods: ["get","head"],
    url: '/candidate/documents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
documents.url = (options?: RouteQueryOptions) => {
    return documents.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
documents.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: documents.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
documents.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: documents.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
    const documentsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: documents.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
        documentsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: documents.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\DocumentsController::documents
 * @see app/Http/Controllers/Candidate/DocumentsController.php:17
 * @route '/candidate/documents'
 */
        documentsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: documents.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    documents.form = documentsForm
/**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
export const education = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: education.url(options),
    method: 'get',
})

education.definition = {
    methods: ["get","head"],
    url: '/candidate/education',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
education.url = (options?: RouteQueryOptions) => {
    return education.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
education.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: education.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
education.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: education.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
    const educationForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: education.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
        educationForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: education.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\EducationController::education
 * @see app/Http/Controllers/Candidate/EducationController.php:14
 * @route '/candidate/education'
 */
        educationForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: education.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    education.form = educationForm
/**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
export const skills = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: skills.url(options),
    method: 'get',
})

skills.definition = {
    methods: ["get","head"],
    url: '/candidate/skills',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
skills.url = (options?: RouteQueryOptions) => {
    return skills.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
skills.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: skills.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
skills.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: skills.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
    const skillsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: skills.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
        skillsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: skills.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\SkillsController::skills
 * @see app/Http/Controllers/Candidate/SkillsController.php:14
 * @route '/candidate/skills'
 */
        skillsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: skills.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    skills.form = skillsForm
/**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
export const settings = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})

settings.definition = {
    methods: ["get","head"],
    url: '/candidate/settings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
settings.url = (options?: RouteQueryOptions) => {
    return settings.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
settings.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: settings.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
settings.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: settings.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
    const settingsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: settings.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
        settingsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Candidate\SettingsController::settings
 * @see app/Http/Controllers/Candidate/SettingsController.php:13
 * @route '/candidate/settings'
 */
        settingsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: settings.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    settings.form = settingsForm
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/candidate/login',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: login.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: login.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: login.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
login.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: login.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
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
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/login'
 */
        loginForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url({
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
        loginForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url({
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
        loginForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url({
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
        loginForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head","post","put","patch","delete","options"],
    url: '/candidate/register',
} satisfies RouteDefinition<["get","head","post","put","patch","delete","options"]>

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: register.url(options),
    method: 'put',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: register.url(options),
    method: 'patch',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: register.url(options),
    method: 'delete',
})
/**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
register.options = (options?: RouteQueryOptions): RouteDefinition<'options'> => ({
    url: register.url(options),
    method: 'options',
})

    /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
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
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
            /**
* @see \Illuminate\Routing\RedirectController::__invoke
 * @see vendor/laravel/framework/src/Illuminate/Routing/RedirectController.php:19
 * @route '/candidate/register'
 */
        registerForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url({
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
        registerForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url({
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
        registerForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url({
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
        registerForm.options = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'OPTIONS',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
const candidate = {
    dashboard: Object.assign(dashboard, dashboard),
applications: Object.assign(applications, applications17f98b),
jobs: Object.assign(jobs, jobsF3446c),
profile: Object.assign(profile, profile937a89),
documents: Object.assign(documents, documentsC2fd24),
education: Object.assign(education, education001c63),
skills: Object.assign(skills, skillsC32d22),
settings: Object.assign(settings, settings69f00b),
interviews: Object.assign(interviews, interviews),
login: Object.assign(login, loginDf2c2a),
register: Object.assign(register, register702019),
}

export default candidate