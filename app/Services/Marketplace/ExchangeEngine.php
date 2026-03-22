<?php

namespace App\Services\Marketplace;

use App\Models\CandidateProfile;
use App\Models\CompanyProfile;
use App\Models\Scopes\OrganizationScope;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyApplication;
use App\Support\Hubs\CandidateHubContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ExchangeEngine
{
    private array $candidateCache = [];

    public function __construct(
        private readonly CandidateHubContext $candidateHub,
    ) {
    }

    public function featuredVacancies(int $limit = 4): Collection
    {
        return $this->publicVacanciesQuery()
            ->limit($limit)
            ->get();
    }

    public function publicStats(): array
    {
        return [
            'candidates' => CandidateProfile::query()
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('is_public', true)
                ->where('profile_visibility_status', 'active')
                ->count(),
            'companies' => CompanyProfile::query()
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('status', 'active')
                ->count(),
            'vacancies' => Vacancy::query()
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('status', 'published')
                ->count(),
        ];
    }

    public function search(array $filters = [], ?User $user = null): Collection
    {
        $vacancies = $this->applyFilters($this->publicVacanciesQuery(), $filters)->get();
        $candidate = $this->resolveCandidate($user);

        return $candidate
            ? $this->rankVacanciesForCandidate($candidate, $vacancies)
            : $vacancies->values();
    }

    public function findPublicVacancy(int $vacancyId): ?Vacancy
    {
        return $this->publicVacanciesQuery()
            ->whereKey($vacancyId)
            ->first();
    }

    public function relatedVacancies(Vacancy $vacancy, ?User $user = null, int $limit = 3): Collection
    {
        $candidate = $this->resolveCandidate($user);

        if ($candidate) {
            return $this->recommendVacanciesForCandidate($candidate, $limit, [$vacancy->id], $vacancy);
        }

        return $this->genericRelatedVacancies($vacancy, $limit);
    }

    public function resolveCandidate(?User $user): ?CandidateProfile
    {
        if (! $user) {
            return null;
        }

        $cacheKey = (string) $user->getKey();

        if (! array_key_exists($cacheKey, $this->candidateCache)) {
            $this->candidateCache[$cacheKey] = $this->candidateHub->findProfile($user);
        }

        return $this->candidateCache[$cacheKey];
    }

    public function recommendVacanciesForCandidate(
        CandidateProfile $candidate,
        int $limit = 6,
        array $excludeVacancyIds = [],
        ?Vacancy $anchor = null,
    ): Collection {
        $vacancies = $this->publicVacanciesQuery()
            ->when($excludeVacancyIds !== [], fn (Builder $query) => $query->whereNotIn('id', $excludeVacancyIds))
            ->get();

        return $this->rankVacanciesForCandidate($candidate, $vacancies, $anchor)
            ->take($limit)
            ->values();
    }

    public function rankVacanciesForCandidate(
        CandidateProfile $candidate,
        Collection $vacancies,
        ?Vacancy $anchor = null,
    ): Collection {
        $candidate->loadMissing(['skills', 'experiences', 'educations']);

        return $vacancies
            ->map(fn (Vacancy $vacancy) => [
                'vacancy' => $vacancy,
                'score' => $this->candidateRecommendationScore($candidate, $vacancy, $anchor),
            ])
            ->sortByDesc(fn (array $entry) => $entry['score'])
            ->pluck('vacancy')
            ->values();
    }

    public function candidateRecommendationScore(
        CandidateProfile $candidate,
        Vacancy $vacancy,
        ?Vacancy $anchor = null,
    ): int {
        return $this->recommendationBreakdown($candidate, $vacancy, $anchor)['score'];
    }

    public function matchInsightsForCandidate(
        CandidateProfile $candidate,
        Vacancy $vacancy,
        ?Vacancy $anchor = null,
    ): array {
        $breakdown = $this->recommendationBreakdown($candidate, $vacancy, $anchor);

        return [
            'score' => $breakdown['score'],
            'label' => $this->scoreLabel($breakdown['score']),
            'reasons' => collect($breakdown['reasons'])
                ->filter(fn (?string $reason) => filled($reason))
                ->unique()
                ->take(3)
                ->values()
                ->all(),
        ];
    }

    public function relatedScore(Vacancy $source, Vacancy $candidate): int
    {
        $sharedTags = collect($this->tagsFor($source))->intersect($this->tagsFor($candidate))->count();
        $sameCategory = $source->category && $candidate->category === $source->category ? 8 : 0;
        $sameDepartment = $source->department && $candidate->department === $source->department ? 6 : 0;
        $sameWorkMode = $source->work_mode && $candidate->work_mode === $source->work_mode ? 3 : 0;

        return ($sharedTags * 10) + $sameCategory + $sameDepartment + $sameWorkMode;
    }

    public function tagsFor(Vacancy $vacancy): array
    {
        $haystack = Str::lower(collect([
            $vacancy->title,
            $vacancy->department,
            $vacancy->category,
            $vacancy->description,
            $vacancy->requirements,
            $vacancy->responsibilities,
        ])->filter()->implode(' '));

        $catalog = [
            'react' => 'React',
            'typescript' => 'TypeScript',
            'javascript' => 'JavaScript',
            'laravel' => 'Laravel',
            'php' => 'PHP',
            'ui' => 'UI Design',
            'ux' => 'UX',
            'frontend' => 'Frontend',
            'backend' => 'Backend',
            'product' => 'Product',
            'design' => 'Design',
            'marketing' => 'Marketing',
            'sales' => 'Sales',
            'finance' => 'Finance',
            'hr' => 'Human Resources',
            'recruitment' => 'Recruitment',
            'cloud' => 'Cloud',
            'devops' => 'DevOps',
            'data' => 'Data',
            'analytics' => 'Analytics',
            'testing' => 'Testing',
            'support' => 'Support',
            'operations' => 'Operations',
        ];

        $tags = collect($catalog)
            ->filter(fn (string $label, string $needle) => Str::contains($haystack, $needle))
            ->values();

        return $tags
            ->merge([
                $vacancy->department ? Str::headline($vacancy->department) : null,
                $vacancy->category ? Str::headline(str_replace('_', ' ', $vacancy->category)) : null,
            ])
            ->filter()
            ->unique()
            ->take(5)
            ->values()
            ->all();
    }

    public function applyActionFor(?User $user, Vacancy $vacancy): array
    {
        if (! $user) {
            return $this->guestApplyAction();
        }

        $candidate = $this->resolveCandidate($user);

        if (! $candidate) {
            return [
                'type' => 'link',
                'href' => route('candidate.register'),
                'label' => 'Create Candidate Profile',
                'helper' => 'Create a candidate profile to apply for this role.',
            ];
        }

        $application = VacancyApplication::query()
            ->where('vacancy_id', $vacancy->id)
            ->where('candidate_profile_id', $candidate->id)
            ->first();

        if ($application) {
            return [
                'type' => 'disabled',
                'href' => null,
                'label' => 'Already Applied',
                'helper' => 'You already applied for this role and your application is under review.',
            ];
        }

        $hasPrimaryResume = $candidate->resumes()->where('is_primary', true)->exists();

        if (! $hasPrimaryResume) {
            return [
                'type' => 'link',
                'href' => route('candidate.documents'),
                'label' => 'Upload Resume',
                'helper' => 'Upload a primary resume in your candidate dashboard before applying.',
            ];
        }

        return [
            'type' => 'post',
            'href' => route('candidate.jobs.apply', $vacancy->id),
            'label' => 'Apply Now',
            'helper' => 'Your application will be reviewed by '.($vacancy->company?->company_name ?? 'the hiring team').'.',
        ];
    }

    public function guestApplyAction(): array
    {
        return [
            'type' => 'link',
            'href' => route('candidate.register'),
            'label' => 'Apply Now',
            'helper' => 'Create a candidate account to apply for this role.',
        ];
    }

    public function publicVacanciesQuery(): Builder
    {
        return Vacancy::query()
            ->withoutGlobalScope(OrganizationScope::class)
            ->with([
                'company' => fn ($query) => $query->withoutGlobalScope(OrganizationScope::class),
            ])
            ->where('status', 'published')
            ->whereHas('company', fn ($query) => $query
                ->withoutGlobalScope(OrganizationScope::class)
                ->where('status', 'active'))
            ->orderByDesc('published_at')
            ->orderByDesc('created_at');
    }

    private function genericRelatedVacancies(Vacancy $vacancy, int $limit): Collection
    {
        return $this->publicVacanciesQuery()
            ->whereKeyNot($vacancy->id)
            ->get()
            ->sortByDesc(fn (Vacancy $related) => $this->relatedScore($vacancy, $related))
            ->take($limit)
            ->values();
    }

    private function applyFilters(Builder $query, array $filters): Builder
    {
        $needle = trim((string) ($filters['q'] ?? ''));
        $location = trim((string) ($filters['location'] ?? ''));
        $workMode = $this->normalizeWorkMode($filters['work_mode'] ?? null);

        if ($needle !== '') {
            $query->where(function (Builder $builder) use ($needle) {
                $builder
                    ->where('title', 'like', "%{$needle}%")
                    ->orWhere('department', 'like', "%{$needle}%")
                    ->orWhere('category', 'like', "%{$needle}%")
                    ->orWhere('description', 'like', "%{$needle}%")
                    ->orWhere('requirements', 'like', "%{$needle}%")
                    ->orWhere('responsibilities', 'like', "%{$needle}%")
                    ->orWhereHas('company', fn (Builder $companyQuery) => $companyQuery
                        ->withoutGlobalScope(OrganizationScope::class)
                        ->where('company_name', 'like', "%{$needle}%"));
            });
        }

        if ($location !== '') {
            $query->where(function (Builder $builder) use ($location) {
                $builder->where('location', 'like', "%{$location}%");

                if (Str::lower($location) === 'remote') {
                    $builder->orWhere('work_mode', 'remote');
                }
            });
        }

        if ($workMode) {
            $query->where('work_mode', $workMode);
        }

        return $query;
    }

    private function recommendationBreakdown(
        CandidateProfile $candidate,
        Vacancy $vacancy,
        ?Vacancy $anchor = null,
    ): array {
        $candidate->loadMissing(['skills', 'experiences', 'educations']);

        $candidateTokens = $this->candidateTokens($candidate);
        $vacancyTokens = $this->vacancyTokens($vacancy);
        $skillNames = $candidate->skills->pluck('name')
            ->filter()
            ->map(fn (mixed $skill) => trim((string) $skill))
            ->values();
        $skillLookup = $skillNames->mapWithKeys(fn (string $skill) => [Str::lower($skill) => $skill]);
        $vacancyTagNames = collect($this->tagsFor($vacancy))->values();
        $vacancyTagLookup = $vacancyTagNames->mapWithKeys(fn (string $tag) => [Str::lower($tag) => $tag]);
        $sharedSkillMatches = $skillLookup->keys()
            ->intersect($vacancyTagLookup->keys())
            ->map(fn (string $tag) => $vacancyTagLookup[$tag])
            ->values();
        $sharedTokens = $candidateTokens->intersect($vacancyTokens)->count();
        $sharedSkillTags = $sharedSkillMatches->count();
        $experienceScore = $this->experienceAlignmentScore($candidate, $vacancy);
        $workModeScore = $this->workModePreferenceScore($candidate, $vacancy);
        $locationScore = $this->locationAlignmentScore($candidate, $vacancy);
        $anchorScore = $anchor ? (int) round($this->relatedScore($anchor, $vacancy) * 0.35) : 0;

        $score = max(
            1,
            min(
                99,
                28
                + ($sharedTokens * 6)
                + ($sharedSkillTags * 10)
                + $experienceScore
                + $workModeScore
                + $locationScore
                + $anchorScore
            )
        );

        $reasons = [];

        if ($sharedSkillMatches->isNotEmpty()) {
            $reasons[] = 'Matches your '.implode(', ', $sharedSkillMatches->take(3)->all()).' skills.';
        } elseif ($sharedTokens > 0) {
            $reasons[] = 'Role keywords align with your profile and experience.';
        }

        if ($experienceScore >= 14) {
            $reasons[] = 'Experience level lines up with this role.';
        }

        if ($workModeScore > 0) {
            $vacancyMode = $this->normalizeWorkMode($vacancy->work_mode);
            $reasons[] = $vacancyMode === 'remote'
                ? 'Matches your remote work preference.'
                : 'Matches your preferred '.Str::headline(str_replace('_', ' ', (string) $vacancyMode)).' work mode.';
        }

        if ($locationScore >= 8) {
            $reasons[] = 'Location matches your current base.';
        } elseif ($locationScore > 0) {
            $reasons[] = 'Remote setup broadens the fit for your profile.';
        }

        if ($anchor && $anchorScore >= 8) {
            $reasons[] = 'Closely related to the role you are viewing.';
        }

        if ($reasons === []) {
            $reasons[] = 'Core requirements overlap with your background.';
        }

        return [
            'score' => $score,
            'reasons' => $reasons,
        ];
    }

    private function candidateTokens(CandidateProfile $candidate): Collection
    {
        return $this->tokens(collect([
            $candidate->headline,
            $candidate->professional_summary,
            $candidate->location,
            $candidate->skills->pluck('name')->implode(' '),
            $candidate->experiences->pluck('job_title')->implode(' '),
            $candidate->experiences->pluck('description')->implode(' '),
            $candidate->educations->pluck('qualification')->implode(' '),
            $candidate->educations->pluck('field_of_study')->implode(' '),
        ])->filter()->implode(' '));
    }

    private function vacancyTokens(Vacancy $vacancy): Collection
    {
        return $this->tokens(collect([
            $vacancy->title,
            $vacancy->department,
            $vacancy->category,
            $vacancy->location,
            $vacancy->description,
            $vacancy->requirements,
            $vacancy->responsibilities,
            implode(' ', $this->tagsFor($vacancy)),
        ])->filter()->implode(' '));
    }

    private function experienceAlignmentScore(CandidateProfile $candidate, Vacancy $vacancy): int
    {
        $candidateYears = (int) ($candidate->years_experience ?? 0);
        $targetYears = $this->inferExperienceTarget($vacancy);

        return max(0, 22 - (abs($candidateYears - $targetYears) * 3));
    }

    private function workModePreferenceScore(CandidateProfile $candidate, Vacancy $vacancy): int
    {
        $preferredModes = collect(data_get($candidate->metadata, 'preferences.preferred_work_modes', []))
            ->map(fn (mixed $mode) => $this->normalizeWorkMode($mode))
            ->filter()
            ->values();

        $vacancyMode = $this->normalizeWorkMode($vacancy->work_mode);
        $remoteOnly = (bool) data_get($candidate->metadata, 'preferences.remote_only', false);

        if ($remoteOnly && $vacancyMode !== 'remote') {
            return -12;
        }

        if ($remoteOnly && $vacancyMode === 'remote') {
            return 14;
        }

        if ($vacancyMode && $preferredModes->contains($vacancyMode)) {
            return 10;
        }

        return 0;
    }

    private function locationAlignmentScore(CandidateProfile $candidate, Vacancy $vacancy): int
    {
        $candidateLocation = Str::lower(trim((string) $candidate->location));
        $vacancyLocation = Str::lower(trim((string) $vacancy->location));

        if ($this->normalizeWorkMode($vacancy->work_mode) === 'remote') {
            return 4;
        }

        if ($candidateLocation !== '' && $candidateLocation === $vacancyLocation) {
            return 8;
        }

        return 0;
    }

    private function inferExperienceTarget(Vacancy $vacancy): int
    {
        $haystack = Str::lower(collect([
            $vacancy->title,
            $vacancy->description,
            $vacancy->requirements,
        ])->filter()->implode(' '));

        return match (true) {
            Str::contains($haystack, ['intern', 'graduate', 'entry level']) => 0,
            Str::contains($haystack, ['junior', 'associate']) => 1,
            Str::contains($haystack, ['mid', 'intermediate']) => 3,
            Str::contains($haystack, ['senior', 'lead']) => 5,
            Str::contains($haystack, ['principal', 'head', 'director']) => 7,
            default => 4,
        };
    }

    private function tokens(string $text): Collection
    {
        return collect(preg_split('/[^a-z0-9]+/i', Str::lower($text)) ?: [])
            ->filter(fn (?string $token) => filled($token) && strlen($token) > 2)
            ->unique()
            ->values();
    }

    private function scoreLabel(int $score): string
    {
        return match (true) {
            $score >= 85 => 'Strong Match',
            $score >= 70 => 'Good Match',
            default => 'Potential Fit',
        };
    }

    private function normalizeWorkMode(mixed $mode): ?string
    {
        $normalized = Str::of((string) $mode)
            ->trim()
            ->lower()
            ->replace('-', '_')
            ->replace(' ', '_')
            ->value();

        return $normalized !== '' ? $normalized : null;
    }
}
