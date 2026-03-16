<?php

namespace App\Support\Backups;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;
use ZipArchive;

class DatabaseBackupService
{
    /**
     * @param  array{
     *   base_dir: string,
     *   retention_days: int,
     *   include_database: bool,
     *   include_uploads: bool,
     *   connection?: string|null,
     * }  $config
     * @return array{
     *   disk: string,
     *   path: string,
     *   filename: string,
     *   size: int,
     *   created_at: string,
     *   includes_database: bool,
     *   includes_uploads: bool,
     *   deleted_old_files: int
     * }
     */
    public function create(array $config): array
    {
        $baseDir = trim((string) ($config['base_dir'] ?? 'backups'), '/');
        $retentionDays = max(1, (int) ($config['retention_days'] ?? 14));
        $includeDatabase = (bool) ($config['include_database'] ?? true);
        $includeUploads = (bool) ($config['include_uploads'] ?? false);
        $connectionName = (string) ($config['connection'] ?? config('database.default'));

        if (! $includeDatabase && ! $includeUploads) {
            throw new \RuntimeException('Backup is disabled because both database and uploads are excluded.');
        }

        $tmpDir = $this->ensureTmpDirectory();
        $timestamp = now()->format('Ymd_His');

        $dbDumpGz = null;
        $finalTmpPath = null;
        $finalFilename = null;

        try {
            if ($includeDatabase) {
                $dbDumpSql = $tmpDir.DIRECTORY_SEPARATOR."db_{$timestamp}.sql";
                $this->dumpDatabase($dbDumpSql, $connectionName);

                $dbDumpGz = $tmpDir.DIRECTORY_SEPARATOR."db_{$timestamp}.sql.gz";
                $this->gzipFile($dbDumpSql, $dbDumpGz);

                @unlink($dbDumpSql);
            }

            if ($includeUploads) {
                $zipPath = $tmpDir.DIRECTORY_SEPARATOR."backup_{$timestamp}.zip";
                $this->createZipArchive($zipPath, $dbDumpGz);
                $finalTmpPath = $zipPath;
                $finalFilename = "backup_{$timestamp}.zip";
            } else {
                $finalTmpPath = $dbDumpGz;
                $finalFilename = "database_{$timestamp}.sql.gz";
            }

            if (! $finalTmpPath || ! $finalFilename) {
                throw new \RuntimeException('Backup failed to produce an archive.');
            }

            $disk = Storage::disk('local');
            $relativePath = $baseDir !== '' ? "{$baseDir}/{$finalFilename}" : $finalFilename;

            $stream = fopen($finalTmpPath, 'rb');
            if (! $stream) {
                throw new \RuntimeException('Unable to open backup archive for storage.');
            }

            try {
                $disk->put($relativePath, $stream);
            } finally {
                fclose($stream);
            }

            $size = (int) ($disk->size($relativePath) ?? 0);

            $deleted = $this->cleanupOldBackups($baseDir, $retentionDays);

            return [
                'disk' => 'local',
                'path' => $relativePath,
                'filename' => $finalFilename,
                'size' => $size,
                'created_at' => now()->toDateTimeString(),
                'includes_database' => $includeDatabase,
                'includes_uploads' => $includeUploads,
                'deleted_old_files' => $deleted,
            ];
        } finally {
            if ($dbDumpGz && is_file($dbDumpGz)) {
                @unlink($dbDumpGz);
            }

            if ($finalTmpPath && is_file($finalTmpPath)) {
                @unlink($finalTmpPath);
            }
        }
    }

    private function ensureTmpDirectory(): string
    {
        $path = storage_path('app/private/tmp-backups');

        if (! File::exists($path)) {
            File::makeDirectory($path, 0755, true);
        }

        return $path;
    }

    private function dumpDatabase(string $sqlPath, string $connectionName): void
    {
        $connection = config("database.connections.{$connectionName}", []);
        $driver = (string) ($connection['driver'] ?? '');

        if ($driver === 'mysql') {
            $this->dumpMysql($sqlPath, $connection);

            return;
        }

        if ($driver === 'sqlite') {
            $this->dumpSqlite($sqlPath, $connection);

            return;
        }

        throw new \RuntimeException("Database backup driver '{$driver}' is not supported yet.");
    }

    /**
     * @param  array<string, mixed>  $connection
     */
    private function dumpMysql(string $sqlPath, array $connection): void
    {
        $database = (string) ($connection['database'] ?? '');
        $username = (string) ($connection['username'] ?? '');
        $password = (string) ($connection['password'] ?? '');
        $host = (string) ($connection['host'] ?? '127.0.0.1');
        $port = (string) ($connection['port'] ?? 3306);

        if ($database === '' || $username === '') {
            throw new \RuntimeException('MySQL backup is missing database or username credentials.');
        }

        $mysqldump = (string) (env('MYSQLDUMP_PATH') ?: 'mysqldump');

        $command = [
            $mysqldump,
            '--host='.$host,
            '--port='.$port,
            '--user='.$username,
            '--single-transaction',
            '--quick',
            '--lock-tables=false',
            '--routines',
            '--events',
            '--triggers',
            '--result-file='.$sqlPath,
            '--databases',
            $database,
        ];

        $env = [];
        if ($password !== '') {
            // Avoid exposing the password as a CLI argument.
            $env['MYSQL_PWD'] = $password;
        }

        $process = new Process($command, null, $env, null, 1800);

        $process->run();

        if (! $process->isSuccessful()) {
            throw new ProcessFailedException($process);
        }

        if (! is_file($sqlPath) || filesize($sqlPath) === 0) {
            throw new \RuntimeException('MySQL dump completed but the output file was empty.');
        }
    }

    /**
     * @param  array<string, mixed>  $connection
     */
    private function dumpSqlite(string $sqlPath, array $connection): void
    {
        $database = (string) ($connection['database'] ?? '');

        if ($database === '' || $database === ':memory:') {
            throw new \RuntimeException('SQLite backups require a file-based database.');
        }

        $sourcePath = Str::startsWith($database, ['/', '\\'])
            ? $database
            : database_path($database);

        if (! is_file($sourcePath)) {
            throw new \RuntimeException('SQLite database file could not be found for backup.');
        }

        // For SQLite, a byte-for-byte copy preserves the database.
        File::copy($sourcePath, $sqlPath);
    }

    private function gzipFile(string $inputPath, string $outputPath): void
    {
        $in = fopen($inputPath, 'rb');
        $out = gzopen($outputPath, 'wb9');

        if (! $in || ! $out) {
            throw new \RuntimeException('Unable to create gzip backup stream.');
        }

        try {
            while (! feof($in)) {
                $chunk = fread($in, 1024 * 1024);
                if ($chunk === false) {
                    break;
                }
                gzwrite($out, $chunk);
            }
        } finally {
            fclose($in);
            gzclose($out);
        }
    }

    private function createZipArchive(string $zipPath, ?string $dbDumpGzPath): void
    {
        if (! class_exists(ZipArchive::class)) {
            throw new \RuntimeException('PHP ZipArchive extension is required to include uploads in backups.');
        }

        $zip = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException('Unable to create backup zip archive.');
        }

        try {
            if ($dbDumpGzPath && is_file($dbDumpGzPath)) {
                $zip->addFile($dbDumpGzPath, 'database.sql.gz');
            }

            $uploadsRoot = Storage::disk('public')->path('');
            if (is_dir($uploadsRoot)) {
                $this->zipDirectory($zip, $uploadsRoot, 'uploads');
            }
        } finally {
            $zip->close();
        }
    }

    private function zipDirectory(ZipArchive $zip, string $directory, string $prefix): void
    {
        $directory = rtrim($directory, DIRECTORY_SEPARATOR);

        foreach (File::allFiles($directory) as $file) {
            $fullPath = $file->getPathname();
            $relative = ltrim(Str::replaceFirst($directory, '', $fullPath), DIRECTORY_SEPARATOR);

            $zip->addFile($fullPath, $prefix.'/'.$relative);
        }
    }

    private function cleanupOldBackups(string $baseDir, int $retentionDays): int
    {
        $disk = Storage::disk('local');
        $deleted = 0;

        $threshold = now()->subDays($retentionDays)->getTimestamp();
        $files = $baseDir !== '' ? $disk->files($baseDir) : $disk->files();

        foreach ($files as $file) {
            try {
                $modified = $disk->lastModified($file);
                if ($modified !== false && $modified < $threshold) {
                    if ($disk->delete($file)) {
                        $deleted++;
                    }
                }
            } catch (\Throwable) {
                // Ignore cleanup failures; backups should still be created.
            }
        }

        return $deleted;
    }
}
