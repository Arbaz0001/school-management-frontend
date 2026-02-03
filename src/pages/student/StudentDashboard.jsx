import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [counts, setCounts] = useState({ homeworks: 0, notices: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [studentRes, hwRes, noticesRes, attRes] = await Promise.all([
        api.get('/students/me', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/students/me/homework', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/notices/my', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/student-attendance/me', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
      ]);

      setStudent(studentRes.data);
      setCounts({ homeworks: hwRes.data.homeworks.length || 0, notices: noticesRes.data.notices.length || 0 });
      setAttendance(attRes ? attRes.data : null);
    } catch (err) {
      console.error('DASHLOAD ERR:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!student) return <p className="p-6 text-red-500">Student profile not available</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome back, {student.firstName}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Class" value={student.className || '-'} />
        <Card title="Section" value={student.section || '-'} />
        <Card title="Attendance Records" value={attendance ? attendance.length : '-'} />
        <Card title="Homeworks" value={counts.homeworks} link="/student/homework" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border">
          <h2 className="font-semibold">Recent Notices</h2>
          <p className="text-sm text-gray-600 mt-2">You have {counts.notices} notices. <Link to="/student/notices" className="text-blue-600">View all</Link></p>
        </div>

        <div className="bg-white p-4 rounded border">
          <h2 className="font-semibold">Attendance Overview</h2>
          <p className="text-sm text-gray-600 mt-2">Detailed attendance is available on your Attendance page.</p>
          <Link to="/student/attendance" className="text-blue-600 inline-block mt-2">View attendance</Link>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, link }) {
  return (
    <div className="bg-white p-4 shadow rounded flex flex-col justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>
      </div>
      {link && <a href={link} className="text-sm text-blue-600 mt-3">Open</a>}
    </div>
  );
}
