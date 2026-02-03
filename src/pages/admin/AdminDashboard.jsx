import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  getSessions,
  getActiveSession,
  setActiveSession,
} from "../../services/sessionApi";

import EarningsChart from "../../components/charts/EarningsChart";
import AttendanceChart from "../../components/charts/AttendanceChart";
import SchoolCalendar from "../../components/calendar/SchoolCalendar";
import NoticeBoard from "./NoticeBoard";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSessionId] = useState("");

  const [earningsData, setEarningsData] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  const [attendance, setAttendance] = useState({
    present: 0,
    absent: 0,
  });

  /* ======================
     INITIAL LOAD
  ====================== */
  // Re-run counts & charts when activeSession changes
  useEffect(() => {
    fetchCounts(activeSession);
    loadSessions();
    loadCharts();
    loadCalendar();
    loadAttendance();
  }, [activeSession]);

  /* ======================
     API CALLS
  ====================== */
  const fetchCounts = async (sessionId) => {
    const token = localStorage.getItem("token");
    const res = await api.get("/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
      params: sessionId ? { sessionId } : {},
    });
    setCounts(res.data);
  };

  const loadSessions = async () => {
    const all = await getSessions();
    setSessions(all.data);

    const active = await getActiveSession();
    if (active.data?._id) setActiveSessionId(active.data._id);
  };

  const loadCharts = async () => {
    const res = await api.get("/admin/earnings-chart");
    setEarningsData(res.data);
  };

  const loadCalendar = async () => {
    const res = await api.get("/events");
    setCalendarEvents(res.data);
  };

  const loadAttendance = async () => {
    const res = await api.get("/attendance-analytics");
    setAttendance(res.data);
  };

  // On select -> set local session filter and fetch counts for it (does NOT change global active session)
  const handleSessionChange = async (id) => {
    setActiveSessionId(id);
    await fetchCounts(id);
  };

  // Optional: make selected session the global active session (persist in DB)
  const handleMakeActive = async () => {
    if (!activeSession) return;
    await setActiveSession(activeSession);
    // Force reload to reflect global active session across app
    window.location.reload();
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">
          Home <span className="mx-1">›</span> Admin
        </p>
      </div>

      {/* SESSION SELECT */}
      <div className="max-w-sm flex gap-2 items-center">
        <select
          value={activeSession}
          onChange={(e) => handleSessionChange(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Select Academic Session</option>
          {sessions.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleMakeActive}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
          title="Set as active session"
        >
          Set Active
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <Stat title="Students" value={counts.studentCount} />
        <Stat title="Teachers" value={counts.teacherCount} />
        <Stat title="Parents" value={counts.parentCount} />
        <div className="bg-white rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Earnings</p>
          <p className="text-2xl font-bold">{`₹${counts.earnings || 0}`}</p>
          <p className="text-gray-500 text-sm mt-2">Expenses</p>
          <p className="text-lg font-medium">{`₹${counts.expenses || 0}`}</p>
        </div>
      </div>

      {/* EARNINGS CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Earnings Overview" colSpan="lg:col-span-2">
          <EarningsChart data={earningsData} />
        </Card>
        <Card title="Expenses">
          <EarningsChart data={earningsData} />
        </Card>
      </div>

      {/* ATTENDANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Attendance Overview">
          <AttendanceChart
            present={attendance.present}
            absent={attendance.absent}
          />
        </Card>
      </div>

      {/* STUDENT + CALENDAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Students Analytics">
          <EarningsChart data={earningsData} />
        </Card>
        <Card title="Event Calendar">
          <SchoolCalendar events={calendarEvents} />
        </Card>
      </div>

      {/* WEBSITE + NOTICE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Website Traffic">
          <p className="text-sm">Direct – 50%</p>
          <p className="text-sm">Search – 27%</p>
          <p className="text-sm">Referral – 8%</p>
          <p className="text-sm">Social – 7%</p>
        </Card>

        <Card title="Notice Board">
          <NoticeBoard />
        </Card>
      </div>
    </div>
  );
}

/* ======================
   SMALL UI COMPONENTS
====================== */

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-xl p-5 shadow">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value || 0}</p>
  </div>
);

const Card = ({ title, children, colSpan = "" }) => (
  <div className={`bg-white rounded-xl shadow p-5 ${colSpan}`}>
    <h2 className="font-semibold mb-3">{title}</h2>
    {children}
  </div>
);