import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Eye,
    GraduationCap,
    MapPin,
    MoreHorizontal,
    RotateCcw,
    Search,
    Tags,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';

type CandidateCard = {
    id: number;
    full_name: string;
    headline: string | null;
    location: string | null;
    years_experience: number | null;
    highest_education: string | null;
    skills: { id: number; name: string }[];
};

type DirectoryPageProps = {
    candidates: {
        data: CandidateCard[];
        total: number;
        current_page: number;
        last_page: number;
        from?: number;
        to?: number;
        per_page?: number;
    };
    filters: {
        search?: string | null;
        education?: string | null;
        experience_min?: string | null;
        experience_max?: string | null;
        location?: string | null;
    };
};

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function DirectoryIndex() {
    const { candidates, filters } = usePage<DirectoryPageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [education, setEducation] = useState(filters.education ?? 'all');
    const [experienceMin, setExperienceMin] = useState(filters.experience_min ?? '');
    const [experienceMax, setExperienceMax] = useState(filters.experience_max ?? '');
    const [location, setLocation] = useState(filters.location ?? '');
    const [showFilters, setShowFilters] = useState(false);

    const initialRender = useRef(true);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        const timer = window.setTimeout(() => {
            router.get(
                '/recruitment/directory',
                {
                    search: search || undefined,
                    education: education !== 'all' ? education : undefined,
                    experience_min: experienceMin || undefined,
                    experience_max: experienceMax || undefined,
                    location: location || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, education, experienceMin, experienceMax, location]);

    const handleResetFilters = () => {
        setSearch('');
        setEducation('all');
        setExperienceMin('');
        setExperienceMax('');
        setLocation('');
        setShowFilters(false);
    };

    const handlePageChange = ({ selected }: { selected: number }) => {
        router.get(
            '/recruitment/directory',
            {
                page: selected + 1,
                search: search || undefined,
                education: education !== 'all' ? education : undefined,
                experience_min: experienceMin || undefined,
                experience_max: experienceMax || undefined,
                location: location || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const perPage = candidates.per_page ?? (candidates.data.length || 1);
    const showingFrom =
        candidates.from ??
        (candidates.total === 0 ? 0 : (candidates.current_page - 1) * perPage + 1);
    const showingTo =
        candidates.to ?? Math.min(candidates.current_page * perPage, candidates.total);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidate Directory' },
            ]}
        >
            <Head title="Candidate Directory" />

            <div className="w-full space-y-6 bg-white p-4 lg:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                            Candidate Directory
                        </h1>
                        <p className="text-lg text-zinc-500">
                            Browse active paid candidate profiles.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <Input
                                placeholder="Search by name, headline, or skills..."
                                className="h-11 border-zinc-200 pl-10 focus:ring-zinc-900"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="h-11 border-zinc-200"
                                onClick={() => setShowFilters((current) => !current)}
                                type="button"
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" /> More Filters
                            </Button>
                            <Button
                                variant="ghost"
                                className="h-11 text-zinc-500"
                                onClick={handleResetFilters}
                                type="button"
                            >
                                <RotateCcw className="mr-2 h-4 w-4" /> Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 gap-4 rounded-md border border-zinc-200 bg-zinc-50/40 p-4 md:grid-cols-4">
                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Education</p>
                                <Select value={education} onValueChange={setEducation}>
                                    <SelectTrigger className="h-11 border-zinc-200 bg-white">
                                        <SelectValue placeholder="All levels" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All levels</SelectItem>
                                        <SelectItem value="high_school">High School</SelectItem>
                                        <SelectItem value="diploma">Diploma</SelectItem>
                                        <SelectItem value="bachelors">Bachelors</SelectItem>
                                        <SelectItem value="masters">Masters</SelectItem>
                                        <SelectItem value="doctorate">Doctorate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Min Experience (years)</p>
                                <Input
                                    type="number"
                                    min="0"
                                    className="h-11 border-zinc-200 bg-white"
                                    value={experienceMin}
                                    onChange={(e) => setExperienceMin(e.target.value)}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Max Experience (years)</p>
                                <Input
                                    type="number"
                                    min="0"
                                    className="h-11 border-zinc-200 bg-white"
                                    value={experienceMax}
                                    onChange={(e) => setExperienceMax(e.target.value)}
                                    placeholder="50"
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">Location</p>
                                <Input
                                    className="h-11 border-zinc-200 bg-white"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Filter by location"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Candidate Grid */}
                {candidates.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-lg text-zinc-400">No candidates found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {candidates.data.map((candidate) => (
                            <Card
                                key={candidate.id}
                                className="group relative overflow-hidden border-zinc-200 shadow-sm transition-all hover:shadow-md"
                            >
                                <CardContent className="space-y-4 p-6">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-zinc-900 transition-colors group-hover:text-zinc-600">
                                            {candidate.full_name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 line-clamp-2">
                                            {candidate.headline ?? 'No headline'}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        {candidate.location && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {candidate.location}
                                            </div>
                                        )}
                                        {candidate.years_experience != null && (
                                            <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                <GraduationCap className="h-3.5 w-3.5" />
                                                {candidate.years_experience} years experience
                                            </div>
                                        )}
                                        {candidate.highest_education && (
                                            <Badge variant="outline" className="border-transparent bg-blue-100 text-blue-700 text-xs font-semibold">
                                                {formatLabel(candidate.highest_education)}
                                            </Badge>
                                        )}
                                    </div>

                                    {(candidate.skills ?? []).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 border-t border-zinc-100 pt-3">
                                            {candidate.skills.slice(0, 4).map((skill) => (
                                                <span
                                                    key={skill.id}
                                                    className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600"
                                                >
                                                    <Tags className="h-2.5 w-2.5" />
                                                    {skill.name}
                                                </span>
                                            ))}
                                            {candidate.skills.length > 4 && (
                                                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500">
                                                    +{candidate.skills.length - 4}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="border-t border-dashed border-zinc-200 pt-4">
                                        <Link href={`/recruitment/directory/${candidate.id}`}>
                                            <Button variant="outline" className="h-9 w-full border-zinc-200 text-sm">
                                                <Eye className="mr-2 h-4 w-4" /> View Profile
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 md:flex-row">
                    <p className="text-sm font-medium text-zinc-500">
                        Showing{' '}
                        <span className="text-zinc-900">
                            {showingFrom}-{showingTo}
                        </span>{' '}
                        of <span className="text-zinc-900">{candidates.total}</span> candidates
                    </p>
                    <ReactPaginate
                        pageCount={candidates.last_page}
                        forcePage={Math.max((candidates.current_page ?? 1) - 1, 0)}
                        onPageChange={handlePageChange}
                        containerClassName="flex gap-1"
                        pageLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition-colors hover:bg-zinc-50"
                        activeLinkClassName="!border-zinc-900 !bg-zinc-900 !text-white"
                        previousLabel="←"
                        nextLabel="→"
                        previousLinkClassName="mr-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        nextLinkClassName="ml-2 flex h-10 items-center justify-center rounded-md border px-4 text-sm font-bold"
                        disabledClassName="pointer-events-none opacity-30"
                        breakLabel="..."
                        breakLinkClassName="flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold"
                        marginPagesDisplayed={1}
                        pageRangeDisplayed={3}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
