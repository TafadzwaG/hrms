<?php

namespace App\Support\Audit;

use App\Models\AuditLog;
use App\Support\Tenancy\TenantContext;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use JsonSerializable;
use BackedEnum;
use DateTimeInterface;
use Throwable;

class AuditLogger
{
    private static ?bool $tableAvailable = null;

    private ?Model $modelContext = null;

    private ?string $moduleContext = null;

    public function forModel(?Model $model, ?string $module = null): static
    {
        $clone = clone $this;
        $clone->modelContext = $model;
        $clone->moduleContext = $module;

        return $clone;
    }

    public function logEvent(array $payload): ?AuditLog
    {
        if ($this->shouldSkip()) {
            return null;
        }

        try {
            return AuditLog::query()->create([
                ...$payload,
                'created_at' => $payload['created_at'] ?? now(),
            ]);
        } catch (Throwable $exception) {
            try {
                report($exception);
            } catch (Throwable) {
                // Never let audit reporting failures block the primary request path.
            }

            return null;
        }
    }

    public function logCreate(Model $model, ?array $newValues = null, array $context = []): ?AuditLog
    {
        return $this->logModelEvent('create', $model, null, $newValues, $context);
    }

    public function logUpdate(Model $model, ?array $oldValues = null, ?array $newValues = null, array $context = []): ?AuditLog
    {
        return $this->logModelEvent('update', $model, $oldValues, $newValues, $context);
    }

    public function logDelete(Model $model, ?array $oldValues = null, array $context = []): ?AuditLog
    {
        $event = (string) ($context['event'] ?? 'delete');

        return $this->logModelEvent($event, $model, $oldValues, null, $context);
    }

    public function logCustom(string $event, ?Model $model = null, array $context = []): ?AuditLog
    {
        $model ??= $this->modelContext;
        $actor = $this->resolveActor($context['actor'] ?? null);
        $requestContext = $this->requestContext();
        $module = (string) ($context['module'] ?? $this->moduleContext ?? $this->resolveModule($model, 'system'));
        $category = (string) ($context['category'] ?? $this->guessCategory($event, $module));
        $oldValues = $this->normalizePayload($context['old_values'] ?? null);
        $newValues = $this->normalizePayload($context['new_values'] ?? null);
        $metadata = $this->normalizePayload($context['metadata'] ?? []);
        $actorName = $context['actor_name'] ?? $this->actorName($actor);
        $auditableLabel = $context['auditable_label'] ?? $this->resolveAuditableLabel($model);
        $description = $context['description'] ?? $this->defaultDescription($event, $model);

        if (!empty($oldValues) || !empty($newValues)) {
            $metadata = array_merge($metadata ?? [], [
                'changed_fields' => array_values(array_unique(array_merge(
                    array_keys($oldValues ?? []),
                    array_keys($newValues ?? []),
                ))),
            ]);
        }

        return $this->logEvent([
            'actor_type' => $actor?->getMorphClass(),
            'actor_id' => $actor?->getAuthIdentifier(),
            'actor_name' => $actorName,
            'organization_id' => $context['organization_id'] ?? $this->resolveOrganizationId($model),
            'event' => $event,
            'module' => $module,
            'category' => $category,
            'auditable_type' => $model?->getMorphClass(),
            'auditable_id' => $model?->getKey(),
            'auditable_label' => $auditableLabel,
            'description' => $description,
            'old_values' => empty($oldValues) ? null : $oldValues,
            'new_values' => empty($newValues) ? null : $newValues,
            'metadata' => empty($metadata) ? null : $metadata,
            'request_method' => $context['request_method'] ?? $requestContext['request_method'],
            'route_name' => $context['route_name'] ?? $requestContext['route_name'],
            'url' => $context['url'] ?? $requestContext['url'],
            'ip_address' => $context['ip_address'] ?? $requestContext['ip_address'],
            'user_agent' => $context['user_agent'] ?? $requestContext['user_agent'],
            'tags' => $this->tags($event, $module, $category, Arr::wrap($context['tags'] ?? [])),
            'batch_id' => $context['batch_id'] ?? AuditContext::batchId(),
        ]);
    }

    public function logAuthEvent(string $event, ?Authenticatable $actor = null, array $context = []): ?AuditLog
    {
        return $this->logCustom($event, $actor instanceof Model ? $actor : null, [
            'actor' => $actor,
            'module' => 'auth',
            'category' => 'auth',
            'tags' => ['security', 'auth'],
            ...$context,
        ]);
    }

    public function sanitizeModelValues(Model $model, array $attributes): array
    {
        $ignored = method_exists($model, 'auditExcludedAttributes')
            ? $model->auditExcludedAttributes()
            : config('audit.ignored_attributes', []);
        $redacted = method_exists($model, 'auditRedactedAttributes')
            ? $model->auditRedactedAttributes()
            : config('audit.redacted_attributes', []);
        $placeholder = (string) config('audit.redacted_placeholder', '[REDACTED]');

        return collect($attributes)
            ->reject(fn ($value, $key) => in_array((string) $key, $ignored, true))
            ->mapWithKeys(function ($value, $key) use ($redacted, $placeholder): array {
                if (in_array((string) $key, $redacted, true)) {
                    return [$key => $placeholder];
                }

                return [$key => $this->normalizeValue($value)];
            })
            ->filter(fn ($value) => $value !== '')
            ->all();
    }

    private function logModelEvent(string $event, Model $model, ?array $oldValues, ?array $newValues, array $context): ?AuditLog
    {
        $oldValues = $this->normalizePayload($oldValues);
        $newValues = $this->normalizePayload($newValues);

        if ($event === 'update' && empty($oldValues) && empty($newValues)) {
            return null;
        }

        return $this->logCustom($event, $model, [
            'module' => $context['module'] ?? $this->resolveModule($model),
            'description' => $context['description'] ?? $this->defaultDescription($event, $model),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            ...$context,
        ]);
    }

    private function shouldSkip(): bool
    {
        if (!config('audit.enabled', true)) {
            return true;
        }

        if (!AuditContext::isAuditingEnabled()) {
            return true;
        }

        if (app()->runningInConsole() && config('audit.skip_console', true) && !app()->runningUnitTests()) {
            return true;
        }

        return !$this->auditTableAvailable();
    }

    private function auditTableAvailable(): bool
    {
        if (self::$tableAvailable !== null) {
            return self::$tableAvailable;
        }

        try {
            return self::$tableAvailable = Schema::hasTable('audit_logs');
        } catch (Throwable) {
            return self::$tableAvailable = false;
        }
    }

    private function requestContext(): array
    {
        $request = $this->request();

        return [
            'request_method' => $request?->method(),
            'route_name' => $request?->route()?->getName(),
            'url' => $request?->fullUrl(),
            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
        ];
    }

    private function request(): ?Request
    {
        return app()->bound('request') ? app(Request::class) : null;
    }

    private function resolveActor(mixed $actor = null): ?Authenticatable
    {
        if ($actor instanceof Authenticatable) {
            return $actor;
        }

        return $this->request()?->user();
    }

    private function actorName(?Authenticatable $actor): ?string
    {
        if (!$actor) {
            return null;
        }

        if ($actor instanceof Model) {
            return (string) ($actor->getAttribute('name') ?? $actor->getAttribute('email') ?? class_basename($actor));
        }

        return method_exists($actor, 'getAuthIdentifier')
            ? 'User #'.$actor->getAuthIdentifier()
            : null;
    }

    private function resolveModule(?Model $model, string $fallback = 'system'): string
    {
        if (!$model) {
            return $fallback;
        }

        if (method_exists($model, 'auditModule')) {
            return (string) $model->auditModule();
        }

        return $model->getTable();
    }

    private function resolveAuditableLabel(?Model $model): ?string
    {
        if (!$model) {
            return null;
        }

        if (method_exists($model, 'auditLabel')) {
            return (string) $model->auditLabel();
        }

        foreach (['full_name', 'title', 'name', 'email', 'staff_number', 'code'] as $field) {
            $value = data_get($model, $field);

            if (filled($value)) {
                return (string) $value;
            }
        }

        return class_basename($model).' #'.$model->getKey();
    }

    private function defaultDescription(string $event, ?Model $model): string
    {
        $verb = Str::headline(str_replace('_', ' ', $event));
        $subject = $model ? class_basename($model) : 'system event';
        $label = $model ? $this->resolveAuditableLabel($model) : null;

        return trim($verb.' '.$subject.($label ? ' '.$label : ''));
    }

    private function guessCategory(string $event, string $module): string
    {
        return match (true) {
            $module === 'auth' => 'auth',
            in_array($event, ['assign_role', 'revoke_role', 'permission_changes'], true) => 'access',
            in_array($event, ['approve', 'reject', 'request_changes'], true) => 'workflow',
            in_array($event, ['failed_login', 'password_reset', 'password_reset_requested'], true) => 'security',
            in_array($event, ['bulk_upload', 'import', 'export'], true) => 'bulk',
            default => 'data',
        };
    }

    private function normalizePayload(mixed $payload): ?array
    {
        if ($payload === null) {
            return null;
        }

        if ($payload instanceof Arrayable) {
            $payload = $payload->toArray();
        }

        if (!is_array($payload)) {
            return ['value' => $this->normalizeValue($payload)];
        }

        return collect($payload)
            ->mapWithKeys(fn ($value, $key) => [$key => $this->normalizeValue($value)])
            ->filter(fn ($value) => $value !== '')
            ->all();
    }

    private function normalizeValue(mixed $value): mixed
    {
        if ($value instanceof BackedEnum) {
            return $value->value;
        }

        if ($value instanceof DateTimeInterface) {
            return Carbon::instance($value)->toAtomString();
        }

        if ($value instanceof Arrayable) {
            return $this->normalizeValue($value->toArray());
        }

        if ($value instanceof JsonSerializable) {
            return $this->normalizeValue($value->jsonSerialize());
        }

        if (is_array($value)) {
            return collect($value)
                ->map(fn ($item) => $this->normalizeValue($item))
                ->all();
        }

        if (is_bool($value) || is_int($value) || is_float($value) || is_null($value)) {
            return $value;
        }

        if (is_object($value) && method_exists($value, '__toString')) {
            return (string) $value;
        }

        return is_scalar($value) ? $value : json_encode($value, JSON_UNESCAPED_SLASHES);
    }

    private function tags(string $event, string $module, string $category, array $tags): array
    {
        return collect([$module, $category, $event, ...$tags])
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function resolveOrganizationId(?Model $model): ?int
    {
        if ($model && ! blank($model->getAttribute('organization_id'))) {
            return (int) $model->getAttribute('organization_id');
        }

        if ($model && $model->relationLoaded('employee') && $model->employee && ! blank($model->employee->organization_id)) {
            return (int) $model->employee->organization_id;
        }

        if ($model && method_exists($model, 'employee') && ! blank($model->employee?->organization_id)) {
            return (int) $model->employee->organization_id;
        }

        return app(TenantContext::class)->id();
    }
}
