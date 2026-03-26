import {
  Users,
  GraduationCap,
  UserRound,
  School,
  ClipboardCheck,
  Wallet,
  CircleAlert,
  Landmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePermissions from "../hooks/usePermissions";

const statMeta = [
  { key: "students", title: "Total Students", icon: Users, accent: "from-sky-500 to-cyan-500", note: "Active enrollments", to: "/admin/students", resource: "students" },
  { key: "teachers", title: "Total Teachers", icon: GraduationCap, accent: "from-violet-500 to-indigo-500", note: "Teaching staff", to: "/admin/teachers", resource: "teachers" },
  { key: "parents", title: "Total Parents", icon: UserRound, accent: "from-emerald-500 to-teal-500", note: "Linked guardians", to: "/admin/parents", resource: "parents" },
  { key: "classes", title: "Total Classes", icon: School, accent: "from-amber-500 to-orange-500", note: "Across all grades", to: "/admin/classes", resource: "classes" },
  { key: "attendance", title: "Today's Attendance", icon: ClipboardCheck, accent: "from-green-500 to-lime-500", note: "Present students", to: "/admin/attendance", resource: "attendance" },
  { key: "feeCollection", title: "Fee Collection", icon: Wallet, accent: "from-blue-600 to-cyan-600", note: "Collected this month", to: "/admin/fees", resource: "fees" },
  { key: "pendingFees", title: "Pending Fees", icon: CircleAlert, accent: "from-rose-500 to-pink-500", note: "Awaiting payment", to: "/admin/reports", resource: "reports" },
  { key: "revenue", title: "Total Revenue", icon: Landmark, accent: "from-indigo-600 to-blue-500", note: "Financial year total", to: "/admin/reports", resource: "reports" },
];

export default function DashboardCards({ stats }) {
  const navigate = useNavigate();
  const { can } = usePermissions();

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statMeta.map((item) => {
          const Icon = item.icon;
          const isAllowed = can(item.resource, "view");
          const iconClass = "rounded-xl bg-gradient-to-br p-2.5 text-white shadow-sm " + item.accent;
          return (
            <article
              key={item.key}
              role="button"
              tabIndex={isAllowed ? 0 : -1}
              onClick={() => {
                if (!isAllowed) return;
                navigate(item.to);
              }}
              onKeyDown={(event) => {
                if (!isAllowed) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate(item.to);
                }
              }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              aria-disabled={!isAllowed}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats[item.key]}</h3>
                  <p className="mt-1 text-xs text-slate-500">{item.note}</p>
                </div>
                <div className={iconClass + (isAllowed ? "" : " opacity-60") }>
                  <Icon size={18} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}