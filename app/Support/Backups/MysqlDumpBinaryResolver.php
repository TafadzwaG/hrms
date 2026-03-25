<?php

namespace App\Support\Backups;

use RuntimeException;
use Symfony\Component\Process\ExecutableFinder;

class MysqlDumpBinaryResolver
{
    public function resolve(?string $configuredPath = null): string
    {
        foreach ($this->configuredCandidates($configuredPath) as $candidate) {
            if ($this->isUsableBinary($candidate)) {
                return $candidate;
            }
        }

        $finder = new ExecutableFinder();

        foreach ($this->binaryNames() as $binary) {
            $found = $finder->find($binary);

            if (is_string($found) && $found !== '') {
                return $found;
            }
        }

        foreach ($this->windowsFallbackCandidates() as $candidate) {
            if ($this->isUsableBinary($candidate)) {
                return $candidate;
            }
        }

        throw new RuntimeException(
            'Unable to locate a MySQL dump binary. Install MySQL client tools or set MYSQLDUMP_PATH to the full path of mysqldump.exe.'
        );
    }

    /**
     * @return array<int, string>
     */
    private function configuredCandidates(?string $configuredPath): array
    {
        $configuredPath = trim((string) ($configuredPath ?? env('MYSQLDUMP_PATH', '')));

        if ($configuredPath === '') {
            return [];
        }

        if (is_dir($configuredPath)) {
            return array_map(
                fn (string $binary) => rtrim($configuredPath, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$binary,
                $this->binaryNames()
            );
        }

        $candidates = [$configuredPath];

        if (DIRECTORY_SEPARATOR === '\\' && pathinfo($configuredPath, PATHINFO_EXTENSION) === '') {
            $candidates[] = $configuredPath.'.exe';
        }

        return array_values(array_unique($candidates));
    }

    /**
     * @return array<int, string>
     */
    private function windowsFallbackCandidates(): array
    {
        if (DIRECTORY_SEPARATOR !== '\\') {
            return [];
        }

        $patterns = [
            'C:\\xampp\\mysql\\bin\\mysqldump.exe',
            'C:\\xampp\\mysql\\bin\\mariadb-dump.exe',
            'C:\\laragon\\bin\\mysql\\*\\bin\\mysqldump.exe',
            'C:\\laragon\\bin\\mysql\\*\\bin\\mariadb-dump.exe',
            'C:\\wamp64\\bin\\mysql\\*\\bin\\mysqldump.exe',
            'C:\\wamp64\\bin\\mysql\\*\\bin\\mariadb-dump.exe',
            'C:\\Program Files\\MySQL\\MySQL Server *\\bin\\mysqldump.exe',
            'C:\\Program Files\\MySQL\\MySQL Server *\\bin\\mariadb-dump.exe',
            'C:\\Program Files\\MariaDB *\\bin\\mysqldump.exe',
            'C:\\Program Files\\MariaDB *\\bin\\mariadb-dump.exe',
        ];

        $candidates = [];

        foreach ($patterns as $pattern) {
            if (! str_contains($pattern, '*')) {
                $candidates[] = $pattern;

                continue;
            }

            $matches = glob($pattern) ?: [];
            natsort($matches);

            foreach (array_reverse($matches) as $match) {
                $candidates[] = $match;
            }
        }

        return array_values(array_unique($candidates));
    }

    /**
     * @return array<int, string>
     */
    private function binaryNames(): array
    {
        return DIRECTORY_SEPARATOR === '\\'
            ? ['mysqldump.exe', 'mariadb-dump.exe', 'mysqldump', 'mariadb-dump']
            : ['mysqldump', 'mariadb-dump'];
    }

    private function isUsableBinary(string $path): bool
    {
        return $path !== '' && is_file($path);
    }
}

