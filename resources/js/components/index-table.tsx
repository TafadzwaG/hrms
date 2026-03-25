import { router } from '@inertiajs/react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import ReactPaginate from 'react-paginate';
import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { TableCell, TableHead, TableRow } from '@/components/ui/table';
import { buildIndexParams, type SortDirection, type SortableFilters } from '@/lib/index-table';
import { cn } from '@/lib/utils';

type SortableTableHeadProps = {
    filters: SortableFilters;
    sortKey: string;
    path: string;
    children: ReactNode;
    className?: string;
    align?: 'left' | 'center' | 'right';
};

type IndexTablePaginationProps = {
    pagination: {
        current_page: number;
        last_page: number;
        total: number;
        per_page?: number;
        from?: number | null;
        to?: number | null;
    };
    filters: SortableFilters;
    path: string;
    label?: string;
};

export function IndexTableCard({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <Card
            className={cn(
                'flex flex-col overflow-hidden border-border bg-background shadow-sm',
                className,
            )}
        >
            {children}
        </Card>
    );
}

export function IndexTableHeaderRow({
    className,
    ...props
}: React.ComponentProps<typeof TableRow>) {
    return (
        <TableRow
            className={cn(
                'border-b border-border/50 bg-muted/10 hover:bg-transparent',
                className,
            )}
            {...props}
        />
    );
}

export function IndexTableHead({
    className,
    align = 'left',
    ...props
}: React.ComponentProps<typeof TableHead> & {
    align?: 'left' | 'center' | 'right';
}) {
    return (
        <TableHead
            className={cn(
                'h-12 text-[10px] font-bold tracking-widest text-muted-foreground uppercase',
                align === 'center' && 'text-center',
                align === 'right' && 'text-right',
                className,
            )}
            {...props}
        />
    );
}

export function SortableTableHead({
    filters,
    sortKey,
    path,
    children,
    className,
    align = 'left',
}: SortableTableHeadProps) {
    const currentSort = filters.sort ?? null;
    const currentDirection = (filters.direction ?? 'asc') as SortDirection;
    const isActive = currentSort === sortKey;
    const nextDirection: SortDirection =
        isActive && currentDirection === 'asc' ? 'desc' : 'asc';

    const Icon = !isActive
        ? ArrowUpDown
        : currentDirection === 'asc'
          ? ArrowUp
          : ArrowDown;

    return (
        <IndexTableHead align={align} className={className}>
            <button
                type="button"
                onClick={() =>
                    router.get(
                        path,
                        buildIndexParams(
                            filters,
                            {
                                sort: sortKey,
                                direction: nextDirection,
                                page: 1,
                            },
                            { resetPage: false },
                        ),
                        {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        },
                    )
                }
                className={cn(
                    'inline-flex items-center gap-1.5 transition-colors hover:text-foreground',
                    align === 'center' && 'mx-auto justify-center',
                    align === 'right' && 'ml-auto justify-end',
                )}
            >
                <span>{children}</span>
                <Icon className="h-3.5 w-3.5" />
            </button>
        </IndexTableHead>
    );
}

export function IndexTableEmptyRow({
    colSpan,
    children,
}: {
    colSpan: number;
    children: ReactNode;
}) {
    return (
        <TableRow>
            <TableCell
                colSpan={colSpan}
                className="h-48 text-center text-sm font-medium text-muted-foreground"
            >
                {children}
            </TableCell>
        </TableRow>
    );
}

export function IndexTablePagination({
    pagination,
    filters,
    path,
    label = 'results',
}: IndexTablePaginationProps) {
    const perPage = pagination.per_page || 1;
    const showingFrom =
        pagination.from ??
        (pagination.total === 0 ? 0 : (pagination.current_page - 1) * perPage + 1);
    const showingTo =
        pagination.to ??
        Math.min(pagination.current_page * perPage, pagination.total);

    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-border/50 bg-muted/5 p-4 sm:flex-row">
            <span className="text-sm font-medium text-muted-foreground">
                Showing <span className="font-bold text-foreground">{showingFrom}</span>{' '}
                to <span className="font-bold text-foreground">{showingTo}</span>{' '}
                of <span className="font-bold text-foreground">{pagination.total}</span>{' '}
                {label}
            </span>
            <ReactPaginate
                pageCount={pagination.last_page}
                forcePage={pagination.current_page - 1}
                onPageChange={({ selected }) =>
                    router.get(
                        path,
                        buildIndexParams(
                            filters,
                            { page: selected + 1 },
                            { resetPage: false },
                        ),
                        { preserveScroll: true, preserveState: true },
                    )
                }
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="..."
                containerClassName="flex items-center gap-1"
                pageLinkClassName="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent text-sm font-bold text-muted-foreground shadow-none transition-colors hover:bg-muted"
                activeLinkClassName="!rounded-md !border-foreground !bg-foreground font-bold !text-background hover:!bg-foreground/90"
                previousLinkClassName="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                nextLinkClassName="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                breakClassName="flex h-9 w-9 items-center justify-center text-sm font-bold text-muted-foreground"
                disabledClassName="pointer-events-none opacity-50"
            />
        </div>
    );
}
