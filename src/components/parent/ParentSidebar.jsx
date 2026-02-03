import { NavLink } from "react-router-dom";
import {
  Home,
  User,
  Calendar,
  ListChecks,
  FileText,
  Settings,
  Bell,
} from "lucide-react";

export default function ParentSidebar() {
  const link = "flex items-center gap-3 px-4 py-3 rounded text-sm text-gray-700 hover:bg-gray-200";
  const active = "bg-white shadow font-medium";

  return (
    <aside className="w-64 bg-white h-full border-r fixed md:static">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Parent Portal</h2>
        <p className="text-sm text-gray-500">My Children</p>
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/parent/dashboard" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <Home size={16} /> Dashboard
        </NavLink>

        <NavLink to="/parent/student-profile" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <User size={16} /> Student Profile
        </NavLink>

        <NavLink to="/parent/attendance" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <ListChecks size={16} /> Attendance
        </NavLink>

        <NavLink to="/parent/fees" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <Calendar size={16} /> Fees
        </NavLink>

        <NavLink to="/parent/results" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <FileText size={16} /> Results
        </NavLink>

        <NavLink to="/parent/timetable" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <Calendar size={16} /> Timetable
        </NavLink>

        <NavLink to="/parent/notices" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <Bell size={16} /> Notices
        </NavLink>

        <NavLink to="/parent/settings" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
          <Settings size={16} /> Settings
        </NavLink>
      </nav>
    </aside>
  );
}
