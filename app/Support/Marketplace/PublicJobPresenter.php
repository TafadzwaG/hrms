<?php

namespace App\Support\Marketplace;

use App\Models\CompanyProfile;
use App\Models\Vacancy;
use Carbon\CarbonInterface;
use Illuminate\Support\Str;

class PublicJobPresenter
{
    public function featured(Vacancy $vacancy): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'company_name' => $vacancy->company?->company_name ?? 'Unknown company',
            'location' => $vacancy->location,
            'work_mode' => $this->workModeLabel($vacancy->work_mode),
        ];
    }

    public function card(Vacancy $vacancy): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'company_name' => $vacancy->company?->company_name ?? 'Unknown company',
            'description' => Str::limit($vacancy->description ?? 'No description available for this vacancy yet.', 220),
            'location' => $vacancy->location ?: 'Remote',
            'salary' => $this->salary($vacancy),
            'work_mode' => $this->workModeLabel($vacancy->work_mode),
            'type' => $this->employmentTypeLabel($vacancy->employment_type),
            'posted' => $this->postedAt($vacancy->published_at, $vacancy->created_at),
            'tags' => $this->tags($vacancy),
        ];
    }

    public function detail(Vacancy $vacancy): array
    {
        $company = $vacancy->company;

        return [
            ...$this->card($vacancy),
            'department' => $vacancy->department,
            'category' => $vacancy->category ? Str::headline(str_replace('_', ' ', $vacancy->category)) : null,
            'responsibilities' => $this->responsibilities($vacancy),
            'requirements' => $this->requirements($vacancy),
            'company' => $this->company($company),
            'application_deadline' => $vacancy->application_deadline?->toDateString(),
        ];
    }

    public function relatedScore(Vacancy $source, Vacancy $candidate): int
    {
        $sharedTags = collect($this->tags($source))->intersect($this->tags($candidate))->count();
        $sameCategory = $source->category && $candidate->category === $source->category ? 8 : 0;
        $sameDepartment = $source->department && $candidate->department === $source->department ? 6 : 0;
        $sameWorkMode = $source->work_mode && $candidate->work_mode === $source->work_mode ? 3 : 0;

        return ($sharedTags * 10) + $sameCategory + $sameDepartment + $sameWorkMode;
    }

    public function tags(Vacancy $vacancy): array
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

    private function company(?CompanyProfile $company): array
    {
        $teamSize = data_get($company?->metadata, 'team_size');

        return [
            'name' => $company?->company_name ?? 'Unknown company',
            'initials' => Str::upper(Str::substr($company?->company_name ?? 'HR', 0, 2)),
            'industry' => $company?->industry ? Str::headline(str_replace('_', ' ', $company->industry)) : 'Technology',
            'size' => is_numeric($teamSize) ? number_format((int) $teamSize).' employees' : '50–200 employees',
            'description' => $company?->description ?: 'A growing team building reliable products and services for modern workplaces.',
            'website' => $company?->website,
        ];
    }

    private function responsibilities(Vacancy $vacancy): array
    {
        $fallback = [
            'Own delivery for key '.$vacancy->title.' initiatives across the '.$this->teamName($vacancy).'.',
            'Collaborate with cross-functional stakeholders to plan, ship, and improve high-quality outcomes.',
            'Maintain quality through documentation, testing, and disciplined execution.',
            'Contribute practical ideas that improve team velocity and candidate or customer experience.',
        ];

        return $this->bulletList($vacancy->responsibilities, $fallback);
    }

    private function requirements(Vacancy $vacancy): array
    {
        $fallback = [
            'Relevant experience delivering results in '.$this->teamName($vacancy).' or a closely related function.',
            'Strong communication and collaboration skills in '.$this->workModeLabel($vacancy->work_mode).' environments.',
            'Comfort with the tools, workflows, and priorities referenced in the role description.',
            'Ability to work independently, manage priorities, and maintain a high standard of execution.',
        ];

        return $this->bulletList($vacancy->requirements, $fallback);
    }

    private function bulletList(?string $text, array $fallback): array
    {
        $segments = collect(preg_split('/(?:\r\n|\r|\n|•|-|\d+\.)+/u', (string) $text) ?: [])
            ->map(fn (string $segment) => trim($segment, " \t\n\r\0\x0B•-"))
            ->filter();

        if ($segments->count() <= 1) {
            $segments = collect(preg_split('/(?<=[.!?])\s+/u', trim((string) $text)) ?: [])
                ->map(fn (string $segment) => trim($segment))
                ->filter();
        }

        return $segments
            ->merge($fallback)
            ->map(fn (string $item) => trim($item))
            ->filter()
            ->unique()
            ->take(5)
            ->values()
            ->all();
    }

    private function salary(Vacancy $vacancy): string
    {
        if ($vacancy->salary_min === null && $vacancy->salary_max === null) {
            return 'Salary negotiable';
        }

        $prefix = match (Str::upper($vacancy->currency ?: 'USD')) {
            'USD' => '$',
            'ZAR' => 'R',
            'GBP' => '£',
            'EUR' => '€',
            default => Str::upper($vacancy->currency ?: 'USD').' ',
        };

        $minimum = $vacancy->salary_min !== null ? $prefix.number_format((float) $vacancy->salary_min) : null;
        $maximum = $vacancy->salary_max !== null ? $prefix.number_format((float) $vacancy->salary_max) : null;

        if ($minimum && $maximum) {
            return $minimum.' - '.$maximum.' / month';
        }

        return ($minimum ?? $maximum).' / month';
    }

    private function postedAt(?CarbonInterface $publishedAt, ?CarbonInterface $createdAt): string
    {
        $date = $publishedAt ?? $createdAt;

        return $date ? $date->diffForHumans() : 'Recently posted';
    }

    private function workModeLabel(?string $mode): string
    {
        return match ($mode) {
            'remote' => 'Remote',
            'hybrid' => 'Hybrid',
            'onsite' => 'On-Site',
            default => $mode ? Str::headline(str_replace('_', ' ', $mode)) : 'Flexible',
        };
    }

    private function employmentTypeLabel(?string $type): string
    {
        return match ($type) {
            'full_time' => 'Full-Time',
            'part_time' => 'Part-Time',
            'temporary' => 'Temporary',
            default => $type ? Str::headline(str_replace('_', ' ', $type)) : 'Full-Time',
        };
    }

    private function teamName(Vacancy $vacancy): string
    {
        return $vacancy->department ?: ($vacancy->category ? Str::headline(str_replace('_', ' ', $vacancy->category)) : 'team');
    }
}
