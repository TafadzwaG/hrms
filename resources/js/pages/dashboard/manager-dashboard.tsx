import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function ManagerDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <FocusCardGrid cards={dashboard.focus_cards} />
                <QuickActionsPanel actions={dashboard.quick_actions} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
                <AlertsPanel alerts={dashboard.alerts} />
                <ChartGrid charts={dashboard.charts} />
            </div>
            <ListGrid lists={dashboard.lists} columns={3} />
            <ShortcutGrid shortcuts={dashboard.shortcuts} />
        </div>
    );
}
