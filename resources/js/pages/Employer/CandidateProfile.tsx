import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Download, FileText, Mic, Target } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import moment from 'moment';

import { DocumentPreviewDialog } from '@/components/document-preview-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    employerBreadcrumbs,
    EmployerHubLayout,
    EmployerStatusBadge,
} from './components/hub';
import type {
    Company,
    EmployerCandidateDocument,
    EmployerCandidateEducation,
    EmployerCandidateExperience,
    EmployerCandidateProfile,
    EmployerCandidateSkill,
    EmployerInterview,
    RecentApplication,
    User,
} from './dummyData';

type PageProps = {
    company: Company;
    user: User;
    application: RecentApplication;
    candidate: EmployerCandidateProfile;
    educations: EmployerCandidateEducation[];
    experiences: EmployerCandidateExperience[];
    skills: EmployerCandidateSkill[];
    documents: EmployerCandidateDocument[];
    interviews: EmployerInterview[];
    meetingTypes: string[];
};

type ScheduleInterviewForm = {
    scheduled_at: string;
    ends_at: string;
    timezone: string;
    meeting_type: string;
    location: string;
    instructions: string;
};

const browserTimezone =
    typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Africa/Johannesburg';

export default function EmployerCandidateProfilePage() {
    const {
        company,
        user,
        application,
        candidate,
        educations,
        experiences,
        skills,
        documents,
        interviews,
        meetingTypes,
    } = usePage<PageProps>().props;
    const [activeDocumentId, setActiveDocumentId] = useState<number | null>(documents[0]?.id ?? null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const scheduleForm = useForm<ScheduleInterviewForm>({
        scheduled_at: '',
        ends_at: '',
        timezone: browserTimezone,
        meeting_type: meetingTypes[0] ?? 'video',
        location: '',
        instructions: '',
    });

    const submitInterview = (e: React.FormEvent) => {
        e.preventDefault();
        scheduleForm.post(`/employer/applications/${application.id}/interviews`, {
            preserveScroll: true,
            onSuccess: () => {
                scheduleForm.reset('scheduled_at', 'ends_at', 'location', 'instructions');
                scheduleForm.setData('timezone', browserTimezone);
                scheduleForm.setData('meeting_type', meetingTypes[0] ?? 'video');
            },
        });
    };

    const updateStatus = (applicationId: number, status: string) => {
        router.patch(`/employer/applications/${applicationId}/status`, { status }, { preserveScroll: true });
    };

    const activeDocument = useMemo(
        () => documents.find((document) => document.id === activeDocumentId) ?? documents[0] ?? null,
        [activeDocumentId, documents],
    );

    const togglePreview = (documentId: number) => {
        if (activeDocumentId === documentId && previewOpen) {
            setPreviewOpen(false);
            return;
        }

        setActiveDocumentId(documentId);
        setPreviewOpen(true);
    };

    return (
        <EmployerHubLayout
            title="Candidate Detail"
            active="candidates"
            subtitle="Review the full applicant profile, supporting documents, and interview schedule."
            company={company}
            user={user}
            breadcrumbs={employerBreadcrumbs(
                { title: 'Candidates', href: '/employer/candidates' },
                candidate.full_name || 'Candidate Detail',
            )}
        >
            <div className="space-y-6">
                {/* Profile Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-2xl font-black rounded-sm shrink-0">
                            {getInitials(candidate.full_name)}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{candidate.full_name}</h2>
                                {application.match_score ? (
                                    <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black tracking-widest uppercase rounded-sm flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {application.match_score}% Match
                                    </span>
                                ) : null}
                            </div>
                            <p className="text-zinc-500 text-sm font-bold tracking-tight mt-0.5">{candidate.headline || 'Candidate Profile'}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 rounded-sm border-zinc-200 text-[9px] font-bold tracking-widest uppercase">
                            <Link href="/employer/candidates">
                                <ArrowLeft className="h-3.5 w-3.5" /> Candidates
                            </Link>
                        </Button>
                        <Button asChild size="sm" className="h-8 gap-1.5 rounded-sm text-[9px] font-bold tracking-widest uppercase">
                            <Link href="/employer/interviews">
                                <CalendarIcon className="h-3.5 w-3.5" /> All Interviews
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Two-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Main Content (Left) */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {/* Professional Summary */}
                        <section>
                            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 text-zinc-400">Professional Summary</h3>
                            <p className="text-zinc-800 text-sm leading-relaxed mb-6 max-w-3xl">
                                {candidate.professional_summary || 'No professional summary provided.'}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-200 rounded-sm overflow-hidden border border-zinc-200">
                                <SummaryBox label="Email" value={candidate.email} />
                                <SummaryBox label="Phone" value={candidate.phone} />
                                <SummaryBox label="Location" value={candidate.location} />
                                <SummaryBox label="Salary" value={candidate.expected_salary ? `${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary}` : 'N/A'} />
                            </div>
                        </section>

                        {/* Work Experience */}
                        <section>
                            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-zinc-400">Work Experience</h3>
                            <div className="space-y-6">
                                {experiences.length > 0 ? experiences.map((exp, idx) => (
                                    <div key={exp.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-[2px] before:h-full before:bg-zinc-200">
                                        <div className={`absolute left-[-3px] top-1 w-2 h-2 rounded-full ${idx === 0 ? 'bg-black' : 'bg-zinc-300'}`}></div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1.5 gap-2">
                                            <h4 className="text-base font-black uppercase text-black">{exp.job_title}</h4>
                                            <span className="text-[9px] font-black tracking-widest text-zinc-500 bg-zinc-100 px-2 py-0.5 uppercase rounded-sm">
                                                {formatRange(exp.start_date, exp.end_date, exp.currently_working)}
                                            </span>
                                        </div>
                                        <p className="font-bold text-xs text-zinc-500 mb-2 uppercase tracking-wider">{exp.employer_name}</p>
                                        {exp.description && (
                                            <p className="text-zinc-600 leading-relaxed text-xs">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-xs text-zinc-500 italic">No work experience listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h3 className="text-xs font-semibold tracking-widest uppercase mb-5 text-zinc-400">Education</h3>
                            <div className="space-y-3">
                                {educations.length > 0 ? educations.map((edu, idx) => (
                                    <div key={edu.id} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-zinc-50 rounded-sm gap-3 ${idx === 0 ? 'border-l-4 border-black' : 'border border-zinc-200'}`}>
                                        <div>
                                            <h4 className="font-bold text-sm text-black uppercase tracking-tight">{edu.qualification}</h4>
                                            <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mt-1">{edu.institution} {edu.field_of_study ? `• ${edu.field_of_study}` : ''}</p>
                                            {edu.grade && <p className="text-[10px] text-zinc-400 mt-1 italic font-medium">Grade: {edu.grade}</p>}
                                        </div>
                                        <span className="text-[9px] font-bold text-zinc-400 shrink-0 uppercase tracking-widest">
                                            {formatRange(edu.start_date, edu.end_date, false)}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-xs text-zinc-500 italic">No education history listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Skills & Documents */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 text-zinc-400">Core Skills</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.length > 0 ? skills.map((skill) => (
                                        <span key={skill.id} className="bg-zinc-100 border border-zinc-200 px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm text-black">
                                            {skill.name} {skill.level ? `• ${skill.level}` : ''}
                                        </span>
                                    )) : (
                                        <p className="text-xs text-zinc-500 italic">No skills listed.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 text-zinc-400">Shared Documents</h3>
                                <div className="space-y-2">
                                    {documents.length > 0 ? documents.map((doc) => (
                                        <div 
                                            key={doc.id} 
                                            onClick={() => togglePreview(doc.id)}
                                            className={`flex items-center justify-between p-2.5 border rounded-sm transition-colors group cursor-pointer ${activeDocumentId === doc.id && previewOpen ? 'border-black bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'}`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <FileText className="text-zinc-400 h-4 w-4" />
                                                <span className="text-xs font-bold text-black truncate max-w-[150px] sm:max-w-[200px]">{doc.file_name}</span>
                                            </div>
                                            <a 
                                                href={doc.download_url} 
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-1 rounded-sm text-zinc-400 hover:bg-zinc-200 hover:text-black transition-colors"
                                            >
                                                <Download className="h-3.5 w-3.5 shrink-0" />
                                            </a>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-zinc-500 italic">No documents shared.</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="col-span-12 lg:col-span-4 space-y-6">
                        
                        {/* Application Snapshot */}
                        <div className="bg-white p-5 border border-zinc-200 shadow-sm rounded-sm">
                            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 text-zinc-400">Snapshot</h3>
                            <div className="space-y-3">
                                <SnapshotRow label="Vacancy" value={application.vacancy_title} />
                                <SnapshotRow label="Applied" value={application.applied_at ? moment(application.created_at).format('MMM D, YYYY') : 'N/A'} />
                                <div className="flex justify-between items-center py-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
                                    <EmployerStatusBadge status={application.status} />
                                </div>
                            </div>
                            
                            {application.match?.label && application.match.reasons.length > 0 && (
                                <div className="mt-5 pt-5 border-t border-zinc-100">
                                    <h4 className="text-[9px] font-black tracking-[0.2em] uppercase mb-3 text-zinc-400">Match Analysis</h4>
                                    <ul className="space-y-2">
                                        {application.match.reasons.map((reason, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5 text-xs text-zinc-600 leading-tight font-medium">
                                                <CheckCircle2 className="text-emerald-500 h-3.5 w-3.5 shrink-0 mt-0.5" />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Cover Letter */}
                        {application.cover_letter && (
                            <div className="p-5 border-l-2 border-black bg-zinc-50">
                                <h3 className="text-xs font-semibold tracking-widest uppercase mb-2.5 text-zinc-400">Cover Letter</h3>
                                <p className="text-xs text-zinc-600 italic leading-relaxed whitespace-pre-wrap">
                                    "{application.cover_letter}"
                                </p>
                            </div>
                        )}

                        {/* Schedule Interview Form */}
                        <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-sm shadow-sm" id="schedule-interview">
                            <h3 className="text-xs font-semibold tracking-widest uppercase mb-4 text-zinc-400">Schedule Interview</h3>
                            <form onSubmit={submitInterview} className="space-y-3">
                                <ScheduleField label="Date & Time" error={scheduleForm.errors.scheduled_at}>
                                    <input 
                                        type="datetime-local" 
                                        value={scheduleForm.data.scheduled_at} 
                                        onChange={(e) => scheduleForm.setData('scheduled_at', e.target.value)} 
                                        className="w-full rounded-sm border border-zinc-200 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-black focus:border-black transition-all" 
                                    />
                                </ScheduleField>
                                <ScheduleField label="Meeting Type" error={scheduleForm.errors.meeting_type}>
                                    <Select
                                        value={scheduleForm.data.meeting_type}
                                        onValueChange={(value) => scheduleForm.setData('meeting_type', value)}
                                    >
                                        <SelectTrigger className="h-8 w-full rounded-sm border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-black shadow-none focus:ring-1 focus:ring-black focus:ring-offset-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                        {meetingTypes.map((type) => (
                                            <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                </ScheduleField>
                                <ScheduleField label="Location / Link" error={scheduleForm.errors.location}>
                                    <input 
                                        type="text" 
                                        value={scheduleForm.data.location} 
                                        onChange={(e) => scheduleForm.setData('location', e.target.value)} 
                                        placeholder="https://zoom.us/j/..." 
                                        className="w-full rounded-sm border border-zinc-200 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-black focus:border-black transition-all" 
                                    />
                                </ScheduleField>
                                <ScheduleField label="Notes" error={scheduleForm.errors.instructions}>
                                    <textarea 
                                        rows={2} 
                                        value={scheduleForm.data.instructions} 
                                        onChange={(e) => scheduleForm.setData('instructions', e.target.value)} 
                                        placeholder="Enter instructions..." 
                                        className="w-full rounded-sm border border-zinc-200 bg-white px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-black focus:border-black transition-all resize-none" 
                                    />
                                </ScheduleField>
                                <Button
                                    type="submit" 
                                    disabled={scheduleForm.processing}
                                    className="mt-1.5 h-8 w-full rounded-sm text-[9px] font-black tracking-[0.2em] uppercase"
                                >
                                    Confirm Schedule
                                </Button>
                            </form>
                        </div>

                        {/* Interview History */}
                        {interviews.length > 0 && (
                            <div>
                                <h3 className="text-xs font-semibold tracking-widest uppercase mb-3 text-zinc-400">Interview History</h3>
                                <div className="space-y-2.5">
                                    {interviews.map((interview) => (
                                        <div key={interview.id} className="flex items-center gap-3 p-3 border border-zinc-200 bg-white rounded-sm shadow-sm">
                                            <div className="bg-zinc-100 p-1.5 rounded-sm shrink-0">
                                                <Mic className="h-4 w-4 text-zinc-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold text-black truncate">{interview.scheduled_at_label}</p>
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 truncate">{interview.meeting_type.replace('_', ' ')}</p>
                                            </div>
                                            <EmployerStatusBadge status={interview.status_label ?? interview.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
            
            <DocumentPreviewDialog document={activeDocument} open={previewOpen} onOpenChange={setPreviewOpen} />
        </EmployerHubLayout>
    );
}

/* --- Helper Components --- */

function SummaryBox({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="bg-zinc-50 p-4">
            <p className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">{label}</p>
            <p className="font-bold text-sm text-black truncate">{value || 'N/A'}</p>
        </div>
    );
}

function SnapshotRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex justify-between items-center py-1.5 border-b border-zinc-100 last:border-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-black text-right max-w-[60%] truncate">{value || 'N/A'}</span>
        </div>
    );
}

function ScheduleField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 mb-1.5">{label}</label>
            {children}
            <InputError message={error} className="mt-1" />
        </div>
    );
}

function formatRange(start?: string | null, end?: string | null, current?: boolean): string {
    if (!start && !end && !current) return 'Not provided';
    const startLabel = start ? moment(start).format('YYYY') : 'Unknown';
    const endLabel = current ? 'Present' : end ? moment(end).format('YYYY') : 'Unknown';
    return `${startLabel} — ${endLabel}`;
}

function getInitials(name: string): string {
    if (!name) return 'EX';
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}
