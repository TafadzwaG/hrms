import { Link, router, usePage } from '@inertiajs/react';
import {
    Archive,
    Briefcase,
    CalendarDays,
    DollarSign,
    Eye,
    FileText,
    Globe,
    Layers3,
    MapPin,
    PauseCircle,
    Pencil,
    Plus,
    Search,
    Send,
    Trash2,
    Users,
    XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { richTextToPlainText } from '@/components/rich-text';
import {
    EmployerEmptyState,
    EmployerHubLayout,
} from './components/hub';
import type { Company, User, Vacancy } from './dummyData';

type PageProps = {
    company: Company;
    user?: User;
    vacancies: {
        data: Vacancy[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { search: string; status: string };
    options: { statuses: string[] };
};

export default function EmployerVacanciesPage() {
    const { company, vacancies, filters, options } = usePage<PageProps>().props;
    const user = usePage<{ user?: User }>().props.user ?? { name: 'employer user', email: company.email ?? '' };

    const updateStatus = (vacancyId: number, status: string) => {
        router.patch(`/employer/vacancies/${vacancyId}/status`, { status }, { preserveScroll: true });
    };

    return (
        <EmployerHubLayout
            title="vacancies"
            subtitle="manage creation, publishing, and lifecycle."
            active="vacancies"
            company={company}
            user={user}
        >
            <div className="w-full px-4 md:px-6">
                {/* compact header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Vacancies</h2>
                        <p className="mt-1.5 text-sm text-muted-foreground">Manage creation, publishing, and lifecycle.</p>
                    </div>
                    <Link href="/employer/vacancies/create">
                        <button className="bg-black text-white px-5 py-2.5 rounded-sm font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-zinc-800 transition-all active:scale-[0.98]">
                            <Plus className="h-3.5 w-3.5" /> post a new job
                        </button>
                    </Link>
                </div>

                {/* filter section */}
                <section className="bg-zinc-50 border border-zinc-200 rounded-sm p-4 mb-6 flex flex-wrap items-end gap-3 shadow-sm">
                    <div className="flex-1 min-w-[200px] space-y-1.5">
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 ml-1">Search</label>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                            <input 
                                name="search"
                                defaultValue={filters.search}
                                className="w-full bg-white border border-zinc-200 rounded-sm pl-9 pr-3 py-2 text-xs focus:border-black focus:ring-0 transition-colors placeholder:text-zinc-300" 
                                placeholder="title, keywords..." 
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="w-40 space-y-1.5">
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 ml-1">Status</label>
                        <select name="status" defaultValue={filters.status} className="w-full bg-white border border-zinc-200 rounded-sm px-3 py-2 text-xs focus:border-black focus:ring-0 appearance-none font-medium">
                            <option value="">all statuses</option>
                            {options.statuses.map((status) => (
                                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>
                    <button className="bg-zinc-900 text-white px-6 py-2 rounded-sm font-black text-[9px] uppercase tracking-widest h-[34px] hover:bg-black transition-colors">
                        apply
                    </button>
                </section>

                {/* vacancy list */}
                <div className="space-y-4">
                    {vacancies.data.length > 0 ? (
                        vacancies.data.map((vacancy) => (
                            <article 
                                key={vacancy.id} 
                                className={`group bg-white border border-zinc-200 rounded-sm p-6 hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-300 ${vacancy.status_code !== 'published' ? 'opacity-85' : ''}`}
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="flex-1 space-y-5">
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2.5">
                                                    <h3 className="text-base font-semibold tracking-tight text-foreground">{vacancy.title}</h3>
                                                    <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm border ${getStatusStyles(vacancy.status_code ?? 'draft')}`}>
                                                        {vacancy.status}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    <Badge label={vacancy.department || 'general'} />
                                                    <Badge label={vacancy.work_mode || 'remote'} />
                                                    <Badge label={vacancy.employment_type || 'full-time'} />
                                                    <Badge label={vacancy.location || 'not set'} />
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                <ActionIconLink href={`/employer/vacancies/${vacancy.id}`} icon={<Eye size={16} />} title="view" />
                                                <ActionIconLink href={`/employer/vacancies/${vacancy.id}/edit`} icon={<Pencil size={16} />} title="edit" />
                                                {vacancy.status_code === 'published' ? (
                                                    <ActionIconButton onClick={() => updateStatus(vacancy.id, 'draft')} icon={<PauseCircle size={16} />} title="unpublish" />
                                                ) : (
                                                    <ActionIconButton onClick={() => updateStatus(vacancy.id, 'published')} icon={<Send size={16} />} title="publish" />
                                                )}
                                                <ActionIconButton 
                                                    onClick={() => window.confirm('delete?') && router.delete(`/employer/vacancies/${vacancy.id}`)} 
                                                    icon={<Trash2 size={16} />} 
                                                    title="delete" 
                                                    variant="danger" 
                                                />
                                            </div>
                                        </div>

                                        {/* metrics grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-zinc-100 py-3">
                                            <Metric label="applications" value={vacancy.applications_count} />
                                            <Metric label="compensation" value={formatSalary(vacancy)} />
                                            <Metric label="deadline" value={vacancy.application_deadline ?? 'none'} />
                                            <Metric label={vacancy.status_code === 'published' ? 'published' : 'modified'} value={vacancy.published_at ?? 'draft'} />
                                        </div>

                                        {/* detail panels */}
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <Panel label="description" content={vacancy.description} />
                                            <Panel label="requirements" content={vacancy.requirements} />
                                            <Panel label="responsibilities" content={vacancy.responsibilities} />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <EmployerEmptyState message="no vacancies found." />
                    )}
                </div>

                {/* pagination */}
                <div className="mt-10 flex items-center justify-between border-t border-zinc-100 pt-6 mb-10">
                    <p className="text-xs font-medium text-muted-foreground">
                        Showing {vacancies.data.length} vacancies
                    </p>
                    <div className="flex items-center gap-1">
                        {vacancies.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? '#'}
                                className={`w-8 h-8 flex items-center justify-center rounded-sm border text-[10px] font-bold transition-all ${
                                    link.active 
                                    ? 'bg-black text-white border-black' 
                                    : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                                } ${!link.url && 'opacity-20 pointer-events-none'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </EmployerHubLayout>
    );
}

/* --- helpers --- */

const Badge = ({ label }: { label: string }) => (
    <span className="px-1.5 py-0.5 bg-zinc-100 text-zinc-500 text-[8px] font-black uppercase tracking-widest rounded-sm border border-zinc-200/50">
        {label.replace(/_/g, ' ')}
    </span>
);

const Metric = ({ label, value }: { label: string; value: string | number }) => (
    <div className="space-y-0.5 min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
    </div>
);

const Panel = ({ label, content }: { label: string; content?: string | null }) => (
    <div className="space-y-1.5">
        <h4 className="text-xs font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <div className="w-1 h-1 bg-zinc-300 rounded-full"></div> {label}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {richTextToPlainText(content)?.trim() || 'None.'}
        </p>
    </div>
);

const ActionIconLink = ({ href, icon, title }: { href: string; icon: ReactNode; title: string }) => (
    <Link href={href} className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-sm transition-colors" title={title}>
        {icon}
    </Link>
);

const ActionIconButton = ({ onClick, icon, title, variant = 'default' }: { onClick: () => void; icon: ReactNode; title: string; variant?: 'default' | 'danger' }) => (
    <button 
        onClick={onClick} 
        className={`p-1.5 rounded-sm transition-colors ${variant === 'danger' ? 'text-zinc-300 hover:text-red-600 hover:bg-red-50' : 'text-zinc-400 hover:text-black hover:bg-zinc-100'}`} 
        title={title}
    >
        {icon}
    </button>
);

function getStatusStyles(code: string): string {
    switch (code) {
        case 'published': return 'bg-black text-white border-black';
        case 'closed': return 'bg-red-50 text-red-600 border-red-200';
        default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
}

function formatSalary(vacancy: Vacancy): string {
    if (!vacancy.salary_min && !vacancy.salary_max) return 'competitive';
    return `${vacancy.currency ?? '$'}${vacancy.salary_min ?? '0'}+`;
}
