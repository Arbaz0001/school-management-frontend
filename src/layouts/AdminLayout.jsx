import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const desktopMargin = isCollapsed ? "md:ml-20" : "md:ml-64";

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        collapsed={isCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <div
        className={[
          "flex min-h-screen flex-1 flex-col overflow-x-hidden transition-all duration-300",
          desktopMargin,
        ].join(" ")}
      >
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          isCollapsed={isCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}