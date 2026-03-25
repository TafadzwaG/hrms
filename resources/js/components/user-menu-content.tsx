import { Link, router } from '@inertiajs/react';
import { BriefcaseBusiness, Building2, Check, LogOut, Settings, UserRound } from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import type { PortalType, User } from '@/types';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const availablePortals = user.available_portals ?? [];
    const activePortal = user.active_portal ?? user.primary_portal;
    const portalSwitchUrls = user.portal_switch_urls ?? {};

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const portalMeta: Record<PortalType, { label: string; icon: typeof BriefcaseBusiness }> = {
        employee: { label: 'Employee Portal', icon: BriefcaseBusiness },
        candidate: { label: 'Candidate Portal', icon: UserRound },
        employer: { label: 'Employer Portal', icon: Building2 },
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full cursor-pointer"
                        href={edit()}
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings className="mr-2" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            {availablePortals.length > 1 ? (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="px-2 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Switch Portal
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                        {availablePortals.map((portal) => {
                            const meta = portalMeta[portal];
                            const Icon = meta.icon;
                            const href = portalSwitchUrls[portal];

                            return (
                                <DropdownMenuItem asChild key={portal}>
                                    <Link
                                        className="flex w-full cursor-pointer items-center"
                                        href={href ?? '#'}
                                        onClick={cleanup}
                                    >
                                        <Icon className="mr-2" />
                                        <span className="flex-1">{meta.label}</span>
                                        {activePortal === portal ? <Check className="ml-2 h-4 w-4" /> : null}
                                    </Link>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuGroup>
                </>
            ) : null}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href={logout()}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
