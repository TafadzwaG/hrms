import { Link } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                // Applied the Slate/Indigo HR color scheme
                                className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-teal-950/20 transition-colors duration-200"
                            >
                                {/* Replaced <a> with Inertia Link for SPA navigation */}
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2"
                                >
                                    {item.icon && (
                                        <item.icon className="size-5 transition-transform group-hover:scale-110" />
                                    )}
                                    <span className="font-medium">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}