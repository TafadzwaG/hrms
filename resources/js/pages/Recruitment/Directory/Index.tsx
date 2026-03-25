import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    IndexTableCard,
    IndexTableEmptyRow,
    IndexTableHead,
    IndexTableHeaderRow,
    IndexTablePagination,
    SortableTableHead,
} from '@/components/index-table';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { buildIndexParams } from '@/lib/index-table';
import {
    Eye,
    MapPin,
    MoreHorizontal,
    RotateCcw,
    Search,
} from 'lucide-react';

type CandidateSkill = {
    id: number;
    name: string;
};

type CandidateRow = {
    id: number;
    full_name: string;
    headline: string | null;
    location: string | null;
    years_experience: number | null;
    highest_education: string | null;
    listing_activated_at?: string | null;
    skills: CandidateSkill[];
    links: {
        show: string;
    };
};

type DirectoryPageProps = {
    candidates: {
        data: CandidateRow[];
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
        sort?: string | null;
        direction?: 'asc' | 'desc' | null;
    };
    educationLevels?: string[];
};

export default function DirectoryIndex() {
    const { candidates, filters, educationLevels = [] } = usePage<DirectoryPageProps>().props;

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
                buildIndexParams(filters, {
                    search,
                    education: education !== 'all' ? education : null,
                    experience_min: experienceMin || null,
                    experience_max: experienceMax || null,
                    location: location || null,
                }),
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
        }, 300);

        return () => window.clearTimeout(timer);
    }, [education, experienceMax, experienceMin, filters, location, search]);

    const handleResetFilters = () => {
        setSearch('');
        setEducation('all');
        setExperienceMin('');
        setExperienceMax('');
        setLocation('');
        setShowFilters(false);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recruitment', href: '/recruitment' },
                { title: 'Candidate Directory' },
            ]}
        >
            <Head title="Candidate Directory" />

            <div className="w-full space-y-6 bg-muted/10 p-4 lg:p-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                        Candidate Directory
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground">
                        Review active public candidate profiles and sort them by location, experience, and education.
                    </p>
                </div>

                <section className="rounded-xl border border-border bg-background p-5 shadow-sm">
                    <div className="flex flex-col gap-4 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between">
                        <div className="w-full max-w-xl space-y-1.5">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                Search
                            </label>
                            <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by candidate name, headline, location, or skills"
                                    className="h-10 w-full border-none bg-transparent px-0 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-md border-border"
                                onClick={() => setShowFilters((current) => !current)}
                            >
                                <MoreHorizontal className="mr-2 h-4 w-4" />
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 rounded-md border-border"
                                onClick={handleResetFilters}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset
                            </Button>
                        </div>
                    </div>

                    {showFilters ? (
                        <div className="mt-5 grid gap-4 md:grid-cols-4">
                            <FilterSelect
                                label="Education"
                                value={education}
                                onChange={setEducation}
                                options={[
                                    { value: 'all', label: 'All levels' },
                                    ...educationLevels.map((item) => ({
                                        value: item,
                                        label: formatLabel(item),
                                    })),
                                ]}
                            />
                            <FilterInput
                                label="Minimum Experience"
                                value={experienceMin}
                                onChange={setExperienceMin}
                                placeholder="0"
                                type="number"
                            />
                            <FilterInput
                                label="Maximum Experience"
                                value={experienceMax}
                                onChange={setExperienceMax}
                                placeholder="20"
                                type="number"
                            />
                            <FilterInput
                                label="Location"
                                value={location}
                                onChange={setLocation}
                                placeholder="Filter by location"
                            />
                        </div>
                    ) : null}
                </section>

                <IndexTableCard>
                    <Table>
                        <TableHeader>
                            <IndexTableHeaderRow>
                                <SortableTableHead filters={filters} sortKey="full_name" path="/recruitment/directory">
                                    Candidate
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="headline" path="/recruitment/directory">
                                    Headline
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="location" path="/recruitment/directory">
                                    Location
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="years_experience" path="/recruitment/directory" align="center">
                                    Experience
                                </SortableTableHead>
                                <SortableTableHead filters={filters} sortKey="highest_education" path="/recruitment/directory">
                                    Education
                                </SortableTableHead>
                                <IndexTableHead>Skills</IndexTableHead>
                                <SortableTableHead filters={filters} sortKey="listing_activated_at" path="/recruitment/directory">
                                    Activated
                                </SortableTableHead>
                                <IndexTableHead align="right">Actions</IndexTableHead>
                            </IndexTableHeaderRow>
                        </TableHeader>
                        <TableBody>
                            {candidates.data.length === 0 ? (
                                <IndexTableEmptyRow colSpan={8}>
                                    No candidates found for the current filters.
                                </IndexTableEmptyRow>
                            ) : (
                                candidates.data.map((candidate) => (
                                    <TableRow key={candidate.id} className="border-border/60 hover:bg-muted/20">
                                        <TableCell className="py-4 align-top">
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold text-foreground">
                                                    {candidate.full_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Candidate #{candidate.id}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {candidate.headline || 'No headline provided'}
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {candidate.location ? (
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {candidate.location}
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 text-center align-top text-sm font-semibold text-foreground">
                                            {candidate.years_experience !== null && candidate.years_experience !== undefined
                                                ? `${candidate.years_experience} yrs`
                                                : '—'}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            {candidate.highest_education ? (
                                                <Badge variant="chart4">
                                                    {formatLabel(candidate.highest_education)}
                                                </Badge>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top">
                                            {candidate.skills.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {candidate.skills.slice(0, 3).map((skill) => (
                                                        <Badge key={skill.id} variant="secondary">
                                                            {skill.name}
                                                        </Badge>
                                                    ))}
                                                    {candidate.skills.length > 3 ? (
                                                        <Badge variant="outline">
                                                            +{candidate.skills.length - 3} more
                                                        </Badge>
                                                    ) : null}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No listed skills</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 align-top text-sm text-muted-foreground">
                                            {formatDate(candidate.listing_activated_at)}
                                        </TableCell>
                                        <TableCell className="py-4 text-right align-top">
                                            <Button variant="outline" className="h-8 rounded-md border-border" asChild>
                                                <Link href={candidate.links.show}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Profile
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <IndexTablePagination
                        pagination={candidates}
                        filters={filters}
                        path="/recruitment/directory"
                        label="candidates"
                    />
                </IndexTableCard>
            </div>
        </AppLayout>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
            </label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-10 border-border bg-background">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

function FilterInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    type?: string;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {label}
            </label>
            <Input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-10 border-border bg-background"
            />
        </div>
    );
}

function formatLabel(value: string) {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
    if (!value) return '—';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
