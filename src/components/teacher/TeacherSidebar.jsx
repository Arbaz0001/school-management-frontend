import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  CalendarCheck,
  ClipboardList,
  BookOpen,
  Bell,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
  { name: "My Profile", path: "/teacher/profile", icon: User },
  { name: "My Attendance", path: "/teacher/my-attendance", icon: CalendarCheck },
  { name: "Student Attendance", path: "/teacher/student-attendance", icon: ClipboardList },
  { name: "My Classes", path: "/teacher/classes", icon: BookOpen },
  { name: "Homework", path: "/teacher/homework", icon: ClipboardList },
  { name: "Documents", path: "/teacher/documents", icon: BookOpen },
  { name: "Notices", path: "/teacher/notices", icon: Bell },
  { name: "Salary", path: "/teacher/salary", icon: LayoutDashboard },
];

export default function TeacherSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen md:fixed md:left-0 md:top-0 relative">
      <div className="p-5 text-xl font-bold border-b border-slate-700">
        School ERP
        <p className="text-sm text-slate-400">Teacher Panel</p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition
                 ${
                   isActive
                     ? "bg-blue-600 text-white"
                     : "text-slate-300 hover:bg-slate-800"
                 }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}

        <button className="flex items-center gap-3 px-4 py-2 mt-6 w-full rounded-md text-sm text-red-400 hover:bg-red-500/10">
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
