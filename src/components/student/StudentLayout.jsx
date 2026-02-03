import { useState } from "react";
import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import { Menu } from "lucide-react";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white">
        <div className="font-bold">School ERP</div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded bg-slate-800">
          <Menu size={18} />
        </button>
      </div>

      {/* Sidebar for md+ or mobile when open */}
      <div className={`${open ? 'block' : 'hidden'} md:block`}>
        <StudentSidebar />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}