import { Link } from '@inertiajs/react';
import { Moon, Settings2, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { edit as editProfile } from '@/routes/profile';

export function DashboardThemeToggle() {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const isDark = resolvedAppearance === 'dark';

    return (
        <div className="flex items-center gap-2">
            <Button asChild type="button" variant="outline" size="icon" className="shadow-sm">
                <Link href={editProfile().url} aria-label="Open settings">
                    <Settings2 className="h-4 w-4" />
                </Link>
            </Button>

            <div className="flex items-center gap-2 rounded-full border border-border/70 bg-background/95 px-3 py-1.5 shadow-sm">
                <Sun
                    className={cn(
                        'h-3.5 w-3.5 transition-colors',
                        isDark ? 'text-muted-foreground' : 'text-foreground',
                    )}
                />
                <Switch
                    checked={isDark}
                    onCheckedChange={(checked) =>
                        updateAppearance(checked ? 'dark' : 'light')
                    }
                    aria-label={
                        isDark ? 'Switch to light mode' : 'Switch to dark mode'
                    }
                />
                <Moon
                    className={cn(
                        'h-3.5 w-3.5 transition-colors',
                        isDark ? 'text-foreground' : 'text-muted-foreground',
                    )}
                />
            </div>
        </div>
    );
}
