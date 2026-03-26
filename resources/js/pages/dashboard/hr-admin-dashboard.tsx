import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function HrAdminDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <FocusCardGrid cards={dashboard.focus_cards} />
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <QuickActionsPanel actions={dashboard.quick_actions} />
                <AlertsPanel alerts={dashboard.alerts} />
            </div>
            <ChartGrid charts={dashboard.charts} />
            <ListGrid lists={dashboard.lists} columns={3} />
            <ShortcutGrid shortcuts={dashboard.shortcuts} />
        </div>
    );
}
