import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

type PermissionItem = {
    id: number;
    name: string;
    label: string;
    description: string | null;
    module: string;
};

type PermissionGroup = {
    key: string;
    label: string;
    description: string;
    permissions: PermissionItem[];
};

type PermissionSelectorProps = {
    groups: PermissionGroup[];
    selectedIds: number[];
    onChange: (next: number[]) => void;
    disabled?: boolean;
    error?: string;
};

export function PermissionSelector({ groups, selectedIds, onChange, disabled = false, error }: PermissionSelectorProps) {
    const togglePermission = (permissionId: number) => {
        if (disabled) return;

        if (selectedIds.includes(permissionId)) {
            onChange(selectedIds.filter((id) => id !== permissionId));
            return;
        }

        onChange([...selectedIds, permissionId]);
    };

    const toggleGroup = (group: PermissionGroup) => {
        if (disabled) return;

        const groupIds = group.permissions.map((permission) => permission.id);
        const allSelected = groupIds.length > 0 && groupIds.every((id) => selectedIds.includes(id));

        if (allSelected) {
            onChange(selectedIds.filter((id) => !groupIds.includes(id)));
            return;
        }

        onChange(Array.from(new Set([...selectedIds, ...groupIds])));
    };

    const toggleAll = () => {
        if (disabled) return;

        const allIds = groups.flatMap((group) => group.permissions.map((permission) => permission.id));
        const everySelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));

        onChange(everySelected ? [] : allIds);
    };

    const totalPermissions = groups.reduce((total, group) => total + group.permissions.length, 0);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-foreground">Permission coverage</p>
                    <p className="text-sm text-muted-foreground">
                        {selectedIds.length} of {totalPermissions} permissions selected.
                    </p>
                </div>
                <Button type="button" variant="outline" onClick={toggleAll} disabled={disabled}>
                    {selectedIds.length === totalPermissions ? 'Clear all permissions' : 'Select all permissions'}
                </Button>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
                {groups.map((group) => {
                    const groupIds = group.permissions.map((permission) => permission.id);
                    const selectedCount = groupIds.filter((id) => selectedIds.includes(id)).length;
                    const allSelected = groupIds.length > 0 && selectedCount === groupIds.length;

                    return (
                        <Card key={group.key} className="rounded-2xl border-border shadow-sm">
                            <CardHeader className="border-b border-border/60 pb-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-base font-semibold">{group.label}</CardTitle>
                                        <CardDescription className="mt-1 text-sm text-muted-foreground">
                                            {group.description}
                                        </CardDescription>
                                    </div>
                                    <Button type="button" variant="ghost" className="h-8 px-3 text-xs" onClick={() => toggleGroup(group)} disabled={disabled}>
                                        {allSelected ? 'Clear module' : 'Select module'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 p-5">
                                {group.permissions.map((permission) => {
                                    const checked = selectedIds.includes(permission.id);

                                    return (
                                        <label
                                            key={permission.id}
                                            className={cn(
                                                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors',
                                                checked ? 'border-primary/40 bg-primary/5' : 'border-border bg-background hover:bg-muted/30',
                                                disabled && 'cursor-not-allowed opacity-60',
                                            )}
                                        >
                                            <Checkbox checked={checked} onCheckedChange={() => togglePermission(permission.id)} disabled={disabled} className="mt-0.5" />
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium text-foreground">{permission.label}</div>
                                                <div className="text-xs leading-5 text-muted-foreground">{permission.description || permission.name}</div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}
        </div>
    );
}
