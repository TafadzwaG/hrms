<?php

namespace Tests\Unit\Backups;

use App\Support\Backups\MysqlDumpBinaryResolver;
use PHPUnit\Framework\TestCase;

class MysqlDumpBinaryResolverTest extends TestCase
{
    public function test_it_uses_a_configured_binary_path(): void
    {
        $directory = $this->makeTempDirectory();
        $binary = $directory.DIRECTORY_SEPARATOR.'mysqldump.exe';

        file_put_contents($binary, 'binary');

        $resolver = new MysqlDumpBinaryResolver();

        $this->assertSame($binary, $resolver->resolve($binary));

        @unlink($binary);
        @rmdir($directory);
    }

    public function test_it_resolves_a_binary_from_a_configured_directory(): void
    {
        $directory = $this->makeTempDirectory();
        $binary = $directory.DIRECTORY_SEPARATOR.(DIRECTORY_SEPARATOR === '\\' ? 'mysqldump.exe' : 'mysqldump');

        file_put_contents($binary, 'binary');

        $resolver = new MysqlDumpBinaryResolver();

        $this->assertSame($binary, $resolver->resolve($directory));

        @unlink($binary);
        @rmdir($directory);
    }

    private function makeTempDirectory(): string
    {
        $directory = sys_get_temp_dir().DIRECTORY_SEPARATOR.'mysql-dump-resolver-'.bin2hex(random_bytes(5));

        mkdir($directory, 0777, true);

        return $directory;
    }
}

