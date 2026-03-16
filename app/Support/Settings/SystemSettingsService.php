<?php

namespace App\Support\Settings;

use App\Models\SystemSetting;
use App\Support\Tenancy\TenantContext;
use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class SystemSettingsService
{
    public const GLOBAL_ORGANIZATION_ID = 0;

    private static ?bool $tableAvailable = null;

    public function __construct(
        private readonly TenantContext $tenantContext,
        private readonly ?CacheRepository $cache = null,
    ) {
    }

    public function organizationId(?int $organizationId = null): int
    {
        return $organizationId ?? $this->tenantContext->id() ?? self::GLOBAL_ORGANIZATION_ID;
    }

    public function systemOrganizationId(): int
    {
        return self::GLOBAL_ORGANIZATION_ID;
    }

    public function get(string $group, string $key, mixed $default = null, ?int $organizationId = null): mixed
    {
        $group = $this->normalizeGroup($group);
        $key = $this->normalizeKey($key);
        $organizationId = $this->organizationId($organizationId);

        $settings = $this->settingsMap($organizationId);
        $setting = $settings->get($this->mapKey($group, $key));

        if (!$setting) {
            return $default;
        }

        return $setting->value ?? $default;
    }

    public function getString(string $group, string $key, ?string $default = null, ?int $organizationId = null): ?string
    {
        $value = $this->get($group, $key, $default, $organizationId);

        return $value === null ? $default : (string) $value;
    }

    public function getBool(string $group, string $key, bool $default = false, ?int $organizationId = null): bool
    {
        $value = $this->get($group, $key, $default, $organizationId);

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? (bool) $default;
    }

    public function getInt(string $group, string $key, int $default = 0, ?int $organizationId = null): int
    {
        $value = $this->get($group, $key, $default, $organizationId);

        return (int) ($value ?? $default);
    }

    /**
     * @return array<int|string, mixed>
     */
    public function getArray(string $group, string $key, array $default = [], ?int $organizationId = null): array
    {
        $value = $this->get($group, $key, null, $organizationId);

        if ($value === null) {
            return $default;
        }

        if (is_array($value)) {
            return $value;
        }

        if ($value instanceof Collection) {
            return $value->all();
        }

        return Arr::wrap($value);
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public function setMany(string $group, array $values, ?int $organizationId = null, ?int $actorId = null, bool $isPublic = false): void
    {
        $group = $this->normalizeGroup($group);
        $organizationId = $this->organizationId($organizationId);

        if (!$this->tableAvailable()) {
            return;
        }

        foreach ($values as $key => $value) {
            $key = $this->normalizeKey((string) $key);
            $this->set($group, $key, $value, $organizationId, $actorId, $isPublic, null, false);
        }

        $this->flushCache($organizationId);
    }

    public function set(
        string $group,
        string $key,
        mixed $value,
        ?int $organizationId = null,
        ?int $actorId = null,
        bool $isPublic = false,
        ?string $type = null,
        bool $flushCache = true,
    ): ?SystemSetting
    {
        $group = $this->normalizeGroup($group);
        $key = $this->normalizeKey($key);
        $organizationId = $this->organizationId($organizationId);

        if (!$this->tableAvailable()) {
            return null;
        }

        if ($this->shouldDelete($value)) {
            SystemSetting::query()
                ->where('organization_id', $organizationId)
                ->where('group', $group)
                ->where('key', $key)
                ->delete();

            if ($flushCache) {
                $this->flushCache($organizationId);
            }

            return null;
        }

        $type ??= $this->inferType($value);

        $setting = SystemSetting::query()->firstOrNew([
            'organization_id' => $organizationId,
            'group' => $group,
            'key' => $key,
        ]);

        if (!$setting->exists) {
            $setting->created_by = $actorId;
        }

        $setting->forceFill([
            'value' => $value,
            'type' => $type,
            'is_public' => $isPublic,
            'updated_by' => $actorId,
        ])->save();

        if ($flushCache) {
            $this->flushCache($organizationId);
        }

        return $setting;
    }

    /**
     * @return array<string, mixed>
     */
    public function publicSettings(?int $organizationId = null): array
    {
        $organizationId = $this->organizationId($organizationId);

        if (!$this->tableAvailable()) {
            return [];
        }

        $settings = $this->settingsMap($organizationId)
            ->values()
            ->filter(fn (SystemSetting $setting) => (bool) $setting->is_public);

        return $settings
            ->groupBy('group')
            ->map(function (Collection $grouped): array {
                return $grouped
                    ->mapWithKeys(fn (SystemSetting $setting) => [$setting->key => $setting->value])
                    ->all();
            })
            ->all();
    }

    public function flushCache(?int $organizationId = null): void
    {
        $organizationId = $this->organizationId($organizationId);
        $store = $this->cacheStore();

        $store->forget($this->cacheKey($organizationId));
    }

    /**
     * @return Collection<string, SystemSetting>
     */
    private function settingsMap(int $organizationId): Collection
    {
        if (!$this->tableAvailable()) {
            return collect();
        }

        $store = $this->cacheStore();

        return $store->remember($this->cacheKey($organizationId), now()->addMinutes(10), function () use ($organizationId): Collection {
            $settings = SystemSetting::query()
                ->whereIn('organization_id', [self::GLOBAL_ORGANIZATION_ID, $organizationId])
                ->orderBy('organization_id')
                ->get();

            $global = $settings->where('organization_id', self::GLOBAL_ORGANIZATION_ID);
            $tenant = $organizationId === self::GLOBAL_ORGANIZATION_ID
                ? collect()
                : $settings->where('organization_id', $organizationId);

            $map = $global
                ->mapWithKeys(fn (SystemSetting $setting) => [$this->mapKey($setting->group, $setting->key) => $setting])
                ->all();

            foreach ($tenant as $setting) {
                $map[$this->mapKey($setting->group, $setting->key)] = $setting;
            }

            return collect($map);
        });
    }

    private function cacheKey(int $organizationId): string
    {
        return "system_settings:org:{$organizationId}";
    }

    private function cacheStore(): CacheRepository
    {
        return $this->cache ?? Cache::store();
    }

    private function tableAvailable(): bool
    {
        if (self::$tableAvailable !== null) {
            return self::$tableAvailable;
        }

        try {
            return self::$tableAvailable = Schema::hasTable('system_settings');
        } catch (\Throwable) {
            return self::$tableAvailable = false;
        }
    }

    private function normalizeGroup(string $group): string
    {
        return trim(strtolower($group));
    }

    private function normalizeKey(string $key): string
    {
        return trim(strtolower($key));
    }

    private function mapKey(string $group, string $key): string
    {
        return "{$group}.{$key}";
    }

    private function shouldDelete(mixed $value): bool
    {
        if ($value === null) {
            return true;
        }

        if (is_string($value) && trim($value) === '') {
            return true;
        }

        return false;
    }

    private function inferType(mixed $value): string
    {
        return match (true) {
            is_bool($value) => 'bool',
            is_int($value) => 'int',
            is_float($value) => 'float',
            is_array($value) => 'json',
            default => 'string',
        };
    }
}
