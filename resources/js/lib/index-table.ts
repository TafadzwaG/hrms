export type SortDirection = 'asc' | 'desc';

export type SortableFilters = {
    sort?: string | null;
    direction?: SortDirection | null;
    [key: string]: string | number | boolean | null | undefined;
};

export function buildIndexParams(
    filters: SortableFilters,
    overrides: SortableFilters = {},
    options: { resetPage?: boolean } = {},
) {
    const merged: SortableFilters = {
        ...filters,
        ...overrides,
    };

    if (options.resetPage ?? true) {
        delete merged.page;
    }

    return Object.fromEntries(
        Object.entries(merged).filter(([, value]) => {
            if (value === null || value === undefined) {
                return false;
            }

            if (typeof value === 'string') {
                return value.length > 0;
            }

            return true;
        }),
    );
}
