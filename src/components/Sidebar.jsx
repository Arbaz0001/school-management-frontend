import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserRound,
  School,
  BookOpen,
  ClipboardCheck,
  Wallet,
  FileCheck2,
  CalendarDays,
  Library,
  Bus,
  Building2,
  Megaphone,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import usePermissions from "../hooks/usePermissions";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard", resource: "dashboard" },
  { label: "Students", icon: Users, to: "/admin/students", resource: "students" },
  { label: "Teachers", icon: GraduationCap, to: "/admin/teachers", resource: "teachers" },
  { label: "Parents", icon: UserRound, to: "/admin/parents", resource: "parents" },
  { label: "Classes", icon: School, to: "/admin/classes", resource: "classes" },
  { label: "Subjects", icon: BookOpen, to: "/admin/subjects", resource: "subjects" },
  { label: "Attendance", icon: ClipboardCheck, to: "/admin/attendance", resource: "attendance" },
  { label: "Fees", icon: Wallet, to: "/admin/fees", resource: "fees" },
  { label: "Exams", icon: FileCheck2, to: "/admin/exams", resource: "exams" },
  { label: "Timetable", icon: CalendarDays, to: "/admin/timetable", resource: "timetable" },
  { label: "Library", icon: Library, to: "/admin/library", resource: "library" },
  { label: "Transport", icon: Bus, to: "/admin/transport", resource: "transport" },
  { label: "Hostel", icon: Building2, to: "/admin/hostel", resource: "hostel" },
  { label: "Notices", icon: Megaphone, to: "/admin/notices", resource: "notices" },
  { label: "Reports", icon: BarChart3, to: "/admin/reports", resource: "reports" },
  { label: "Settings", icon: Settings, to: "/admin/settings", resource: "settings" },
];

export default function Sidebar({ isOpen, collapsed, onClose, onToggleCollapse }) {
  const { can } = usePermissions();
  const shellWidth = collapsed ? "md:w-20" : "md:w-64";
  const visibleItems = menuItems.filter((item) => can(item.resource, "view"));

  const linkClass = ({ isActive }) => {
    const base = "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200";
    const state = isActive
      ? "bg-sky-500/20 text-sky-100 shadow-inner"
      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50";
    return base + " " + state;
  };

  const asideClass = [
    "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transform border-r border-slate-800 bg-slate-900 transition-all duration-300 md:translate-x-0",
    isOpen ? "translate-x-0" : "",
    shellWidth,
  ].join(" ");

  return (
    <aside className={asideClass}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-wide text-white">
              {collapsed ? "ERP" : "School ERP"}
            </h2>
            {!collapsed && <p className="text-xs text-slate-400">Admin Console</p>}
          </div>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-lg border border-slate-700 p-1.5 text-slate-300 transition hover:border-slate-500 hover:text-white md:inline-flex"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            if (item.to) {
              return (
                <NavLink key={item.label} to={item.to} onClick={onClose} className={linkClass}>
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
          {collapsed ? "v2.6" : "School ERP v2.6"}
        </div>
      </div>
    </aside>
  );
}
