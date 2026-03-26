import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function AuthoriserDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <AlertsPanel alerts={dashboard.alerts} />
                <FocusCardGrid cards={dashboard.focus_cards} />
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                <QuickActionsPanel actions={dashboard.quick_actions} />
                <ChartGrid charts={dashboard.charts} />
            </div>
            <ListGrid lists={dashboard.lists} columns={3} />
            <ShortcutGrid shortcuts={dashboard.shortcuts} />
        </div>
    );
}
