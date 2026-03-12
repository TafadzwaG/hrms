<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Writer\CSV\Writer as CsvWriter;
use OpenSpout\Writer\ODS\Writer as OdsWriter;
use OpenSpout\Writer\WriterInterface;
use OpenSpout\Writer\XLSX\Writer as XlsxWriter;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

abstract class BaseReportController extends Controller
{
    protected function exportRows(
        Request $request,
        string $baseFilename,
        array $headers,
        iterable $rows
    ): BinaryFileResponse {
        $format = strtolower((string) $request->get('format', 'xlsx'));
        if (! in_array($format, ['xlsx', 'csv', 'ods'], true)) {
            $format = 'xlsx';
        }

        $tmpPath = sys_get_temp_dir().DIRECTORY_SEPARATOR.Str::uuid().'.'.$format;
        $writer = $this->makeWriter($format);

        $writer->openToFile($tmpPath);
        $writer->addRow(Row::fromValues($headers));

        foreach ($rows as $row) {
            $ordered = [];
            foreach ($headers as $header) {
                $ordered[] = $this->normalizeCellValue(data_get($row, $header));
            }
            $writer->addRow(Row::fromValues($ordered));
        }

        $writer->close();

        return response()->download(
            $tmpPath,
            $baseFilename.'.'.$format,
            ['Content-Type' => $this->contentType($format)]
        )->deleteFileAfterSend(true);
    }

    protected function downloadRegisterReport(
        Request $request,
        string $modelClass,
        string $baseFilename,
        array $preferredColumns
    ): BinaryFileResponse {
        $columns = $this->existingColumns($modelClass, $preferredColumns);
        $query = $this->newQuery($modelClass);

        $this->applySearch($query, $request, $columns);
        $this->applyDateRangeIfPossible($query, $request, $modelClass);

        $sortColumn = $this->defaultSortColumn($modelClass);

        $rows = $query
            ->when($sortColumn, fn (Builder $q) => $q->orderByDesc($sortColumn))
            ->get($columns)
            ->map(fn (Model $model) => $this->modelToArray($model, $columns))
            ->all();

        return $this->exportRows($request, $baseFilename, $columns, $rows);
    }

    protected function downloadGroupedCountReport(
        Request $request,
        string $modelClass,
        string $groupColumn,
        string $baseFilename
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $groupColumn)) {
            return $this->exportRows($request, $baseFilename, ['group', 'count'], []);
        }

        $query = $this->newQuery($modelClass);
        $this->applyDateRangeIfPossible($query, $request, $modelClass);

        $rows = $query
            ->get([$groupColumn])
            ->groupBy(fn (Model $row) => (string) ($row->{$groupColumn} ?? 'Unspecified'))
            ->map(fn (Collection $items, string $group) => [
                'group' => $group !== '' ? $group : 'Unspecified',
                'count' => $items->count(),
            ])
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, ['group', 'count'], $rows);
    }

    protected function downloadGroupedSumReport(
        Request $request,
        string $modelClass,
        string $groupColumn,
        string $sumColumn,
        string $baseFilename
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $groupColumn) || ! $this->hasColumn($modelClass, $sumColumn)) {
            return $this->exportRows($request, $baseFilename, ['group', 'total'], []);
        }

        $query = $this->newQuery($modelClass);
        $this->applyDateRangeIfPossible($query, $request, $modelClass);

        $rows = $query
            ->get([$groupColumn, $sumColumn])
            ->groupBy(fn (Model $row) => (string) ($row->{$groupColumn} ?? 'Unspecified'))
            ->map(fn (Collection $items, string $group) => [
                'group' => $group !== '' ? $group : 'Unspecified',
                'total' => $items->sum(fn (Model $item) => (float) ($item->{$sumColumn} ?? 0)),
            ])
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, ['group', 'total'], $rows);
    }

    protected function downloadDateTrendReport(
        Request $request,
        string $modelClass,
        string $dateColumn,
        string $baseFilename,
        string $bucket = 'month'
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $dateColumn)) {
            return $this->exportRows($request, $baseFilename, ['period', 'count'], []);
        }

        $query = $this->newQuery($modelClass);
        $this->applyDateRange($query, $request, $dateColumn);

        $rows = $query
            ->whereNotNull($dateColumn)
            ->get([$dateColumn])
            ->groupBy(function (Model $row) use ($dateColumn, $bucket) {
                $value = $row->{$dateColumn};
                if (! $value) {
                    return 'Unknown';
                }

                $date = $value instanceof DateTimeInterface ? Carbon::instance($value) : Carbon::parse($value);

                return $bucket === 'day'
                    ? $date->format('Y-m-d')
                    : $date->format('Y-m');
            })
            ->map(fn (Collection $items, string $period) => [
                'period' => $period,
                'count' => $items->count(),
            ])
            ->sortBy('period')
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, ['period', 'count'], $rows);
    }

    protected function downloadMissingValuesReport(
        Request $request,
        string $modelClass,
        array $requiredColumns,
        string $baseFilename,
        array $displayColumns = []
    ): BinaryFileResponse {
        $display = $this->existingColumns($modelClass, ! empty($displayColumns) ? $displayColumns : $requiredColumns);

        $rows = $this->newQuery($modelClass)
            ->get($this->existingColumns($modelClass, array_unique(array_merge($display, $requiredColumns))))
            ->filter(function (Model $row) use ($requiredColumns) {
                foreach ($requiredColumns as $column) {
                    if (! isset($row->{$column}) || $row->{$column} === '' || $row->{$column} === null) {
                        return true;
                    }
                }

                return false;
            })
            ->map(fn (Model $row) => $this->modelToArray($row, $display))
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, $display, $rows);
    }

    protected function downloadContainsReport(
        Request $request,
        string $modelClass,
        string $column,
        string $needle,
        string $baseFilename,
        array $displayColumns
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $column)) {
            return $this->exportRows($request, $baseFilename, $displayColumns, []);
        }

        $display = $this->existingColumns($modelClass, array_unique(array_merge([$column], $displayColumns)));

        $rows = $this->newQuery($modelClass)
            ->get($display)
            ->filter(fn (Model $row) => str_contains(strtolower((string) ($row->{$column} ?? '')), strtolower($needle)))
            ->map(fn (Model $row) => $this->modelToArray($row, $displayColumns))
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, $displayColumns, $rows);
    }

    protected function downloadOverdueReport(
        Request $request,
        string $modelClass,
        string $dueDateColumn,
        string $statusColumn,
        array $doneValues,
        string $baseFilename,
        array $displayColumns
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $dueDateColumn) || ! $this->hasColumn($modelClass, $statusColumn)) {
            return $this->exportRows($request, $baseFilename, $displayColumns, []);
        }

        $display = $this->existingColumns($modelClass, array_unique(array_merge([$dueDateColumn, $statusColumn], $displayColumns)));
        $done = array_map('strtolower', $doneValues);

        $rows = $this->newQuery($modelClass)
            ->whereNotNull($dueDateColumn)
            ->get($display)
            ->filter(function (Model $row) use ($dueDateColumn, $statusColumn, $done) {
                $due = $row->{$dueDateColumn};
                if (! $due) {
                    return false;
                }

                $status = strtolower((string) ($row->{$statusColumn} ?? ''));

                return Carbon::parse($due)->isPast() && ! in_array($status, $done, true);
            })
            ->map(fn (Model $row) => $this->modelToArray($row, $displayColumns))
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, $displayColumns, $rows);
    }

    protected function downloadExpiringReport(
        Request $request,
        string $modelClass,
        string $expiryColumn,
        string $baseFilename,
        array $displayColumns,
        int $days = 30
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $expiryColumn)) {
            return $this->exportRows($request, $baseFilename, $displayColumns, []);
        }

        $display = $this->existingColumns($modelClass, array_unique(array_merge([$expiryColumn], $displayColumns)));
        $now = now();
        $cutoff = now()->addDays($days);

        $rows = $this->newQuery($modelClass)
            ->whereNotNull($expiryColumn)
            ->get($display)
            ->filter(function (Model $row) use ($expiryColumn, $now, $cutoff) {
                $expiry = $row->{$expiryColumn};
                if (! $expiry) {
                    return false;
                }

                $date = Carbon::parse($expiry);

                return $date->between($now, $cutoff);
            })
            ->map(fn (Model $row) => $this->modelToArray($row, $displayColumns))
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, $displayColumns, $rows);
    }

    protected function downloadExpiredReport(
        Request $request,
        string $modelClass,
        string $expiryColumn,
        string $baseFilename,
        array $displayColumns
    ): BinaryFileResponse {
        if (! $this->hasColumn($modelClass, $expiryColumn)) {
            return $this->exportRows($request, $baseFilename, $displayColumns, []);
        }

        $display = $this->existingColumns($modelClass, array_unique(array_merge([$expiryColumn], $displayColumns)));

        $rows = $this->newQuery($modelClass)
            ->whereNotNull($expiryColumn)
            ->get($display)
            ->filter(fn (Model $row) => Carbon::parse($row->{$expiryColumn})->isPast())
            ->map(fn (Model $row) => $this->modelToArray($row, $displayColumns))
            ->values()
            ->all();

        return $this->exportRows($request, $baseFilename, $displayColumns, $rows);
    }

    protected function existingColumns(string $modelClass, array $preferredColumns): array
    {
        $existing = $this->tableColumns($modelClass);

        return array_values(array_filter($preferredColumns, fn (string $column) => in_array($column, $existing, true)));
    }

    protected function hasColumn(string $modelClass, string $column): bool
    {
        return in_array($column, $this->tableColumns($modelClass), true);
    }

    protected function tableColumns(string $modelClass): array
    {
        /** @var Model $model */
        $model = new $modelClass;

        return Schema::getColumnListing($model->getTable());
    }

    protected function newQuery(string $modelClass): Builder
    {
        return $modelClass::query();
    }

    protected function applySearch(Builder $query, Request $request, array $columns): void
    {
        $search = trim((string) $request->get('search', ''));

        if ($search === '' || empty($columns)) {
            return;
        }

        $query->where(function (Builder $builder) use ($columns, $search) {
            foreach ($columns as $index => $column) {
                if ($index === 0) {
                    $builder->where($column, 'like', "%{$search}%");
                } else {
                    $builder->orWhere($column, 'like', "%{$search}%");
                }
            }
        });
    }

    protected function applyDateRangeIfPossible(Builder $query, Request $request, string $modelClass): void
    {
        $candidateColumns = [
            'work_date',
            'period_start',
            'period_end',
            'start_date',
            'end_date',
            'hire_date',
            'termination_date',
            'exported_at',
            'created_at',
            'updated_at',
        ];

        foreach ($candidateColumns as $column) {
            if ($this->hasColumn($modelClass, $column)) {
                $this->applyDateRange($query, $request, $column);

                return;
            }
        }
    }

    protected function applyDateRange(Builder $query, Request $request, string $column): void
    {
        $from = $request->get('date_from');
        $to = $request->get('date_to');

        if ($from) {
            $query->whereDate($column, '>=', $from);
        }

        if ($to) {
            $query->whereDate($column, '<=', $to);
        }
    }

    protected function defaultSortColumn(string $modelClass): ?string
    {
        foreach ([
            'exported_at',
            'work_date',
            'period_end',
            'period_start',
            'start_date',
            'hire_date',
            'created_at',
            'updated_at',
            'id',
        ] as $column) {
            if ($this->hasColumn($modelClass, $column)) {
                return $column;
            }
        }

        return null;
    }

    protected function modelToArray(Model $model, array $columns): array
    {
        $data = [];
        foreach ($columns as $column) {
            $data[$column] = $this->normalizeCellValue($model->{$column} ?? null);
        }

        return $data;
    }

    protected function normalizeCellValue(mixed $value): mixed
    {
        if ($value instanceof DateTimeInterface) {
            return Carbon::instance($value)->format('Y-m-d H:i:s');
        }

        if (is_bool($value)) {
            return $value ? 'Yes' : 'No';
        }

        if (is_array($value) || is_object($value)) {
            return json_encode($value);
        }

        return $value;
    }

    protected function makeWriter(string $format): WriterInterface
    {
        return match ($format) {
            'csv' => new CsvWriter,
            'ods' => new OdsWriter,
            default => new XlsxWriter,
        };
    }

    protected function contentType(string $format): string
    {
        return match ($format) {
            'csv' => 'text/csv',
            'ods' => 'application/vnd.oasis.opendocument.spreadsheet',
            default => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        };
    }
}
