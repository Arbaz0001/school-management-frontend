
import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { DollarSign, Bell, GraduationCap, User, BookOpen, Calendar, Bus, Hotel } from "lucide-react";

export default function ParentDashboard() {
  const { refreshUser } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [feesSummary, setFeesSummary] = useState({ totalPaid: 0, fees: [] });
  const [notices, setNotices] = useState([]);
  const [exams, setExams] = useState([]);
  const [books, setBooks] = useState([]);
  const [transport, setTransport] = useState(null);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!refreshUser) return;
    const load = async () => {
      setLoading(true);
      try {
        const me = await refreshUser(api);
        if (!me) return;
        const studentId = me.student?._id;
        if (!studentId) return;

        const [sRes, attRes, feeRes, noticeRes, examsRes, booksRes, transportRes, hostelsRes] = await Promise.all([
          api.get(`/students/${studentId}`),
          api.get(`/student-attendance/${studentId}`).catch(() => ({ data: [] })),
          api.get(`/fees/student/${studentId}`).catch(() => ({ data: { fees: [] } })),
          api.get(`/notices`).catch(() => ({ data: [] })),
          api.get(`/exams`).catch(() => ({ data: [] })),
          api.get(`/library`).catch(() => ({ data: [] })),
          api.get(`/transport`).catch(() => ({ data: [] })),
          api.get(`/hostels`).catch(() => ({ data: [] })),
        ]);

        setStudent(sRes.data || null);
        setAttendanceCount(Array.isArray(attRes.data) ? attRes.data.length : 0);
        setFeesSummary(feeRes.data || { totalPaid: 0, fees: [] });

        // Normalize notices: some endpoints return { notices: [...] } or array
        const rawNotices = noticeRes.data?.notices ?? noticeRes.data ?? [];
        setNotices(Array.isArray(rawNotices) ? rawNotices.slice(0, 6) : []);

        setExams(examsRes.data || []);
        setBooks(booksRes.data || []);

        // transport/hostel may be lists — try to find assigned item for student
        const tData = transportRes.data || [];
        setTransport(Array.isArray(tData) ? tData.find((t) => String(t.students || []).includes(String(studentId))) ?? null : tData);
        const hData = hostelsRes.data || [];
        setHostel(Array.isArray(hData) ? hData.find((h) => String(h.students || []).includes(String(studentId))) ?? null : hData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [refreshUser]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <User size={28} className="text-blue-600" />
          Parent Dashboard
        </h1>
        <div className="text-sm text-gray-600">{student ? student.name : 'No student linked'}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Attendance Records</p>
            <p className="font-semibold text-xl">{attendanceCount}</p>
          </div>
          <Calendar size={28} className="text-blue-300" />
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Paid</p>
            <p className="font-semibold text-xl">${Number(feesSummary?.totalPaid || 0).toFixed(2)}</p>
          </div>
          <DollarSign size={28} className="text-green-300" />
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Notices</p>
            <p className="font-semibold text-xl">{notices.length}</p>
          </div>
          <Bell size={28} className="text-purple-300" />
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Exams</p>
            <p className="font-semibold text-xl">{exams.length}</p>
          </div>
          <GraduationCap size={28} className="text-yellow-300" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Recent Notices</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : notices.length === 0 ? (
            <p className="text-gray-500">No notices</p>
          ) : (
            <ul className="space-y-2">
              {notices.map((n) => (
                <li key={n._id} className="border rounded p-2">
                  <div className="font-medium">{n.title || n.subject || 'Notice'}</div>
                  <div className="text-xs text-gray-500 truncate">{n.text || n.description || ''}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Library</h2>
          {books.length === 0 ? (
            <p className="text-gray-500">No books issued</p>
          ) : (
            <ul className="space-y-2">
              {books.slice(0,5).map((b) => (
                <li key={b._id} className="text-sm">{b.title || b.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Transport / Hostel</h2>
          <p className="text-sm text-gray-600">Transport: {transport ? transport.name || 'Assigned' : 'Not assigned'}</p>
          <p className="text-sm text-gray-600 mt-2">Hostel: {hostel ? hostel.name || 'Assigned' : 'Not assigned'}</p>
        </div>
      </div>
    </div>
  );
}

