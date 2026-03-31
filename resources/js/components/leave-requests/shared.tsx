import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Users } from 'lucide-react';

export type LeaveEmployeeOption = {
    id: number;
    staff_number?: string | null;
    first_name?: string | null;
    middle_name?: string | null;
    surname?: string | null;
    full_name?: string | null;
    department?: string | null;
    position?: string | null;
};

export type LeaveBalanceSummary = {
    key: string;
    type: string;
    total: number;
    taken: number;
    remaining: number;
};

export type LeaveRecentRequest = {
    id: number;
    leave_type: string;
    days: number;
    status: string;
    status_tone?: string | null;
    start_date?: string | null;
    end_date?: string | null;
};

export type LeaveEmployeeContext = {
    id: number;
    full_name: string;
    initials: string;
    staff_number?: string | null;
    department?: string | null;
    position?: string | null;
    manager?: string | null;
    balances: LeaveBalanceSummary[];
    recent_requests: LeaveRecentRequest[];
};

export type LeaveStats = {
    total_requests: number;
    pending_requests: number;
    approved_days: number;
    upcoming_requests: number;
    active_absences?: number;
};

export type LeaveCalendarEntry = {
    id: number;
    title: string;
    subtitle: string;
    status: string;
    tone: string;
};

export type LeaveCalendarDay = {
    date: string;
    label: string;
    current_month: boolean;
    is_today: boolean;
    is_weekend: boolean;
    entries: LeaveCalendarEntry[];
};

export type LeaveCalendar = {
    month: string;
    label: string;
    entry_count: number;
    weeks: LeaveCalendarDay[][];
};

export type LeaveStatCard = {
    key: string;
    label: string;
    value: string;
    hint: string;
    icon: LucideIcon;
};

const toneClassMap: Record<string, string> = {
    approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    rejected: 'border-rose-200 bg-rose-50 text-rose-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-700',
    pending: 'border-blue-200 bg-blue-50 text-blue-700',
};

export function formatLeaveDays(value: number): string {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

export function leaveIconMap() {
    return {
        total: CalendarDays,
        pending: Clock3,
        approved: CheckCircle2,
        active: Users,
    };
}

export function leaveStatusToneClass(tone?: string | null) {
    return tone ? toneClassMap[tone] ?? toneClassMap.pending : toneClassMap.pending;
}

export function LeaveStatusBadge({
    status,
    tone,
    className,
}: {
    status: string;
    tone?: string | null;
    className?: string;
}) {
    return (
        <Badge
            variant="outline"
            className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase', leaveStatusToneClass(tone), className)}
        >
            {status}
        </Badge>
    );
}

export function LeaveStatsGrid({
    items,
    className,
}: {
    items: LeaveStatCard[];
    className?: string;
}) {
    return (
        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
            {items.map((item) => (
                <Card key={item.key} className="border-border/70 bg-card shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                                    {item.label}
                                </p>
                                <p className="text-3xl font-semibold tracking-tight text-foreground">{item.value}</p>
                                <p className="text-xs text-muted-foreground">{item.hint}</p>
                            </div>

                            <div className="rounded-lg border border-border/60 bg-muted/40 p-2.5">
                                <item.icon className="h-4.5 w-4.5 text-foreground" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function filterLeaveCalendar(
    calendar: LeaveCalendar,
    predicate: (entry: LeaveCalendarEntry) => boolean,
): LeaveCalendar {
    const weeks = calendar.weeks.map((week) =>
        week.map((day) => ({
            ...day,
            entries: day.entries.filter(predicate),
        })),
    );

    return {
        ...calendar,
        entry_count: weeks.reduce(
            (count, week) => count + week.reduce((weekCount, day) => weekCount + day.entries.length, 0),
            0,
        ),
        weeks,
    };
}

export function LeaveCalendarCard({
    title,
    description,
    calendar,
    emptyMessage,
    onPreviousMonth,
    onNextMonth,
    className,
}: {
    title: string;
    description: string;
    calendar: LeaveCalendar;
    emptyMessage: string;
    onPreviousMonth?: () => void;
    onNextMonth?: () => void;
    className?: string;
}) {
    return (
        <Card className={cn('border-border/70 bg-card shadow-sm', className)}>
            <CardHeader className="space-y-1 border-b border-border/60 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onPreviousMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="min-w-28 text-center text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                            {calendar.label}
                        </span>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={onNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 p-4">
                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day}>{day}</div>
                    ))}
                </div>

                <div className="space-y-2">
                    {calendar.weeks.map((week, index) => (
                        <div key={`${calendar.month}-${index}`} className="grid grid-cols-7 gap-2">
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    className={cn(
                                        'min-h-28 rounded-xl border border-border/60 bg-background/80 p-2',
                                        !day.current_month && 'opacity-45',
                                        day.is_weekend && 'bg-muted/25',
                                        day.is_today && 'ring-1 ring-foreground/20',
                                    )}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-foreground">{day.label}</span>
                                        {day.entries.length > 0 ? (
                                            <span className="text-[10px] text-muted-foreground">{day.entries.length}</span>
                                        ) : null}
                                    </div>

                                    <div className="space-y-1">
                                        {day.entries.slice(0, 2).map((entry) => (
                                            <div
                                                key={`${day.date}-${entry.id}-${entry.title}`}
                                                className={cn(
                                                    'rounded-md border px-2 py-1 text-[10px]',
                                                    leaveStatusToneClass(entry.tone),
                                                )}
                                            >
                                                <p className="truncate font-semibold">{entry.title}</p>
                                                <p className="truncate opacity-80">{entry.subtitle}</p>
                                            </div>
                                        ))}

                                        {day.entries.length > 2 ? (
                                            <div className="px-1 text-[10px] text-muted-foreground">
                                                +{day.entries.length - 2} more
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {calendar.entry_count === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
                        {emptyMessage}
                    </div>
                ) : null}
            </CardContent>
        </Card>
    );
}
