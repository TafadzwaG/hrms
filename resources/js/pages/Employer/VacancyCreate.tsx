import { usePage } from '@inertiajs/react';
import { Briefcase, Lightbulb, History } from 'lucide-react';

import { employerBreadcrumbs, EmployerHubLayout } from './components/hub';
import { VacancyForm } from './components/VacancyForm';
import type { Company, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user?: User;
    vacancy: null;
    options: {
        categories: string[];
        employment_types: string[];
        work_modes: string[];
    };
};

export default function EmployerVacancyCreatePage() {
    const { company, vacancy, options } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? {
        name: 'Employer User',
        email: company.email ?? '',
    };

    return (
        <EmployerHubLayout
            title="Post a New Job"
            subtitle="Create a new vacancy using the existing employer dashboard workflow."
            active="vacancies"
            company={company}
            user={user}
            breadcrumbs={employerBreadcrumbs(
                { title: 'Vacancies', href: '/employer/vacancies' },
                'Post a New Job',
            )}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    
                    {/* Left Column: Form Section */}
                    <section className="space-y-6">
                        <div className="bg-transparent">
                            <h2 className="text-sm font-bold tracking-tight mb-4 border-b border-zinc-200 pb-2 text-black uppercase flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-zinc-400" /> Vacancy Details
                            </h2>

                            {/* The VacancyForm component handles the actual inputs/dropdowns */}
                            <VacancyForm
                                vacancy={vacancy}
                                options={options}
                                action="/employer/vacancies"
                                method="post"
                                submitLabel="Create Vacancy"
                            />
                        </div>
                    </section>

                    {/* Right Column: Consistent Sidebar Cards */}
                    <aside className="space-y-5">
                        
                        {/* Pro-Tip Card */}
                        <div className="bg-black p-5 rounded-sm shadow-sm text-white relative overflow-hidden group">
                            {/* Color Accent glow on hover */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-amber-500/20"></div>
                            <div className="flex items-start justify-between mb-3 relative z-10">
                                <div className="w-8 h-8 bg-amber-500/20 flex items-center justify-center rounded-sm text-amber-400">
                                    <Lightbulb className="h-4 w-4" />
                                </div>
                            </div>
                            <h3 className="text-sm font-bold tracking-tight text-white mb-1.5 uppercase relative z-10">Pro-Tip</h3>
                            <p className="text-zinc-400 text-[10px] leading-relaxed relative z-10">
                                Complete descriptions and specific locations receive 40% more qualified candidates within the first 48 hours. Make sure your perks stand out.
                            </p>
                        </div>

                        {/* Drafts List */}
                        <div className="bg-zinc-50 p-5 border border-zinc-200 rounded-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4 flex items-center gap-1.5">
                                <History className="h-3.5 w-3.5 text-blue-500" /> Drafts
                            </h4>
                            <div className="space-y-3">
                                <div className="group cursor-pointer border-b border-zinc-200/60 pb-3">
                                    <p className="text-xs font-black text-black group-hover:text-blue-600 transition-colors uppercase truncate">
                                        Visual Designer Intern
                                    </p>
                                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                                        Edited 2h ago
                                    </p>
                                </div>
                                <div className="group cursor-pointer">
                                    <p className="text-xs font-black text-black group-hover:text-blue-600 transition-colors uppercase truncate">
                                        Senior Backend Eng
                                    </p>
                                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                                        Edited yesterday
                                    </p>
                                </div>
                            </div>
                        </div>

                    </aside>
                </div>
            </div>
        </EmployerHubLayout>
    );
}
