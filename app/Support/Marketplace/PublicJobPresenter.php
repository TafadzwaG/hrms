<?php

namespace App\Support\Marketplace;

use App\Models\CompanyProfile;
use App\Models\Vacancy;
use App\Services\Marketplace\ExchangeEngine;
use App\Support\RichText;
use Carbon\CarbonInterface;
use Illuminate\Support\Str;

class PublicJobPresenter
{
    public function __construct(
        private readonly ExchangeEngine $exchange,
    ) {
    }

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

    public function card(Vacancy $vacancy, ?array $match = null): array
    {
        return [
            'id' => $vacancy->id,
            'title' => $vacancy->title,
            'company_name' => $vacancy->company?->company_name ?? 'Unknown company',
            'description' => Str::limit(RichText::plainText($vacancy->description ?: 'No description available for this vacancy yet.'), 220),
            'location' => $vacancy->location ?: 'Remote',
            'salary' => $this->salary($vacancy),
            'work_mode' => $this->workModeLabel($vacancy->work_mode),
            'type' => $this->employmentTypeLabel($vacancy->employment_type),
            'posted' => $this->postedAt($vacancy->published_at, $vacancy->created_at),
            'tags' => $this->exchange->tagsFor($vacancy),
            'match' => $match,
        ];
    }

    public function detail(Vacancy $vacancy, ?array $match = null): array
    {
        $company = $vacancy->company;

        return [
            ...$this->card($vacancy, $match),
            'department' => $vacancy->department,
            'category' => $vacancy->category ? Str::headline(str_replace('_', ' ', $vacancy->category)) : null,
            'description_html' => RichText::sanitize($vacancy->description),
            'requirements_html' => RichText::sanitize($vacancy->requirements),
            'responsibilities_html' => RichText::sanitize($vacancy->responsibilities),
            'responsibilities' => $this->responsibilities($vacancy),
            'requirements' => $this->requirements($vacancy),
            'company' => $this->company($company),
            'application_deadline' => $vacancy->application_deadline?->toDateString(),
        ];
    }

    private function company(?CompanyProfile $company): array
    {
        $teamSize = data_get($company?->metadata, 'team_size');

        return [
            'name' => $company?->company_name ?? 'Unknown company',
            'initials' => Str::upper(Str::substr($company?->company_name ?? 'HR', 0, 2)),
            'industry' => $company?->industry ? Str::headline(str_replace('_', ' ', $company->industry)) : 'Technology',
            'size' => is_numeric($teamSize) ? number_format((int) $teamSize).' employees' : '50-200 employees',
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

        return RichText::bulletList($vacancy->responsibilities, $fallback);
    }

    private function requirements(Vacancy $vacancy): array
    {
        $fallback = [
            'Relevant experience delivering results in '.$this->teamName($vacancy).' or a closely related function.',
            'Strong communication and collaboration skills in '.$this->workModeLabel($vacancy->work_mode).' environments.',
            'Comfort with the tools, workflows, and priorities referenced in the role description.',
            'Ability to work independently, manage priorities, and maintain a high standard of execution.',
        ];

        return RichText::bulletList($vacancy->requirements, $fallback);
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
