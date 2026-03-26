import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function PayrollDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <div className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
                <Card className="border-border/70 bg-background/95 shadow-sm">
                    <CardHeader>
                        <CardTitle>Payroll control room</CardTitle>
                        <CardDescription>Current payroll state, delivery risk, and operational next steps.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FocusCardGrid cards={dashboard.focus_cards} />
                    </CardContent>
                </Card>
                <AlertsPanel alerts={dashboard.alerts} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <ChartGrid charts={dashboard.charts} />
                <QuickActionsPanel actions={dashboard.quick_actions} />
            </div>
            <ListGrid lists={dashboard.lists} columns={3} />
            <ShortcutGrid shortcuts={dashboard.shortcuts} />
        </div>
    );
}
