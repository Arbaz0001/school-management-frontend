import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-100 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          w-64 bg-white
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="h-full overflow-y-auto">
          <Sidebar onClose={() => setOpen(false)} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* ❌ md:ml-64 HATA DIYA */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR (MOBILE ONLY) */}
        <header className="md:hidden bg-white shadow px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <h1 className="font-semibold">Admin Panel</h1>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}