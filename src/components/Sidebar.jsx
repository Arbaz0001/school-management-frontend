import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  User,
  Book,
  ClipboardList,
  Bus,
  Hotel,
  Bell,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  IndianRupee,
  FileText,
  Edit,
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const [openStudents, setOpenStudents] = useState(false);
  const [openTeachers, setOpenTeachers] = useState(false);
  const [openParents, setOpenParents] = useState(false);

  const link =
    "flex items-center gap-3 px-4 py-2 rounded text-sm text-gray-200 hover:bg-blue-800";

  const active = "bg-blue-900 text-white font-medium";

  const subLink =
    "flex items-center gap-2 pl-12 pr-4 py-2 text-sm text-gray-300 hover:bg-blue-800";

  return (
    <div className="h-full bg-[#0B1E3A] text-white flex flex-col">

      {/* LOGO */}
      <div className="px-4 py-4 border-b border-blue-900">
        <h2 className="text-xl font-bold">AKKHOR</h2>
        <p className="text-xs text-gray-400">School Admin</p>
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">

        {/* DASHBOARD */}
        <NavLink
          to="/admin/dashboard"
          onClick={onClose}
          className={({ isActive }) => `${link} ${isActive && active}`}
        >
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>

        {/* ================= STUDENTS ================= */}
        <button
          onClick={() => setOpenStudents(!openStudents)}
          className={`${link} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            <Users size={16} /> Students
          </span>
          {openStudents ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {openStudents && (
          <div className="space-y-1">
            <NavLink to="/admin/students" className={subLink}>All Students</NavLink>
            <NavLink to="/admin/students/details" className={subLink}>Student Details</NavLink>
            <NavLink to="/admin/students/admission" className={subLink}>Admission Form</NavLink>
            <NavLink to="/admin/students/promotion" className={subLink}>Student Promotion</NavLink>
          </div>
        )}

        {/* ================= TEACHERS ================= */}
        <button
          onClick={() => setOpenTeachers(!openTeachers)}
          className={`${link} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            <User size={16} /> Teachers
          </span>
          {openTeachers ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {openTeachers && (
          <div className="space-y-1">

            <NavLink to="/admin/teachers" className={subLink}>
              <Users size={14} /> All Teachers
            </NavLink>

            <NavLink to="/admin/teachers/create" className={subLink}>
              <PlusCircle size={14} /> Create Teacher
            </NavLink>
            <NavLink to="/admin/teachers/1/profile" className={subLink}>
              <User size={14} /> Teacher Profile
            </NavLink>


            <NavLink to="/admin/teachers/edit/1" className={subLink}>
              <Edit size={14} /> Edit Teacher
            </NavLink>

             

            <NavLink to="/admin/teachers/1/salary" className={subLink}>
              <IndianRupee size={14} /> Teacher Salary
            </NavLink>

            <NavLink to="/admin/teachers/1/notices" className={subLink}>
              <FileText size={14} /> Teacher Notices
            </NavLink>

          </div>
        )}

        {/* ================= PARENTS ================= */}
        <button
          onClick={() => setOpenParents(!openParents)}
          className={`${link} w-full justify-between`}
        >
          <span className="flex items-center gap-3">
            <User size={16} /> Parents
          </span>
          {openParents ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {openParents && (
          <div className="space-y-1">
            <NavLink to="/admin/parents" className={subLink}>
              <Users size={14} /> All Parents
            </NavLink>

            <NavLink to="/admin/parents/create" className={subLink}>
              <PlusCircle size={14} /> Create Parent
            </NavLink>
          </div>
        )}

        {/* ================= OTHER MODULES ================= */}
        <NavLink
          to="/admin/library"
          className={({ isActive }) => `${link} ${isActive && active}`}
        >
          <Book size={16} /> Library
        </NavLink>

        <NavLink
          to="/admin/exam"
          className={({ isActive }) => `${link} ${isActive && active}`}
        >
          <ClipboardList size={16} /> Exam
        </NavLink>

        <NavLink
          to="/admin/transport"
          className={({ isActive }) => `${link} ${isActive && active}`}
        >
          <Bus size={16} /> Transport
        </NavLink>

        <NavLink
          to="/admin/hostel"
          className={({ isActive }) => `${link} ${isActive && active}`}
        >
          <Hotel size={16} /> Hostel
        </NavLink>

        <NavLink
          to="/admin/notice"
          className={({ isActive }) => `${link} ${isActive && active}`}
        >
          <Bell size={16} /> Notice
        </NavLink>

      </nav>
    </div>
  );
}
