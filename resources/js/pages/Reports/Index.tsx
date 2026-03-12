import { API } from "@/config";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import { BarChart3, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const moduleLinks = [
  { label: "Workflows", href: `${API}/workflows` },
  { label: "Leave Requests", href: `${API}/leave-requests` },
  { label: "Attendance Records", href: `${API}/attendance-records` },
  { label: "Timesheets", href: `${API}/timesheets` },
  { label: "Payroll Exports", href: `${API}/payroll-exports` },
  { label: "Job Requisitions", href: `${API}/job-requisitions` },
  { label: "Candidate Profiles", href: `${API}/candidates` },
  { label: "Onboarding Tasks", href: `${API}/onboarding-tasks` },
  { label: "Offboarding Tasks", href: `${API}/offboarding-tasks` },
  { label: "Performance Reviews", href: `${API}/performance-reviews` },
  { label: "Learning Courses", href: `${API}/learning-courses` },
  { label: "Documents", href: `${API}/documents` },
];

export default function ReportsIndex() {
  const { metrics } = usePage().props as {
    metrics: Record<string, number>;
  };

  const cards = [
    { key: "employees", label: "Employees" },
    { key: "workflows", label: "Workflows" },
    { key: "leave_requests", label: "Leave Requests" },
    { key: "attendance_records", label: "Attendance Records" },
    { key: "timesheets", label: "Timesheets" },
    { key: "payroll_exports", label: "Payroll Exports" },
    { key: "job_requisitions", label: "Job Requisitions" },
    { key: "candidates", label: "Candidates" },
    { key: "onboarding_tasks", label: "Onboarding Tasks" },
    { key: "offboarding_tasks", label: "Offboarding Tasks" },
    { key: "performance_reviews", label: "Performance Reviews" },
    { key: "learning_courses", label: "Learning Courses" },
    { key: "documents", label: "Documents" },
  ];

  return (
    <AppLayout breadcrumbs={[{ title: "Reports", href: `${API}/reports` }]}>
      <Head title="Reports" />

      <div className="bg-background mx-2 sm:mx-4 md:mx-8 my-6 rounded-xl p-1 md:p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">HRMS Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">Cross-module operational visibility for Providence HRMS</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <Card key={card.key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.[card.key] ?? 0}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Module Access</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {moduleLinks.map((moduleLink) => (
                <Link
                  key={moduleLink.href}
                  href={moduleLink.href}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted"
                >
                  <span>{moduleLink.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
