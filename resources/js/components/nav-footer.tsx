import { Link } from '@inertiajs/react';
import type { ComponentPropsWithoutRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

type NavGroup = {
    title: string;
    icon?: LucideIcon | null;
    items: NavItem[];
};

export function NavFooter({
    items = [],
    groups,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items?: NavItem[];
    groups?: NavGroup[];
}) {
    const { currentUrl } = useCurrentUrl();

    const isCurrentOrWithin = (href: NavItem['href']) => {
        const urlString = toUrl(href);

        if (!urlString.startsWith('http')) {
            return currentUrl === urlString || currentUrl.startsWith(`${urlString}/`);
        }

        try {
            const absoluteUrl = new URL(urlString);
            return (
                currentUrl === absoluteUrl.pathname ||
                currentUrl.startsWith(`${absoluteUrl.pathname}/`)
            );
        } catch {
            return false;
        }
    };

    const menuButtonClassName =
        'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-teal-950/20 transition-colors duration-200';

    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {groups && groups.length > 0
                        ? groups.map((group) => (
                              <Collapsible
                                  key={group.title}
                                  asChild
                                  defaultOpen={group.items.some((item) =>
                                      isCurrentOrWithin(item.href),
                                  )}
                                  className="group/collapsible"
                              >
                                  <SidebarMenuItem>
                                      <CollapsibleTrigger asChild>
                                          <SidebarMenuButton
                                              className={`${menuButtonClassName} data-[state=open]:[&>svg:last-child]:rotate-180`}
                                          >
                                              {group.icon && (
                                                  <group.icon className="size-5 transition-transform group-hover:scale-110" />
                                              )}
                                              <span className="font-medium">
                                                  {group.title}
                                              </span>
                                              <ChevronDown className="ml-auto size-4 shrink-0 transition-transform group-data-[collapsible=icon]:hidden" />
                                          </SidebarMenuButton>
                                      </CollapsibleTrigger>

                                      <CollapsibleContent>
                                          <SidebarMenuSub>
                                              {group.items.map((item) => (
                                                  <SidebarMenuSubItem
                                                      key={item.title}
                                                  >
                                                      <SidebarMenuSubButton
                                                          asChild
                                                          className={
                                                              menuButtonClassName
                                                          }
                                                      >
                                                          <Link
                                                              href={item.href}
                                                              className="flex items-center gap-2"
                                                          >
                                                              {item.icon && (
                                                                  <item.icon className="size-4 transition-transform group-hover:scale-110" />
                                                              )}
                                                              <span className="font-medium">
                                                                  {item.title}
                                                              </span>
                                                          </Link>
                                                      </SidebarMenuSubButton>
                                                  </SidebarMenuSubItem>
                                              ))}
                                          </SidebarMenuSub>
                                      </CollapsibleContent>
                                  </SidebarMenuItem>
                              </Collapsible>
                          ))
                        : items.map((item) => (
                              <SidebarMenuItem key={item.title}>
                                  <SidebarMenuButton
                                      asChild
                                      // Applied the Slate/Indigo HR color scheme
                                      className={menuButtonClassName}
                                  >
                                      {/* Replaced <a> with Inertia Link for SPA navigation */}
                                      <Link
                                          href={item.href}
                                          className="flex items-center gap-2"
                                      >
                                          {item.icon && (
                                              <item.icon className="size-5 transition-transform group-hover:scale-110" />
                                          )}
                                          <span className="font-medium">
                                              {item.title}
                                          </span>
                                      </Link>
                                  </SidebarMenuButton>
                              </SidebarMenuItem>
                          ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
