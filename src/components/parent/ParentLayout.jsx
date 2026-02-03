import { useState, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import ParentSidebar from "./ParentSidebar";
import { Menu } from "lucide-react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function ParentLayout() {
  const [open, setOpen] = useState(false);
  const { refreshUser } = useContext(AuthContext);

  // refresh user on mount to populate student link
  useEffect(() => {
    refreshUser(api);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-blue-900 text-white">
        <div className="font-bold">Parent Portal</div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded bg-blue-800">
          <Menu size={18} />
        </button>
      </div>

      {/* Sidebar for md+ or mobile when open */}
      <div className={`${open ? "block" : "hidden"} md:block`}>
        <ParentSidebar />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 w-full p-6">
        <Outlet />
      </main>
    </div>
  );
}
