import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Notices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/teachers/me/notices", { headers: { Authorization: `Bearer ${token}` } });
        setNotices(res.data.notices);
      } catch (err) {
        console.error("LOAD NOTICES ERROR:", err.response?.data || err.message);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Notices</h1>

      {notices.length === 0 ? (
        <p className="text-gray-500">No notices yet</p>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n._id} className="bg-white p-4 border rounded">
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Sent by: {n.sentBy?.name || "Admin"} on {new Date(n.createdAt).toLocaleString()}</p>
              <p className="mb-2">{n.text}</p>
              {n.file && (
                <a className="text-blue-600 text-sm" href={`http://localhost:5000/uploads/notices/${n.file}`} target="_blank" rel="noreferrer">Download attachment</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

