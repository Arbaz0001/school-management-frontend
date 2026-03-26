import DashboardCards from "../components/DashboardCards";
import Charts from "../components/Charts";
import QuickActions from "../components/QuickActions";
import RecentActivity from "../components/RecentActivity";
import StudentsTable from "../components/StudentsTable";
import useRealtimeDashboard from "../hooks/useRealtimeDashboard";

export default function AdminDashboard() {
  const {
    dashboardStats,
    feeData,
    admissionData,
    attendanceData,
    activities,
    students,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useRealtimeDashboard({ pollMs: 30000, cacheMs: 60000 });

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-sky-600">School Management ERP</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Realtime monitoring with 30s polling and local cache fallback.</p>
            {lastUpdated && (
              <p className="mt-1 text-xs text-slate-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            Refresh Now
          </button>
        </div>
        {loading && <p className="mt-2 text-xs text-slate-500">Updating dashboard...</p>}
        {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
      </section>

      <DashboardCards stats={dashboardStats} />

      <Charts feeData={feeData} admissionData={admissionData} attendanceData={attendanceData} />

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <QuickActions />
        </div>
        <RecentActivity activities={activities} />
      </section>

      <StudentsTable students={students} />
    </div>
  );
}