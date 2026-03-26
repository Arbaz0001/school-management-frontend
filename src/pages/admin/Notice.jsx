import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Plus, Bell, Calendar, User } from "lucide-react";

export default function AdminNotice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notices");
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotice = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notices", formData);
      fetchNotices();
      setShowForm(false);
      setFormData({ title: "", text: "" });
    } catch (error) {
      console.error("Error sending notice:", error);
      alert(error.response?.data?.message || "Error sending notice");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this notice?")) {
      try {
        await api.delete(`/notices/${id}`);
        fetchNotices();
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📢 Notice Board</h1>
        <p className="text-sm text-gray-600 mt-1">Send notices to teachers, students & parents</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Notices</p>
              <p className="text-3xl font-bold text-gray-900">{notices.length}</p>
            </div>
            <Bell className="text-blue-600 opacity-20" size={40} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Notices</p>
              <p className="text-3xl font-bold text-gray-900">
                {notices.filter((n) => {
                  const noticeDate = new Date(n.createdAt).toDateString();
                  const today = new Date().toDateString();
                  return noticeDate === today;
                }).length}
              </p>
            </div>
            <Calendar className="text-green-600 opacity-20" size={40} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recipients</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-xs text-gray-500">Teachers, Students, Parents</p>
            </div>
            <User className="text-purple-600 opacity-20" size={40} />
          </div>
        </div>
      </div>

      {/* SEND BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
        >
          <Plus size={20} /> Send New Notice
        </button>
      </div>

      {/* SEND FORM */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">Send Notice to All</h2>
          <form onSubmit={handleSendNotice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notice Title *</label>
              <input
                type="text"
                placeholder="e.g., School Holiday Announcement"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notice Message *</label>
              <textarea
                placeholder="Write your notice message here..."
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="6"
                required
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <p className="font-medium mb-2">📢 Recipients:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All Teachers</li>
                <li>All Students</li>
                <li>All Parents</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Send Notice
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NOTICES LIST */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-gray-500">
          <Bell size={40} className="mx-auto mb-3 opacity-50" />
          <p>No notices sent yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Notices</h2>
          {/* Desktop View */}
          <div className="hidden sm:block space-y-3">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Sent on {formatDate(notice.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="text-red-600 hover:text-red-800 transition p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.text}</p>
                <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    <span className="text-sm text-gray-600">
                      {notice.readBy?.length || 0} viewed
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Visible to: Teachers, Students, Parents
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="sm:hidden space-y-3">
            {notices.map((notice) => (
              <div key={notice._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1 pr-2">{notice.title}</h3>
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="text-red-600 hover:text-red-800 transition flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {formatDate(notice.createdAt)}
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">{notice.text}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                  <p>{notice.readBy?.length || 0} viewed • Teachers, Students, Parents</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
