import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Settings as SettingsIcon, User, Bell, Shield, LogOut, Mail, Phone } from "lucide-react";

export default function Settings(){
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout?.();
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
        <SettingsIcon size={32} className="text-blue-600" />
        Settings
      </h1>

      {/* User Profile Card */}
      <div className="bg-white p-4 md:p-6 rounded shadow">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User size={22} className="text-blue-600" />
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold flex-shrink-0">
              {user?.name ? (user.name.split(' ').map(n=>n[0]).slice(0,2).join('')) : user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-lg md:text-xl font-semibold">{user?.name || 'Parent'}</p>
              <p className="text-xs md:text-sm text-gray-600">{user?.role || 'Parent'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs md:text-sm text-gray-500">Email</p>
              <p className="font-medium flex items-center gap-2 mt-1">
                <Mail size={16} className="text-gray-400" />
                {user?.email}
              </p>
            </div>
            {user?.phone && (
              <div>
                <p className="text-xs md:text-sm text-gray-500">Phone</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <Phone size={16} className="text-gray-400" />
                  {user?.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white p-4 md:p-6 rounded shadow">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Bell size={22} className="text-purple-600" />
          Notification Preferences
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm md:text-base">Email notifications for exam results</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm md:text-base">SMS alerts for attendance</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm md:text-base">Fee payment reminders</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm md:text-base">School announcements</span>
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white p-4 md:p-6 rounded shadow">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield size={22} className="text-green-600" />
          Security & Privacy
        </h2>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors text-sm md:text-base">
            🔑 Change Password
          </button>
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors text-sm md:text-base">
            📋 Privacy Policy
          </button>
          <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded transition-colors text-sm md:text-base">
            ⚙️ Account Settings
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  )
}
