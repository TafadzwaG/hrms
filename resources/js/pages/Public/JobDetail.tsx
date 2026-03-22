import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertCircle, Bookmark, Briefcase, CheckCircle2, Clock, DollarSign, Globe, MapPin, Share2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketplaceHeader, Reveal } from '@/pages/Public/components/marketplace';

type RelatedJob = {
    id: number;
    title: string;
    company_name: string;
    location: string;
};

type Job = {
    id: number;
    title: string;
    company_name: string;
    description: string;
    location: string;
    salary: string;
    work_mode: string;
    type: string;
    posted: string;
    tags: string[];
    responsibilities: string[];
    requirements: string[];
    company: {
        name: string;
        initials: string;
        industry: string;
        size: string;
        description: string;
        website?: string | null;
    };
};

type ApplyAction = {
    type: 'link' | 'post' | 'disabled';
    href: string | null;
    label: string;
    helper: string;
};

type Props = {
    job: Job | null;
    relatedJobs: RelatedJob[];
    applyAction: ApplyAction;
};

type SharedPageProps = {
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    errors?: Record<string, string | undefined>;
};

const savedJobsStorageKey = 'hrx-saved-jobs';

function readSavedJobs(): number[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const saved = window.localStorage.getItem(savedJobsStorageKey);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed.filter((value): value is number => typeof value === 'number') : [];
    } catch {
        return [];
    }
}

function writeSavedJobs(ids: number[]) {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(savedJobsStorageKey, JSON.stringify(ids));
}

export default function JobDetail({ job, relatedJobs, applyAction }: Props) {
    const [savedJobs, setSavedJobs] = useState<number[]>([]);
    const [isApplying, setIsApplying] = useState(false);
    const { flash, errors } = usePage<SharedPageProps>().props;

    useEffect(() => {
        setSavedJobs(readSavedJobs());
    }, []);

    const isSaved = useMemo(() => (job ? savedJobs.includes(job.id) : false), [job, savedJobs]);
    const firstError = errors
        ? (Object.values(errors as Record<string, unknown>).find(
              (message): message is string => typeof message === 'string' && message.length > 0,
          ) ?? null)
        : null;
    const applyFeedback = flash?.success
        ? { tone: 'success' as const, message: flash.success }
        : flash?.error
          ? { tone: 'error' as const, message: flash.error }
          : firstError
            ? { tone: 'error' as const, message: firstError }
            : null;

    if (!job) {
        return (
            <div className="min-h-screen bg-background">
                <Head title="Job Not Found" />
                <MarketplaceHeader backHref="/search" backLabel="All Jobs" />

                <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
                    <div className="text-center">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">Job not found</h2>
                        <p className="mb-6 text-muted-foreground">This listing may have been removed or does not exist.</p>
                        <Button asChild>
                            <Link href="/search">Back to Jobs</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const toggleSaved = () => {
        const next = isSaved ? savedJobs.filter((id) => id !== job.id) : [...savedJobs, job.id];
        setSavedJobs(next);
        writeSavedJobs(next);
    };

    const shareJob = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : `/jobs/${job.id}`;

        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            await navigator.share({
                title: job.title,
                text: `${job.title} at ${job.company_name}`,
                url: shareUrl,
            });

            return;
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(shareUrl);
        }
    };

    const applyNow = () => {
        if (applyAction.type === 'post' && applyAction.href) {
            router.post(applyAction.href, {}, {
                preserveScroll: true,
                onStart: () => setIsApplying(true),
                onFinish: () => setIsApplying(false),
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title={job.title} />

            <MarketplaceHeader backHref="/search" backLabel="All Jobs" />

            <div className="container mx-auto px-6 py-10">
                <div className="mx-auto max-w-4xl">
                    <Reveal>
                        <div className="mb-8 rounded-xl border border-border bg-card p-8">
                            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary font-mono text-lg font-bold text-primary">
                                        {job.company_name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h1 className="mb-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                            {job.title}
                                        </h1>
                                        <p className="text-muted-foreground">{job.company_name}</p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={toggleSaved}>
                                        <Bookmark className="h-4 w-4" />
                                        {isSaved ? 'Saved' : 'Save'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => void shareJob()}>
                                        <Share2 className="h-4 w-4" />
                                        Share
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6">
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <DollarSign className="h-4 w-4" />
                                    {job.salary}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {job.location}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    {job.type}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Globe className="h-4 w-4" />
                                    {job.work_mode}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Posted {job.posted}
                                </span>
                            </div>
                        </div>
                    </Reveal>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="space-y-8 lg:col-span-2">
                            <Reveal delay={0.1}>
                                <div className="rounded-xl border border-border bg-card p-8">
                                    <h2 className="mb-4 text-lg font-semibold text-foreground">About the Role</h2>
                                    <p className="mb-6 leading-relaxed text-muted-foreground">{job.description}</p>

                                    <h3 className="mb-3 font-semibold text-foreground">Key Responsibilities</h3>
                                    <ul className="mb-6 space-y-2">
                                        {job.responsibilities.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 className="mb-3 font-semibold text-foreground">Requirements</h3>
                                    <ul className="space-y-2">
                                        {job.requirements.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>

                            <Reveal delay={0.15}>
                                <div className="rounded-xl border border-border bg-card p-8">
                                    <h2 className="mb-4 text-lg font-semibold text-foreground">Skills & Technologies</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="px-3 py-1 text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                        </div>

                        <div className="space-y-6">
                            <Reveal delay={0.1}>
                                <div className="rounded-xl border border-border bg-card p-6">
                                    {applyAction.type === 'link' && applyAction.href ? (
                                        <Button asChild className="mb-3 w-full">
                                            <Link href={applyAction.href}>{applyAction.label}</Link>
                                        </Button>
                                    ) : (
                                        <Button
                                            className="mb-3 w-full"
                                            onClick={applyNow}
                                            disabled={applyAction.type === 'disabled' || isApplying}
                                        >
                                            {isApplying ? 'Applying...' : applyAction.label}
                                        </Button>
                                    )}
                                    <p className="text-center text-[11px] text-muted-foreground">{applyAction.helper}</p>
                                    {applyFeedback ? (
                                        <div
                                            className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs ${
                                                applyFeedback.tone === 'success'
                                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                    : 'border-red-200 bg-red-50 text-red-700'
                                            }`}
                                        >
                                            {applyFeedback.tone === 'success' ? (
                                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                            ) : (
                                                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                            )}
                                            <span>{applyFeedback.message}</span>
                                        </div>
                                    ) : null}
                                </div>
                            </Reveal>

                            <Reveal delay={0.15}>
                                <div className="rounded-xl border border-border bg-card p-6">
                                    <h3 className="mb-4 text-sm font-semibold text-foreground">About {job.company.name}</h3>
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-primary">
                                            {job.company.initials}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{job.company.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {job.company.industry} · {job.company.size}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">{job.company.description}</p>
                                    {job.company.website ? (
                                        <a
                                            href={job.company.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-flex text-xs text-primary transition-colors hover:underline"
                                        >
                                            Visit company website
                                        </a>
                                    ) : null}
                                </div>
                            </Reveal>

                            {relatedJobs.length > 0 ? (
                                <Reveal delay={0.2}>
                                    <div className="rounded-xl border border-border bg-card p-6">
                                        <h3 className="mb-4 text-sm font-semibold text-foreground">Similar Roles</h3>
                                        <div className="space-y-3">
                                            {relatedJobs.map((relatedJob) => (
                                                <Link key={relatedJob.id} href={`/jobs/${relatedJob.id}`} className="group block">
                                                    <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                                                        {relatedJob.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {relatedJob.company_name} · {relatedJob.location}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </Reveal>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

