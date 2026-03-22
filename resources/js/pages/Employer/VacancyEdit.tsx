import { usePage } from '@inertiajs/react';
import { Briefcase, Lightbulb, HelpCircle, History } from 'lucide-react';

import { EmployerHubLayout } from './components/hub';
import { VacancyForm } from './components/VacancyForm';
import type { Company, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user?: User;
    vacancy: Vacancy;
    options: {
        categories: string[];
        employment_types: string[];
        work_modes: string[];
    };
};

export default function EmployerVacancyEditPage() {
    const { company, vacancy, options } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'Employer User', email: company.email ?? '' };

    return (
        <EmployerHubLayout
            title="Edit Vacancy"
            subtitle="Update vacancy content without changing the current dashboard structure."
            active="vacancies"
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                {/* Header Section aligned with other pages */}
                <header className="mb-10">
                    <h1 className="text-4xl font-black tracking-tighter text-black mb-2">Edit Vacancy</h1>
                    <p className="text-zinc-500 max-w-2xl text-sm font-medium tracking-tight">
                        Update vacancy content without changing the current dashboard structure.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    {/* Left Column: Form Section */}
                    <section className="space-y-10">
                        <div className="bg-transparent">
                            <h2 className="text-lg font-bold tracking-tight mb-6 border-b border-zinc-200 pb-3 text-black">Vacancy Details</h2>
                            <VacancyForm 
                                vacancy={vacancy} 
                                options={options} 
                                action={`/employer/vacancies/${vacancy.id}`} 
                                method="put" 
                                submitLabel="Update Vacancy" 
                            />
                        </div>
                    </section>

                    {/* Right Column: Consistent Sidebar Cards */}
                    <aside className="space-y-6">
                        <div className="bg-black p-6 rounded-lg shadow-[0px_40px_80px_-40px_rgba(0,0,0,0.04)] text-white">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-sm text-white">
                                    <Lightbulb className="h-6 w-6" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold tracking-tight text-white mb-2">Optimization Tip</h3>
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                Updating your requirements often attracts a fresh wave of applicants. Ensure your tech stack and benefits are up to date.
                            </p>
                        </div>

                        <div className="bg-zinc-50 p-6 border border-zinc-200 rounded-lg">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-6 flex items-center gap-2">
                                <History size={14} /> Quick Stats
                            </h4>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Current Status</p>
                                    <p className="text-sm font-bold text-black mt-1 uppercase">{vacancy.status}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Applications</p>
                                    <p className="text-sm font-bold text-black mt-1">{vacancy.applications_count || 0} received</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg flex items-center gap-4 border border-zinc-200">
                            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-black">
                                <HelpCircle size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-tighter text-zinc-400 leading-none mb-1">Need assistance?</p>
                                <p className="text-xs font-bold text-black">Contact support</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </EmployerHubLayout>
    );
}