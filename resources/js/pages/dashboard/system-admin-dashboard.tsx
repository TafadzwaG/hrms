import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function SystemAdminDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <AlertsPanel alerts={dashboard.alerts} />
                <QuickActionsPanel actions={dashboard.quick_actions} />
            </div>
            <FocusCardGrid cards={dashboard.focus_cards} />
            <ChartGrid charts={dashboard.charts} />
            <ListGrid lists={dashboard.lists} columns={3} />
            <ShortcutGrid shortcuts={dashboard.shortcuts} />
        </div>
    );
}
