import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Clock, Filter, MapPin, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketplaceHeader, Reveal } from '@/pages/Public/components/marketplace';

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
};

type Props = {
    jobs: Job[];
    filters: {
        q?: string;
        location?: string;
        work_mode?: string;
    };
};

const workModes = ['All', 'Remote', 'Hybrid', 'On-Site'] as const;

const workModeLabels: Record<string, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-Site',
};

const labelToParam: Record<(typeof workModes)[number], string> = {
    All: '',
    Remote: 'remote',
    Hybrid: 'hybrid',
    'On-Site': 'onsite',
};

export default function SearchResults({ jobs, filters }: Props) {
    const initialQuery = filters.q ?? '';
    const initialLocation = filters.location ?? '';
    const initialMode = workModeLabels[filters.work_mode ?? ''] ?? 'All';

    const [query, setQuery] = useState(initialQuery);
    const [location, setLocation] = useState(initialLocation);
    const [activeMode, setActiveMode] = useState<(typeof workModes)[number]>(initialMode as (typeof workModes)[number]);

    useEffect(() => {
        setQuery(initialQuery);
        setLocation(initialLocation);
        setActiveMode(initialMode as (typeof workModes)[number]);
    }, [initialLocation, initialMode, initialQuery]);

    const results = useMemo(() => {
        const q = query.toLowerCase().trim();
        const loc = location.toLowerCase().trim();

        return jobs.filter((job) => {
            const matchesQuery =
                !q ||
                job.title.toLowerCase().includes(q) ||
                job.company_name.toLowerCase().includes(q) ||
                job.tags.some((tag) => tag.toLowerCase().includes(q)) ||
                job.description.toLowerCase().includes(q);

            const matchesLocation =
                !loc ||
                job.location.toLowerCase().includes(loc) ||
                (loc === 'remote' && job.work_mode === 'Remote');

            const matchesMode = activeMode === 'All' || job.work_mode === activeMode;

            return matchesQuery && matchesLocation && matchesMode;
        });
    }, [activeMode, jobs, location, query]);

    const visitSearch = (nextQuery: string, nextLocation: string, nextMode: (typeof workModes)[number]) => {
        const params: Record<string, string> = {};

        if (nextQuery.trim()) {
            params.q = nextQuery.trim();
        }

        if (nextLocation.trim()) {
            params.location = nextLocation.trim();
        }

        const workMode = labelToParam[nextMode];

        if (workMode) {
            params.work_mode = workMode;
        }

        router.get('/search', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = () => {
        visitSearch(query, location, activeMode);
    };

    const handleModeChange = (mode: (typeof workModes)[number]) => {
        setActiveMode(mode);
        visitSearch(query, location, mode);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const clearFilters = () => {
        setQuery('');
        setLocation('');
        setActiveMode('All');
        router.get('/search', {}, { replace: true, preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-background">
            <Head title="Search Jobs" />

            <MarketplaceHeader backHref="/" backLabel="Back" />

            <div className="border-b border-border bg-secondary/50">
                <div className="container mx-auto px-6 py-6">
                    <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-3 rounded-xl border border-border bg-background p-2 shadow-sm sm:flex-row">
                        <div className="flex flex-1 items-center gap-2 px-3">
                            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <input
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Job title, skill, or keyword…"
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                            {query ? (
                                <button
                                    type="button"
                                    onClick={() => setQuery('')}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            ) : null}
                        </div>

                        <div className="hidden flex-1 items-center gap-2 border-l border-border px-3 sm:flex">
                            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <input
                                type="text"
                                value={location}
                                onChange={(event) => setLocation(event.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Location or Remote"
                                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                            />
                            {location ? (
                                <button
                                    type="button"
                                    onClick={() => setLocation('')}
                                    className="text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            ) : null}
                        </div>

                        <Button className="sm:px-8" onClick={handleSearch}>
                            Search
                        </Button>
                    </div>

                    <div className="mx-auto mt-4 flex max-w-3xl items-center gap-2">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                        {workModes.map((mode) => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => handleModeChange(mode)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                    activeMode === mode
                                        ? 'bg-primary text-primary-foreground'
                                        : 'border border-border bg-background text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                <p className="mb-6 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{results.length}</span>{' '}
                    {results.length === 1 ? 'result' : 'results'} found
                    {query ? (
                        <>
                            {' '}
                            for "<span className="text-primary">{query}</span>"
                        </>
                    ) : null}
                    {location ? (
                        <>
                            {' '}
                            in "<span className="text-primary">{location}</span>"
                        </>
                    ) : null}
                </p>

                {results.length === 0 ? (
                    <Reveal>
                        <div className="py-20 text-center">
                            <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">No jobs found</h3>
                            <p className="mb-6 text-sm text-muted-foreground">Try adjusting your search terms or filters.</p>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear all filters
                            </Button>
                        </div>
                    </Reveal>
                ) : (
                    <div className="max-w-3xl space-y-4">
                        {results.map((job, index) => (
                            <Reveal key={job.id} delay={Math.min(index * 0.04, 0.3)}>
                                <Link href={`/jobs/${job.id}`} className="block">
                                    <motion.div
                                        whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
                                        className="group cursor-pointer rounded-xl border border-border bg-card p-6 transition-shadow hover:border-primary/30 hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0 flex-1">
                                                <div className="mb-2 flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-semibold text-primary">
                                                        {job.company_name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                                                            {job.title}
                                                        </h3>
                                                        <p className="text-xs text-muted-foreground">{job.company_name}</p>
                                                    </div>
                                                </div>

                                                <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                                    {job.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.tags.map((tag) => (
                                                        <Badge key={tag} variant="secondary" className="text-[10px]">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="hidden shrink-0 flex-col items-end gap-2 text-right sm:flex">
                                                <span className="text-sm font-semibold text-foreground">{job.salary}</span>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="h-3 w-3" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {job.work_mode}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[10px]">
                                                        {job.type}
                                                    </Badge>
                                                </div>
                                                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {job.posted}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3 sm:hidden">
                                            <span className="text-xs font-medium text-foreground">{job.salary}</span>
                                            <span className="text-xs text-muted-foreground">· {job.location}</span>
                                            <Badge variant="outline" className="text-[10px]">
                                                {job.work_mode}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">{job.posted}</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
