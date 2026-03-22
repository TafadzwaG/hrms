import { usePage } from '@inertiajs/react';
import { Lightbulb, History } from 'lucide-react';
import { EmployerHubLayout } from './components/hub';
import { VacancyForm } from './components/VacancyForm';
import type { Company, User } from './dummyData';

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
        >
            <div className="w-full px-6 md:px-10">
                <header className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-black mb-2">
                        Post a New Job
                    </h1>
                    <p className="text-zinc-500 max-w-2xl text-sm font-medium tracking-tight">
                        Create a new vacancy using the existing employer dashboard workflow.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    <section className="space-y-10">
                        <div className="bg-transparent">
                            <h2 className="text-lg font-bold tracking-tight mb-6 border-b border-zinc-200 pb-3 text-black">
                                Vacancy Details
                            </h2>

                            <VacancyForm
                                vacancy={vacancy}
                                options={options}
                                action="/employer/vacancies"
                                method="post"
                                submitLabel="Create Vacancy"
                            />
                        </div>
                    </section>

                    <aside className="space-y-6">
                        <div className="bg-black p-6 rounded-lg shadow-[0px_40px_80px_-40px_rgba(0,0,0,0.04)] text-white">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-sm text-white">
                                    <Lightbulb className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold tracking-tight text-white mb-2">Pro-Tip</h3>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                Complete descriptions and specific locations receive 40% more qualified candidates within the first 48 hours.
                            </p>
                        </div>

                        <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-lg">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-6 flex items-center gap-2">
                                <History size={14} /> Drafts
                            </h4>
                            <div className="space-y-4">
                                <div className="group cursor-pointer">
                                    <p className="text-[13px] font-bold text-black group-hover:underline">
                                        Visual Designer Intern
                                    </p>
                                    <p className="text-[10px] text-zinc-400 uppercase font-medium mt-1">
                                        Edited 2h ago
                                    </p>
                                </div>
                                <div className="group cursor-pointer">
                                    <p className="text-[13px] font-bold text-black group-hover:underline">
                                        Senior Backend Eng
                                    </p>
                                    <p className="text-[10px] text-zinc-400 uppercase font-medium mt-1">
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