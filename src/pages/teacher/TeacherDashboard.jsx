import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function TeacherDashboard() {
  const [counts, setCounts] = useState({ notices: 0, docs: 0, payments: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const [nRes, dRes, sRes] = await Promise.all([
          api.get('/teachers/me/notices', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/teachers/me/documents', { headers: { Authorization: `Bearer ${token}` } }),
          api.get('/teachers/me/salary', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCounts({ notices: nRes.data.notices.length || 0, docs: dRes.data.docs.length || 0, payments: sRes.data.payments.length || 0 });
      } catch (err) {
        console.error('DASHLOAD ERR:', err.response?.data || err.message);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Teacher Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Link to="/teacher/classes" className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500">Today's Classes</p>
          <p className="text-2xl font-bold mt-2">5</p>
        </Link>

        <Link to="/teacher/student-attendance" className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500">Student Attendance</p>
          <p className="text-2xl font-bold mt-2">Take Attendance</p>
        </Link>

        <Link to="/teacher/notices" className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500">Notices</p>
          <p className="text-2xl font-bold mt-2">{counts.notices}</p>
        </Link>

        <Link to="/teacher/documents" className="bg-white p-5 rounded-lg shadow-sm border hover:shadow-md transition">
          <p className="text-sm text-gray-500">Documents</p>
          <p className="text-2xl font-bold mt-2">{counts.docs}</p>
        </Link>
      </div>

      {/* Placeholder Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border">
          <h2 className="font-semibold mb-2">Attendance Overview</h2>
          <p className="text-sm text-gray-500">Attendance chart will appear here</p>
        </div>

        <div className="bg-white p-5 rounded-lg border">
          <h2 className="font-semibold mb-2">Recent Payments</h2>
          <p className="text-sm text-gray-600">You have {counts.payments} recorded payments.</p>
          <Link to="/teacher/salary" className="text-blue-600 mt-2 inline-block">View salary history</Link>
        </div>
      </div>
    </div>
  );
}
