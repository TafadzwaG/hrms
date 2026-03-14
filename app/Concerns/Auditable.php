<?php

namespace App\Concerns;

use App\Support\Audit\AuditLogger;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

trait Auditable
{
    protected array $auditPendingOldValues = [];

    protected array $auditPendingNewValues = [];

    protected ?string $auditPendingEvent = null;

    public static function bootAuditable(): void
    {
        static::updating(function (Model $model): void {
            if (!method_exists($model, 'shouldBeAudited') || !$model->shouldBeAudited()) {
                return;
            }

            $dirty = array_keys($model->getDirty());
            $logger = app(AuditLogger::class);

            $model->auditPendingOldValues = $logger->sanitizeModelValues(
                $model,
                Arr::only($model->getOriginal(), $dirty),
            );

            $model->auditPendingNewValues = $logger->sanitizeModelValues(
                $model,
                collect($dirty)->mapWithKeys(fn (string $key) => [$key => $model->getAttribute($key)])->all(),
            );
        });

        static::created(function (Model $model): void {
            if (!method_exists($model, 'shouldBeAudited') || !$model->shouldBeAudited()) {
                return;
            }

            app(AuditLogger::class)->logCreate(
                $model,
                app(AuditLogger::class)->sanitizeModelValues($model, $model->getAttributes()),
                ['module' => $model->auditModule()]
            );
        });

        static::updated(function (Model $model): void {
            if (!method_exists($model, 'shouldBeAudited') || !$model->shouldBeAudited()) {
                return;
            }

            app(AuditLogger::class)->logUpdate(
                $model,
                $model->auditPendingOldValues,
                $model->auditPendingNewValues,
                ['module' => $model->auditModule()]
            );

            $model->auditPendingOldValues = [];
            $model->auditPendingNewValues = [];
        });

        static::deleting(function (Model $model): void {
            if (!method_exists($model, 'shouldBeAudited') || !$model->shouldBeAudited()) {
                return;
            }

            $model->auditPendingEvent = method_exists($model, 'isForceDeleting') && $model->isForceDeleting()
                ? 'force_delete'
                : 'delete';

            $model->auditPendingOldValues = app(AuditLogger::class)->sanitizeModelValues($model, $model->getAttributes());
        });

        static::deleted(function (Model $model): void {
            if (!method_exists($model, 'shouldBeAudited') || !$model->shouldBeAudited()) {
                return;
            }

            app(AuditLogger::class)->logDelete($model, $model->auditPendingOldValues, [
                'event' => $model->auditPendingEvent ?? 'delete',
                'module' => $model->auditModule(),
            ]);

            $model->auditPendingOldValues = [];
            $model->auditPendingEvent = null;
        });

        if (in_array(SoftDeletes::class, class_uses_recursive(static::class), true)) {
            static::restored(function (Model $model): void {
                if (!method_exists($model, 'shouldBeAudited') || !$model->shouldBeAudited()) {
                    return;
                }

                app(AuditLogger::class)->logCustom('restore', $model, [
                    'module' => $model->auditModule(),
                    'new_values' => app(AuditLogger::class)->sanitizeModelValues($model, $model->getAttributes()),
                ]);
            });
        }
    }

    public function shouldBeAudited(): bool
    {
        return property_exists($this, 'auditEnabled') ? (bool) $this->auditEnabled : true;
    }

    public function auditModule(): string
    {
        if (property_exists($this, 'auditModule') && filled($this->auditModule)) {
            return (string) $this->auditModule;
        }

        return $this->getTable();
    }

    public function auditLabel(): string
    {
        $fullName = trim(collect([
            $this->getAttribute('first_name'),
            $this->getAttribute('middle_name'),
            $this->getAttribute('surname'),
        ])->filter()->implode(' '));

        if ($fullName !== '') {
            return $fullName;
        }

        foreach (['full_name', 'title', 'name', 'email', 'staff_number', 'code'] as $field) {
            $value = data_get($this, $field);

            if (filled($value)) {
                return (string) $value;
            }
        }

        return Str::headline($this->getTable()).' #'.$this->getKey();
    }

    public function auditExcludedAttributes(): array
    {
        return array_values(array_unique([
            ...config('audit.ignored_attributes', []),
            ...(property_exists($this, 'auditExclude') ? $this->auditExclude : []),
        ]));
    }

    public function auditRedactedAttributes(): array
    {
        return array_values(array_unique([
            ...config('audit.redacted_attributes', []),
            ...(property_exists($this, 'auditRedact') ? $this->auditRedact : []),
        ]));
    }
}
