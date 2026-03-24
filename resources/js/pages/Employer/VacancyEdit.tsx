import { Link, usePage } from '@inertiajs/react';
import { Briefcase, Lightbulb, HelpCircle, History, ArrowLeft, Activity } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { EmployerHubLayout, EmployerStatusBadge } from './components/hub';
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
            <div className="w-full px-4 md:px-6">
                {/* Header Section aligned with dense aesthetic */}
                <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-1">Edit Vacancy.</h1>
                        <p className="text-zinc-500 max-w-2xl text-xs font-medium tracking-tight">
                            Update vacancy content without changing the current dashboard structure.
                        </p>
                    </div>
                    <Link href={`/employer/vacancies/${vacancy.id}`}>
                        <Button className="bg-black hover:bg-zinc-800 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 h-auto rounded-sm flex items-center gap-1.5 transition-colors">
                            <ArrowLeft className="h-3.5 w-3.5" /> Back to Vacancy
                        </Button>
                    </Link>
                </header>

                {/* Main Grid - Preserving original layout structure */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    
                    {/* Left Column: Form Section */}
                    <section className="space-y-6">
                        <div className="bg-transparent">
                            <h2 className="text-sm font-bold tracking-tight mb-4 border-b border-zinc-200 pb-2 text-black uppercase flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-zinc-400" /> Vacancy Details
                            </h2>
                            {/* Dropdowns and Buttons inside here should be styled in the VacancyForm component */}
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
                    <aside className="space-y-5">
                        
                        <div className="bg-black p-5 rounded-sm shadow-sm text-white relative overflow-hidden group">
                            {/* Color Accent glow on hover */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-amber-500/20"></div>
                            <div className="flex items-start justify-between mb-3 relative z-10">
                                <div className="w-8 h-8 bg-amber-500/20 flex items-center justify-center rounded-sm text-amber-400">
                                    <Lightbulb className="h-4 w-4" />
                                </div>
                            </div>
                            <h3 className="text-sm font-bold tracking-tight text-white mb-1.5 uppercase relative z-10">Optimization Tip</h3>
                            <p className="text-zinc-400 text-[10px] leading-relaxed relative z-10">
                                Updating your requirements often attracts a fresh wave of applicants. Ensure your tech stack and benefits are up to date.
                            </p>
                        </div>

                        <div className="bg-zinc-50 p-5 border border-zinc-200 rounded-sm">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 mb-4 flex items-center gap-1.5">
                                <Activity className="h-3.5 w-3.5 text-blue-500" /> Quick Stats
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2">
                                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Current Status</p>
                                    <EmployerStatusBadge status={vacancy.status} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">Applications</p>
                                    <p className="text-[11px] font-black text-black uppercase bg-zinc-200/50 px-2 py-1 rounded-sm">
                                        {vacancy.applications_count || 0} received
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-sm flex items-center gap-3 border border-zinc-200 cursor-pointer hover:border-violet-300 transition-colors group">
                            <div className="h-8 w-8 rounded-sm bg-violet-50 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors shrink-0">
                                <HelpCircle className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400 leading-none mb-1">Need assistance?</p>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-black group-hover:text-violet-600 transition-colors">Contact support</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </EmployerHubLayout>
    );
}