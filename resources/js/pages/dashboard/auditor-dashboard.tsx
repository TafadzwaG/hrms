import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function AuditorDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <FocusCardGrid cards={dashboard.focus_cards} />
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
