import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { LayoutDashboard, CalendarCheck, Bell, ClipboardList, LogOut } from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
  { name: "My Attendance", path: "/student/attendance", icon: CalendarCheck },
  { name: "Homework", path: "/student/homework", icon: ClipboardList },
  { name: "Notices", path: "/student/notices", icon: Bell, badge: true },
];

export default function StudentSidebar() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/notices/my/unread-count', { headers: { Authorization: `Bearer ${token}` } });
        setUnread(res.data.unreadCount || 0);
      } catch (err) {
        console.error('LOAD UNREAD ERR:', err);
      }
    };
    load();
  }, []);

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen md:fixed md:left-0 md:top-0 relative">
      <div className="p-5 text-xl font-bold border-b border-slate-700">
        School ERP
        <p className="text-sm text-slate-400">Student Panel</p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm transition ${
                  isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
              {item.badge && unread > 0 && <span className="ml-auto bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{unread}</span>}
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