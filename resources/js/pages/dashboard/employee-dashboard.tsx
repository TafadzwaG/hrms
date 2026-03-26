import type { DashboardPayload } from '@/pages/dashboard/shared';
import { AlertsPanel, ChartGrid, DashboardHero, FocusCardGrid, ListGrid, MetricGrid, QuickActionsPanel, ShortcutGrid } from '@/pages/dashboard/shared';

export default function EmployeeDashboard({ dashboard }: { dashboard: DashboardPayload }) {
    return (
        <div className="space-y-5">
            <DashboardHero dashboard={dashboard} />
            <MetricGrid metrics={dashboard.metrics} />
            <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <QuickActionsPanel actions={dashboard.quick_actions} />
                <AlertsPanel alerts={dashboard.alerts} />
            </div>
            <FocusCardGrid cards={dashboard.focus_cards} />
            <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
                <ListGrid lists={dashboard.lists.slice(0, 2)} columns={2} />
                <ChartGrid charts={dashboard.charts} />
            </div>
            {dashboard.lists.length > 2 ? <ListGrid lists={dashboard.lists.slice(2)} columns={3} /> : null}
            <ShortcutGrid shortcuts={dashboard.shortcuts} />
        </div>
    );
}
