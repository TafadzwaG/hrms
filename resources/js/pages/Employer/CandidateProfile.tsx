import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar as CalendarIcon, CheckCircle2, Download, FileText, Mic } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

import { DocumentPreviewDialog } from '@/components/document-preview-dialog';
import InputError from '@/components/input-error';
import { EmployerHubLayout, EmployerStatusBadge } from './components/hub';
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
            subtitle='Candidate Profile'
            company={company}
            user={user}
        >
            <div className="w-full px-6 md:px-10">
                {/* Profile Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-3xl font-bold rounded-sm shrink-0">
                            {getInitials(candidate.full_name)}
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-5xl font-black tracking-tighter text-black">{candidate.full_name}</h2>
                                {application.match_score ? (
                                    <span className="bg-black text-white px-3 py-1 text-xs font-black tracking-widest uppercase rounded-sm">
                                        {application.match_score}% Match
                                    </span>
                                ) : null}
                            </div>
                            <p className="text-zinc-500 text-lg font-medium mt-1">{candidate.headline || 'Candidate Profile'}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/employer/candidates">
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-zinc-300 text-black font-bold text-xs tracking-widest uppercase hover:bg-zinc-50 transition-colors rounded-sm">
                                <ArrowLeft className="h-4 w-4" /> Back to Candidates
                            </button>
                        </Link>
                        <Link href="/employer/interviews">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-opacity rounded-sm">
                                <CalendarIcon className="h-4 w-4" /> All Interviews
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Two-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Main Content (Left) */}
                    <div className="col-span-12 lg:col-span-8 space-y-12">
                        
                        {/* Professional Summary */}
                        <section>
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-6 text-zinc-400">Professional Summary</h3>
                            <p className="text-black text-lg leading-relaxed mb-8 max-w-3xl">
                                {candidate.professional_summary || 'No professional summary provided.'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-200 rounded-sm overflow-hidden border border-zinc-200">
                                <SummaryBox label="Email Address" value={candidate.email} />
                                <SummaryBox label="Phone Number" value={candidate.phone} />
                                <SummaryBox label="Current Location" value={candidate.location} />
                                <SummaryBox label="Expected Salary" value={candidate.expected_salary ? `${candidate.salary_currency ?? 'USD'} ${candidate.expected_salary}` : 'Not specified'} />
                            </div>
                        </section>

                        {/* Work Experience */}
                        <section>
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-8 text-zinc-400">Work Experience</h3>
                            <div className="space-y-10">
                                {experiences.length > 0 ? experiences.map((exp, idx) => (
                                    <div key={exp.id} className="relative pl-8 before:content-[''] before:absolute before:left-0 before:top-2 before:w-[2px] before:h-full before:bg-zinc-200">
                                        <div className={`absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-black' : 'bg-zinc-300'}`}></div>
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                                            <h4 className="text-xl font-bold text-black">{exp.job_title}</h4>
                                            <span className="text-xs font-black tracking-widest text-zinc-500 bg-zinc-100 px-2 py-1 uppercase rounded-sm">
                                                {formatRange(exp.start_date, exp.end_date, exp.currently_working)}
                                            </span>
                                        </div>
                                        <p className="font-bold text-sm text-zinc-500 mb-4 uppercase tracking-wider">{exp.employer_name}</p>
                                        {exp.description && (
                                            <p className="text-zinc-600 leading-relaxed text-sm">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-sm text-zinc-500 italic">No work experience listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-8 text-zinc-400">Education</h3>
                            <div className="space-y-4">
                                {educations.length > 0 ? educations.map((edu, idx) => (
                                    <div key={edu.id} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-6 bg-zinc-50 rounded-sm gap-4 ${idx === 0 ? 'border-l-4 border-black' : 'border border-zinc-200'}`}>
                                        <div>
                                            <h4 className="font-bold text-black">{edu.qualification}</h4>
                                            <p className="text-sm text-zinc-500 mt-1">{edu.institution} {edu.field_of_study ? `• ${edu.field_of_study}` : ''}</p>
                                            {edu.grade && <p className="text-xs text-zinc-400 mt-2 italic font-medium">Grade: {edu.grade}</p>}
                                        </div>
                                        <span className="text-xs font-bold text-zinc-400 shrink-0">
                                            {formatRange(edu.start_date, edu.end_date, false)}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-zinc-500 italic">No education history listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Skills & Documents */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-6 text-zinc-400">Core Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.length > 0 ? skills.map((skill) => (
                                        <span key={skill.id} className="bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-sm text-black">
                                            {skill.name} {skill.level ? `• ${skill.level}` : ''}
                                        </span>
                                    )) : (
                                        <p className="text-sm text-zinc-500 italic">No skills listed.</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-6 text-zinc-400">Shared Documents</h3>
                                <div className="space-y-3">
                                    {documents.length > 0 ? documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className={`flex w-full items-center justify-between gap-4 rounded-sm border p-3 text-left transition-colors ${
                                                activeDocument?.id === doc.id && previewOpen
                                                    ? 'border-black bg-zinc-50'
                                                    : 'border-zinc-200 hover:bg-zinc-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-zinc-400 h-5 w-5" />
                                                <div className="min-w-0">
                                                    <span className="block truncate text-sm font-semibold text-black max-w-[180px] sm:max-w-xs">{doc.file_name}</span>
                                                    <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                                        {[doc.document_type, doc.uploaded_at, doc.is_primary ? 'Primary' : null].filter(Boolean).join(' • ')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => togglePreview(doc.id)}
                                                    className={`rounded-sm px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${
                                                        activeDocument?.id === doc.id && previewOpen
                                                            ? 'bg-black text-white hover:bg-zinc-800'
                                                            : 'border border-zinc-200 bg-white text-zinc-600 hover:border-black hover:text-black'
                                                    }`}
                                                >
                                                    {activeDocument?.id === doc.id && previewOpen ? 'Close Preview' : 'Open Preview'}
                                                </button>
                                                <a
                                                    href={doc.download_url}
                                                    className="rounded-sm p-2 text-zinc-300 transition-colors hover:bg-white hover:text-black"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-zinc-500 italic">No documents shared.</p>
                                    )}
                                </div>

                            </div>
                        </section>
                    </div>

                    {/* Sidebar (Right) */}
                    <aside className="col-span-12 lg:col-span-4 space-y-10">
                        
                        {/* Application Snapshot */}
                        <div className="bg-white p-8 border border-zinc-200 shadow-sm rounded-sm">
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-6 text-zinc-400">Application Snapshot</h3>
                            <div className="space-y-4">
                                <SnapshotRow label="Vacancy" value={application.vacancy_title} />
                                <SnapshotRow label="Applied Date" value={formatCandidateDate(application.applied_at)} />
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-xs font-medium text-zinc-500">Status</span>
                                    <EmployerStatusBadge status={application.status} />
                                </div>
                            </div>
                            
                            {application.match?.label && application.match.reasons.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-zinc-200">
                                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase mb-4 text-zinc-400">Match Analysis</h4>
                                    <ul className="space-y-3">
                                        {application.match.reasons.map((reason, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-zinc-600 leading-tight">
                                                <CheckCircle2 className="text-black h-4 w-4 shrink-0" />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Cover Letter */}
                        {application.cover_letter && (
                            <div className="p-8 border-l-2 border-black bg-zinc-50">
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-4 text-zinc-400">Cover Letter</h3>
                                <p className="text-sm text-zinc-600 italic leading-relaxed whitespace-pre-wrap">
                                    "{application.cover_letter}"
                                </p>
                            </div>
                        )}

                        {/* Schedule Interview Form */}
                        <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-sm">
                            <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-6 text-zinc-400">Schedule Interview</h3>
                            <form onSubmit={submitInterview} className="space-y-4">
                                <ScheduleField label="Date & Time" error={scheduleForm.errors.scheduled_at}>
                                    <input 
                                        type="datetime-local" 
                                        value={scheduleForm.data.scheduled_at} 
                                        onChange={(e) => scheduleForm.setData('scheduled_at', e.target.value)} 
                                        className="w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black transition-all" 
                                    />
                                </ScheduleField>
                                <ScheduleField label="Meeting Type" error={scheduleForm.errors.meeting_type}>
                                    <select 
                                        value={scheduleForm.data.meeting_type} 
                                        onChange={(e) => scheduleForm.setData('meeting_type', e.target.value)} 
                                        className="w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black transition-all"
                                    >
                                        {meetingTypes.map((type) => (
                                            <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                        ))}
                                    </select>
                                </ScheduleField>
                                <ScheduleField label="Location / Link" error={scheduleForm.errors.location}>
                                    <input 
                                        type="text" 
                                        value={scheduleForm.data.location} 
                                        onChange={(e) => scheduleForm.setData('location', e.target.value)} 
                                        placeholder="https://zoom.us/j/..." 
                                        className="w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black transition-all" 
                                    />
                                </ScheduleField>
                                <ScheduleField label="Additional Instructions" error={scheduleForm.errors.instructions}>
                                    <textarea 
                                        rows={3} 
                                        value={scheduleForm.data.instructions} 
                                        onChange={(e) => scheduleForm.setData('instructions', e.target.value)} 
                                        placeholder="Enter notes for candidate..." 
                                        className="w-full bg-white border border-zinc-300 rounded-sm px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black transition-all resize-none" 
                                    />
                                </ScheduleField>
                                <button 
                                    type="submit" 
                                    disabled={scheduleForm.processing}
                                    className="w-full mt-2 bg-black text-white py-3.5 rounded-sm font-black text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                >
                                    Confirm Schedule
                                </button>
                            </form>
                        </div>

                        {/* Interview History */}
                        {interviews.length > 0 && (
                            <div>
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase mb-6 text-zinc-400">Interview History</h3>
                                <div className="space-y-4">
                                    {interviews.map((interview) => (
                                        <div key={interview.id} className="flex items-center gap-4 p-4 border border-zinc-200 bg-white rounded-sm">
                                            <div className="bg-zinc-100 p-2 rounded-sm shrink-0">
                                                <Mic className="h-5 w-5 text-zinc-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-black truncate">{interview.scheduled_at_label}</p>
                                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5 truncate">{interview.meeting_type.replace('_', ' ')}</p>
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
        <div className="bg-zinc-50 p-6">
            <p className="text-[10px] font-black tracking-widest uppercase text-zinc-400 mb-1">{label}</p>
            <p className="font-semibold text-black truncate">{value || 'Not provided'}</p>
        </div>
    );
}

function SnapshotRow({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-zinc-100 last:border-0">
            <span className="text-xs font-medium text-zinc-500">{label}</span>
            <span className="text-xs font-black uppercase tracking-wider text-black text-right max-w-[60%] truncate">{value || 'N/A'}</span>
        </div>
    );
}

function ScheduleField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
    return (
        <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">{label}</label>
            {children}
            <InputError message={error} className="mt-1" />
        </div>
    );
}

function formatCandidateDate(date: string | null | undefined): string {
    if (!date) {
        return 'N/A';
    }

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        day: date.length > 7 ? 'numeric' : undefined,
    });
}

function formatRange(start?: string | null, end?: string | null, current?: boolean): string {
    if (!start && !end && !current) return 'Dates not provided';
    const startLabel = start ? new Date(start).getFullYear() : 'Unknown';
    const endLabel = current ? 'Present' : end ? new Date(end).getFullYear() : 'Unknown';
    return `${startLabel} — ${endLabel}`;
}

function getInitials(name: string): string {
    if (!name) return 'EX';
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}
