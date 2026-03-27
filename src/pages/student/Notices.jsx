import { useEffect, useState } from "react";
import api from "../../services/api";
import API_BASE_URL from "../../config/api";

export default function StudentNotices() {
  const [notices, setNotices] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/notices/my', { headers: { Authorization: `Bearer ${token}` } });
        setNotices(res.data.notices || []);

        const cnt = await api.get('/notices/my/unread-count', { headers: { Authorization: `Bearer ${token}` } });
        setUnreadCount(cnt.data.unreadCount || 0);
      } catch (err) {
        console.error('LOAD NOTICES ERR:', err.response?.data || err.message);
      }
    };
    load();
  }, []);

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/notices/${id}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotices(prev => prev.map(n => n._id === id ? { ...n, isReadByMe: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('MARK READ ERR:', err.response?.data || err.message);
      alert('Failed to mark read');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Notices</h1>
        <div className="text-sm text-gray-600">Unread: <span className="font-semibold">{unreadCount}</span></div>
      </div>

      {notices.length === 0 ? (
        <p className="text-gray-500">No notices</p>
      ) : (
        <div className="space-y-3">
          {notices.map(n => (
            <div key={n._id} className={`bg-white p-4 rounded border ${n.isReadByMe ? '' : 'ring-2 ring-yellow-200'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-gray-500">{n.sentBy?.name || 'Admin'} • {new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="space-x-3 flex items-center">
                  {n.file && <a className="text-blue-600" href={`${API_BASE_URL}/uploads/notices/${n.file}`} target="_blank" rel="noreferrer">Download</a>}
                  {!n.isReadByMe && <button onClick={() => markRead(n._id)} className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Mark read</button>}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}