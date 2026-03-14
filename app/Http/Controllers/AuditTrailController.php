<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditTrailController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now()->toDateString();
        $criticalEvents = config('audit.critical_events', []);

        return Inertia::render('AuditTrail/Index', [
            'summary' => [
                'total_events' => AuditLog::count(),
                'today_events' => AuditLog::query()->whereDate('created_at', $today)->count(),
                'critical_today' => AuditLog::query()
                    ->whereDate('created_at', $today)
                    ->whereIn('event', $criticalEvents)
                    ->count(),
                'active_modules' => AuditLog::query()->distinct('module')->count('module'),
                'actors_today' => AuditLog::query()
                    ->whereDate('created_at', $today)
                    ->whereNotNull('actor_name')
                    ->distinct('actor_name')
                    ->count('actor_name'),
            ],
            'eventsByModule' => AuditLog::query()
                ->select('module', DB::raw('count(*) as total'))
                ->groupBy('module')
                ->orderByDesc('total')
                ->limit(10)
                ->get()
                ->map(fn (AuditLog $log) => [
                    'module' => $log->module,
                    'label' => str($log->module)->replace('_', ' ')->headline()->toString(),
                    'total' => (int) $log->total,
                ])
                ->values(),
            'recentCriticalActions' => AuditLog::query()
                ->whereIn('event', $criticalEvents)
                ->latest('created_at')
                ->limit(8)
                ->get()
                ->map(fn (AuditLog $log) => $this->listItem($log))
                ->values(),
            'recentEvents' => AuditLog::query()
                ->latest('created_at')
                ->limit(12)
                ->get()
                ->map(fn (AuditLog $log) => $this->listItem($log))
                ->values(),
            'quickFilters' => [
                ['label' => 'Failed logins', 'href' => '/audit-trail/logs?event=failed_login', 'description' => 'Investigate rejected authentication attempts.'],
                ['label' => 'Permission changes', 'href' => '/audit-trail/logs?event=permission_changes', 'description' => 'Inspect role and permission matrix changes.'],
                ['label' => 'Role assignment', 'href' => '/audit-trail/logs?event=assign_role', 'description' => 'Review user access changes and role grants.'],
                ['label' => 'Today', 'href' => '/audit-trail/logs?from='.$today.'&to='.$today, 'description' => 'Focus on activity recorded today.'],
            ],
        ]);
    }

    public function logs(Request $request): Response
    {
        $filters = $this->filters($request);
        $query = $this->filteredQuery($filters);

        return Inertia::render('AuditTrail/Logs', [
            'logs' => $query
                ->latest('created_at')
                ->paginate(20)
                ->withQueryString()
                ->through(fn (AuditLog $log) => $this->listItem($log)),
            'filters' => $filters,
            'options' => [
                'modules' => AuditLog::query()->distinct()->orderBy('module')->pluck('module')->values(),
                'events' => AuditLog::query()->distinct()->orderBy('event')->pluck('event')->values(),
                'categories' => AuditLog::query()->whereNotNull('category')->distinct()->orderBy('category')->pluck('category')->values(),
                'auditable_types' => AuditLog::query()
                    ->whereNotNull('auditable_type')
                    ->distinct()
                    ->orderBy('auditable_type')
                    ->pluck('auditable_type')
                    ->map(fn (string $type) => [
                        'value' => $type,
                        'label' => class_basename($type),
                    ])
                    ->values(),
                'routes' => AuditLog::query()
                    ->whereNotNull('route_name')
                    ->distinct()
                    ->orderBy('route_name')
                    ->limit(150)
                    ->pluck('route_name')
                    ->values(),
            ],
            'summary' => [
                'filtered_total' => (clone $query)->count(),
                'critical_filtered' => (clone $query)->whereIn('event', config('audit.critical_events', []))->count(),
            ],
        ]);
    }

    public function show(AuditLog $auditLog): Response
    {
        $relatedBatch = collect();

        if ($auditLog->batch_id) {
            $relatedBatch = AuditLog::query()
                ->where('batch_id', $auditLog->batch_id)
                ->whereKeyNot($auditLog->id)
                ->latest('created_at')
                ->limit(12)
                ->get()
                ->map(fn (AuditLog $log) => $this->listItem($log))
                ->values();
        }

        return Inertia::render('AuditTrail/Show', [
            'log' => [
                ...$this->listItem($auditLog),
                'actor' => [
                    'type' => $auditLog->actor_type ? class_basename($auditLog->actor_type) : null,
                    'id' => $auditLog->actor_id,
                    'name' => $auditLog->actor_name,
                    'url' => $auditLog->actor_type === User::class && $auditLog->actor_id
                        ? '/users/'.$auditLog->actor_id
                        : null,
                ],
                'auditable' => [
                    'type' => $auditLog->auditable_type ? class_basename($auditLog->auditable_type) : null,
                    'id' => $auditLog->auditable_id,
                    'label' => $auditLog->auditable_label,
                    'url' => $this->entityUrl($auditLog),
                ],
                'old_values' => $auditLog->old_values ?? [],
                'new_values' => $auditLog->new_values ?? [],
                'metadata' => $auditLog->metadata ?? [],
                'request' => [
                    'method' => $auditLog->request_method,
                    'route_name' => $auditLog->route_name,
                    'url' => $auditLog->url,
                    'ip_address' => $auditLog->ip_address,
                    'user_agent' => $auditLog->user_agent,
                ],
                'batch_id' => $auditLog->batch_id,
                'tags' => $auditLog->tags ?? [],
            ],
            'relatedBatch' => $relatedBatch,
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $filters = $this->filters($request);
        $logs = $this->filteredQuery($filters)->latest('created_at')->cursor();
        $filename = 'audit-trail-'.now()->format('Ymd_His').'.csv';

        return response()->streamDownload(function () use ($logs): void {
            $handle = fopen('php://output', 'w');

            fputcsv($handle, [
                'id',
                'created_at',
                'event',
                'module',
                'category',
                'actor_name',
                'auditable_type',
                'auditable_id',
                'auditable_label',
                'description',
                'route_name',
                'request_method',
                'url',
                'ip_address',
                'batch_id',
            ]);

            foreach ($logs as $log) {
                fputcsv($handle, [
                    $log->id,
                    optional($log->created_at)->toDateTimeString(),
                    $log->event,
                    $log->module,
                    $log->category,
                    $log->actor_name,
                    $log->auditable_type ? class_basename($log->auditable_type) : null,
                    $log->auditable_id,
                    $log->auditable_label,
                    $log->description,
                    $log->route_name,
                    $log->request_method,
                    $log->url,
                    $log->ip_address,
                    $log->batch_id,
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function filters(Request $request): array
    {
        return $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'actor' => ['nullable', 'string', 'max:255'],
            'event' => ['nullable', 'string', 'max:120'],
            'module' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string', 'max:120'],
            'auditable_type' => ['nullable', 'string', 'max:255'],
            'route_name' => ['nullable', 'string', 'max:255'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);
    }

    private function filteredQuery(array $filters): Builder
    {
        return AuditLog::query()
            ->when(!empty($filters['search']), function (Builder $query) use ($filters): void {
                $search = trim((string) $filters['search']);

                $query->where(function (Builder $builder) use ($search): void {
                    $builder
                        ->where('event', 'like', "%{$search}%")
                        ->orWhere('module', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%")
                        ->orWhere('actor_name', 'like', "%{$search}%")
                        ->orWhere('auditable_label', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('route_name', 'like', "%{$search}%");
                });
            })
            ->when(!empty($filters['user_id']), function (Builder $query) use ($filters): void {
                $userId = (int) $filters['user_id'];

                $query->where(function (Builder $builder) use ($userId): void {
                    $builder
                        ->where(function (Builder $actorQuery) use ($userId): void {
                            $actorQuery
                                ->where('actor_type', User::class)
                                ->where('actor_id', $userId);
                        })
                        ->orWhere(function (Builder $auditableQuery) use ($userId): void {
                            $auditableQuery
                                ->where('auditable_type', User::class)
                                ->where('auditable_id', $userId);
                        });
                });
            })
            ->when(!empty($filters['actor']), fn (Builder $query) => $query->where('actor_name', 'like', '%'.trim((string) $filters['actor']).'%'))
            ->when(!empty($filters['event']), fn (Builder $query) => $query->where('event', $filters['event']))
            ->when(!empty($filters['module']), fn (Builder $query) => $query->where('module', $filters['module']))
            ->when(!empty($filters['category']), fn (Builder $query) => $query->where('category', $filters['category']))
            ->when(!empty($filters['auditable_type']), fn (Builder $query) => $query->where('auditable_type', $filters['auditable_type']))
            ->when(!empty($filters['route_name']), fn (Builder $query) => $query->where('route_name', $filters['route_name']))
            ->when(!empty($filters['from']), fn (Builder $query) => $query->whereDate('created_at', '>=', $filters['from']))
            ->when(!empty($filters['to']), fn (Builder $query) => $query->whereDate('created_at', '<=', $filters['to']));
    }

    private function listItem(AuditLog $log): array
    {
        return [
            'id' => $log->id,
            'event' => $log->event,
            'event_label' => str($log->event)->replace('_', ' ')->headline()->toString(),
            'module' => $log->module,
            'module_label' => str($log->module)->replace('_', ' ')->headline()->toString(),
            'category' => $log->category,
            'description' => $log->description,
            'actor_name' => $log->actor_name,
            'auditable_label' => $log->auditable_label,
            'auditable_type' => $log->auditable_type,
            'auditable_type_label' => $log->auditable_type ? class_basename($log->auditable_type) : null,
            'route_name' => $log->route_name,
            'request_method' => $log->request_method,
            'created_at' => optional($log->created_at)->toDateTimeString(),
            'is_critical' => $log->isCritical(),
            'batch_id' => $log->batch_id,
            'target_url' => $this->entityUrl($log),
        ];
    }

    private function entityUrl(AuditLog $log): ?string
    {
        if (!$log->auditable_id) {
            return null;
        }

        return match ($log->module) {
            'employees' => '/employees/'.$log->auditable_id,
            'users' => '/users/'.$log->auditable_id,
            'roles' => '/roles/'.$log->auditable_id,
            'permissions' => '/roles/matrix',
            'org_units' => '/org-units/'.$log->auditable_id,
            'locations' => '/locations/'.$log->auditable_id,
            'positions' => '/positions/'.$log->auditable_id,
            'workflows' => '/workflows/'.$log->auditable_id,
            'leave' => '/leave-requests/'.$log->auditable_id,
            'attendance' => '/attendance-records/'.$log->auditable_id,
            'timesheets' => '/timesheets/'.$log->auditable_id,
            'payroll' => '/payroll-exports/'.$log->auditable_id,
            'requisitions' => '/job-requisitions/'.$log->auditable_id,
            'candidates' => '/candidates/'.$log->auditable_id,
            'onboarding' => '/onboarding-tasks/'.$log->auditable_id,
            'offboarding' => '/offboarding-tasks/'.$log->auditable_id,
            'performance' => '/performance-reviews/'.$log->auditable_id,
            'learning' => '/learning-courses/'.$log->auditable_id,
            'documents' => '/documents/'.$log->auditable_id,
            'document_types' => '/document-types/'.$log->auditable_id,
            default => null,
        };
    }
}
