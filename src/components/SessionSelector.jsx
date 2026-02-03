import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";
 
import {
  getSessions,
  setActiveSession,
  getActiveSession,
} from "../../services/sessionApi";

/* =======================
   REUSABLE STAT CARD
======================= */
const StatCard = ({ title, count, onClick, gradient }) => (
  <div
    onClick={onClick}
    className={`
      ${gradient}
      p-6 rounded-2xl cursor-pointer
      text-white shadow-lg
      hover:shadow-2xl hover:-translate-y-1
      transition-all duration-300
      flex flex-col gap-2
    `}
  >
    <h3 className="text-sm opacity-90">{title}</h3>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

/* =======================
   SESSION CARD
======================= */
const SessionCard = ({ sessions, activeSession, onChange }) => (
  <div className="bg-white rounded-xl p-6 shadow w-full max-w-md">
    <h2 className="font-semibold text-lg">Academic Session</h2>
    <p className="text-sm text-gray-500 mb-3">
      Digital Wish Public School
    </p>

    <select
      value={activeSession || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-3 py-2"
    >
      <option value="">Select Session</option>
      {sessions.map((s) => (
        <option key={s._id} value={s._id}>
          {s.name}
        </option>
      ))}
    </select>
  </div>
);


/* =======================
   MAIN DASHBOARD
======================= */
const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSessionId] = useState(null);

  const navigate = useNavigate();

  /* Fetch dashboard counts */
  useEffect(() => {
    fetchCounts();
    loadSessions();
  }, []);

  const fetchCounts = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/admin/counts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCounts(res.data);
  };

  /* Load sessions */
  const loadSessions = async () => {
    const sessionRes = await getSessions();
    setSessions(sessionRes.data);

    const activeRes = await getActiveSession();
    if (activeRes.data) {
      setActiveSessionId(activeRes.data._id);
    }
  };

  /* Change session */
  const handleSessionChange = async (id) => {
    await setActiveSession(id);
    setActiveSessionId(id);
    window.location.reload(); // session-based refresh
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <h1 className="text-xl md:text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* GRID */}
      <div
        className="
          grid gap-6
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {/* SESSION CARD */}
        <SessionCard
          schoolName="Digital Wish Public School"
          sessions={sessions}
          activeSession={activeSession}
          onChange={handleSessionChange}
        />

        {/* STATS */}
        <StatCard
          title="Teachers"
          count={counts.teacherCount || 0}
          gradient="bg-gradient-to-r from-green-500 to-emerald-600"
          onClick={() => navigate("/admin/teachers")}
        />

        <StatCard
          title="Students"
          count={counts.studentCount || 0}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
          onClick={() => navigate("/admin/students")}
        />

        <StatCard
          title="Parents"
          count={counts.parentCount || 0}
          gradient="bg-gradient-to-r from-pink-500 to-rose-600"
          onClick={() => navigate("/admin/parents")}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
