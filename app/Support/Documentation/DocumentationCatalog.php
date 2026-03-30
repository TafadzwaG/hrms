<?php

namespace App\Support\Documentation;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DocumentationCatalog
{
    /**
     * @var array<string, string>
     */
    private const SECTION_DIRECTORIES = [
        'modules' => 'docs/handbook/modules',
        'roles' => 'docs/handbook/roles',
        'references' => 'docs',
    ];

    /**
     * @var array<int, string>
     */
    private const MODULE_ORDER = [
        'dashboard',
        'employees',
        'contracts',
        'asset-management',
        'organization-structure',
        'user-access-and-control-center',
        'audit-trail',
        'system-settings',
        'workflows',
        'leave-management',
        'attendance',
        'timesheets',
        'payroll',
        'payslips',
        'requisitions',
        'candidate-records',
        'onboarding',
        'offboarding',
        'performance-management',
        'learning',
        'benefits',
        'documents-repository',
        'reports',
        'recruitment-marketplace',
        'candidate-hub',
        'employer-hub',
    ];

    /**
     * @var array<int, string>
     */
    private const ROLE_ORDER = [
        'system-admin',
        'hr-admin',
        'payroll-officer',
        'manager',
        'authoriser',
        'employee',
        'auditor',
        'candidate',
        'employer',
    ];

    /**
     * @return array<string, array<int, array<string, mixed>>>
     */
    public function sections(): array
    {
        return [
            'modules' => $this->sectionItems('modules'),
            'roles' => $this->sectionItems('roles'),
            'references' => $this->sectionItems('references'),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function sectionItems(string $section): array
    {
        $directory = $this->directoryFor($section);

        if (! File::isDirectory($directory) && ! File::exists($directory)) {
            return [];
        }

        $files = $section === 'references'
            ? collect(File::files($directory))
                ->filter(fn (\SplFileInfo $file) => $file->getExtension() === 'md')
            : collect(File::files($directory))
                ->filter(fn (\SplFileInfo $file) => $file->getExtension() === 'md');

        $items = $files
            ->filter(function (\SplFileInfo $file) use ($section) {
                if ($section !== 'references') {
                    return true;
                }

                return $file->getPath() === $this->directoryFor('references')
                    && ! Str::startsWith($file->getFilename(), '.');
            })
            ->map(fn (\SplFileInfo $file) => $this->summarizeFile($section, $file))
            ->values();

        return $this->ordered($section, $items->all());
    }

    /**
     * @return array<string, mixed>|null
     */
    public function find(string $section, string $slug): ?array
    {
        $directory = $this->directoryFor($section);

        if (! $directory) {
            return null;
        }

        $path = $section === 'references'
            ? $directory.DIRECTORY_SEPARATOR.$slug.'.md'
            : $directory.DIRECTORY_SEPARATOR.$slug.'.md';

        if (! File::exists($path)) {
            return null;
        }

        $markdown = File::get($path);
        $summary = $this->extractSummary($markdown);

        return [
            'section' => $section,
            'slug' => $slug,
            'title' => $this->extractTitle($markdown, Str::headline(str_replace('-', ' ', $slug))),
            'summary' => $summary,
            'html' => Str::markdown($markdown, [
                'html_input' => 'strip',
                'allow_unsafe_links' => false,
            ]),
            'markdown' => $markdown,
            'path' => str_replace(base_path().DIRECTORY_SEPARATOR, '', $path),
            'updated_at' => date(DATE_ATOM, File::lastModified($path)),
            'href' => route('documentation.show', ['section' => $section, 'slug' => $slug]),
        ];
    }

    private function directoryFor(string $section): ?string
    {
        $relative = self::SECTION_DIRECTORIES[$section] ?? null;

        return $relative ? base_path($relative) : null;
    }

    /**
     * @return array<string, mixed>
     */
    private function summarizeFile(string $section, \SplFileInfo $file): array
    {
        $markdown = File::get($file->getPathname());
        $slug = pathinfo($file->getFilename(), PATHINFO_FILENAME);

        return [
            'section' => $section,
            'slug' => $slug,
            'title' => $this->extractTitle($markdown, Str::headline(str_replace('-', ' ', $slug))),
            'summary' => $this->extractSummary($markdown),
            'href' => route('documentation.show', ['section' => $section, 'slug' => $slug]),
            'path' => str_replace(base_path().DIRECTORY_SEPARATOR, '', $file->getPathname()),
            'updated_at' => date(DATE_ATOM, $file->getMTime()),
        ];
    }

    private function extractTitle(string $markdown, string $fallback): string
    {
        if (preg_match('/^#\s+(.+)$/m', $markdown, $matches) === 1) {
            return trim($matches[1]);
        }

        return $fallback;
    }

    private function extractSummary(string $markdown): string
    {
        $lines = preg_split('/\R/', $markdown) ?: [];
        $paragraph = [];

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '' && $paragraph !== []) {
                break;
            }

            if ($trimmed === '' || Str::startsWith($trimmed, ['#', '```', '|', '- '])) {
                continue;
            }

            $paragraph[] = $trimmed;
        }

        return implode(' ', $paragraph);
    }

    /**
     * @param array<int, array<string, mixed>> $items
     * @return array<int, array<string, mixed>>
     */
    private function ordered(string $section, array $items): array
    {
        $order = match ($section) {
            'modules' => self::MODULE_ORDER,
            'roles' => self::ROLE_ORDER,
            default => [],
        };

        if ($order === []) {
            usort($items, fn (array $left, array $right) => strcmp($left['title'], $right['title']));

            return $items;
        }

        $position = array_flip($order);

        usort($items, function (array $left, array $right) use ($position) {
            $leftIndex = $position[$left['slug']] ?? PHP_INT_MAX;
            $rightIndex = $position[$right['slug']] ?? PHP_INT_MAX;

            if ($leftIndex === $rightIndex) {
                return strcmp($left['title'], $right['title']);
            }

            return $leftIndex <=> $rightIndex;
        });

        return $items;
    }
}
