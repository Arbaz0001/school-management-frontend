import { UserPlus, GraduationCap, FileCheck2, Wallet, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePermissions from "../hooks/usePermissions";

const actions = [
  { label: "Add Student", icon: UserPlus, color: "bg-sky-600 hover:bg-sky-700", to: "/admin/students", resource: "students", action: "create" },
  { label: "Add Teacher", icon: GraduationCap, color: "bg-indigo-600 hover:bg-indigo-700", to: "/admin/teachers", resource: "teachers", action: "create" },
  { label: "Create Exam", icon: FileCheck2, color: "bg-emerald-600 hover:bg-emerald-700", to: "/admin/exams", resource: "exams", action: "create" },
  { label: "Collect Fee", icon: Wallet, color: "bg-amber-600 hover:bg-amber-700", to: "/admin/fees", resource: "fees", action: "create" },
  { label: "Send Notice", icon: Send, color: "bg-rose-600 hover:bg-rose-700", to: "/admin/notices", resource: "notices", action: "create" },
];

export default function QuickActions() {
  const navigate = useNavigate();
  const { can } = usePermissions();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isAllowed = can(action.resource, action.action);
          const buttonClass =
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 " +
            action.color;
          return (
            <button
              key={action.label}
              type="button"
              disabled={!isAllowed}
              onClick={() => {
                if (!isAllowed) return;
                navigate(action.to);
              }}
              className={buttonClass}
            >
              <Icon size={16} />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}