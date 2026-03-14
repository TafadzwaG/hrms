<?php

namespace App\Support\Audit;

class AuditContext
{
    private static ?string $batchId = null;

    private static int $disabledLevel = 0;

    public static function batchId(): ?string
    {
        return self::$batchId;
    }

    public static function isAuditingEnabled(): bool
    {
        return self::$disabledLevel === 0;
    }

    public static function withBatch(string $batchId, callable $callback): mixed
    {
        $previous = self::$batchId;
        self::$batchId = $batchId;

        try {
            return $callback();
        } finally {
            self::$batchId = $previous;
        }
    }

    public static function withoutAuditing(callable $callback): mixed
    {
        self::$disabledLevel++;

        try {
            return $callback();
        } finally {
            self::$disabledLevel = max(self::$disabledLevel - 1, 0);
        }
    }
}
