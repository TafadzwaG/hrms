<?php

namespace App\Support\IndexTables;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class IndexTableSorter
{
    /**
     * @param  array<string, string|array<int, string>|Closure>  $sortMap
     * @return array{sort: string, direction: 'asc'|'desc'}
     */
    public static function resolve(Request $request, array $sortMap, string $defaultSort, string $defaultDirection = 'asc'): array
    {
        $sort = (string) $request->input('sort', $defaultSort);

        if (! array_key_exists($sort, $sortMap)) {
            $sort = $defaultSort;
        }

        $direction = strtolower((string) $request->input('direction', $defaultDirection)) === 'desc'
            ? 'desc'
            : 'asc';

        return [
            'sort' => $sort,
            'direction' => $direction,
        ];
    }

    /**
     * @param  array<string, string|array<int, string>|Closure>  $sortMap
     */
    public static function apply(Builder $query, array $sortMap, string $sort, string $direction): void
    {
        $handler = $sortMap[$sort] ?? null;

        if ($handler instanceof Closure) {
            $handler($query, $direction);

            return;
        }

        foreach ((array) $handler as $column) {
            $query->orderBy($column, $direction);
        }
    }
}
