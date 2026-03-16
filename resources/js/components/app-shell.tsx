import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

type Props = {
    children: ReactNode;
    variant?: 'header' | 'sidebar';
};

export function AppShell({ children, variant = 'header' }: Props) {
    const isOpen = usePage().props.sidebarOpen;
    const shared = usePage().props as {
        system_settings?: {
            branding?: {
                primary_color?: string | null;
                secondary_color?: string | null;
                accent_color?: string | null;
            };
        };
    };

    const branding = shared.system_settings?.branding;

    useEffect(() => {
        const root = document.documentElement;

        const apply = (name: string, value?: string | null) => {
            if (value && value.trim() !== '') {
                root.style.setProperty(name, value);
            } else {
                root.style.removeProperty(name);
            }
        };

        apply('--primary', branding?.primary_color);
        apply('--secondary', branding?.secondary_color);
        apply('--accent', branding?.accent_color);

        // Keep sidebar accents aligned with brand colors when provided.
        apply('--sidebar-primary', branding?.primary_color);
        apply('--sidebar-accent', branding?.accent_color);
    }, [branding?.primary_color, branding?.secondary_color, branding?.accent_color]);

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.08),transparent_36%),radial-gradient(circle_at_100%_0%,rgba(20,184,166,0.08),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.06),transparent_45%)]">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <div className="flex min-h-screen w-full bg-[radial-gradient(circle_at_0%_0%,rgba(99,102,241,0.08),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(20,184,166,0.09),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.07),transparent_46%)]">
                {children}
            </div>
        </SidebarProvider>
    );
}
