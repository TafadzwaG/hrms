import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const page = usePage();
    const shared = page.props as {
        name?: string;
        system_settings?: {
            system?: {
                system_name?: string;
                system_short_name?: string | null;
                system_logo_url?: string | null;
            };
        };
    };

    const system = shared.system_settings?.system;
    const label =
        system?.system_short_name ||
        system?.system_name ||
        shared.name ||
        'HRMS';
    const logoUrl = system?.system_logo_url ?? null;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={label}
                        className="size-5 object-contain"
                    />
                ) : (
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {label}
                </span>
            </div>
        </>
    );
}
