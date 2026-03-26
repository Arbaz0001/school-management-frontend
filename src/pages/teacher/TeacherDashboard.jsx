import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { BookOpen, Calendar, Bus, Hotel, Bell } from "lucide-react";

export default function TeacherDashboard() {
  const [counts, setCounts] = useState({ notices: 0, docs: 0, payments: 0, exams: 0, library: 0, transport: 0, hostel: 0 });
  const [exams, setExams] = useState([]);
  const [library, setLibrary] = useState([]);
  const [noticesList, setNoticesList] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const [nRes, dRes, sRes, exRes, libRes, notRes] = await Promise.all([
          api.get('/teachers/me/notices', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { notices: [] } })),
          api.get('/teachers/me/documents', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { docs: [] } })),
          api.get('/teachers/me/salary', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { payments: [] } })),
          api.get('/exams').catch(() => ({ data: [] })),
          api.get('/library').catch(() => ({ data: [] })),
          api.get('/notices').catch(() => ({ data: [] })),
        ]);
        
        const examsData = Array.isArray(exRes.data) ? exRes.data : [];
        const libData = Array.isArray(libRes.data) ? libRes.data : [];
        const noticesData = Array.isArray(notRes.data) ? notRes.data : [];
        
        setExams(examsData.slice(0, 3));
        setLibrary(libData.slice(0, 3));
        setNoticesList(noticesData.slice(0, 3));
        
        setCounts({ 
          notices: nRes.data.notices?.length || 0, 
          docs: dRes.data.docs?.length || 0, 
          payments: sRes.data.payments?.length || 0,
          exams: examsData.length || 0,
          library: libData.length || 0,
          transport: 0,
          hostel: 0
        });
      } catch (err) {
        console.error('DASHLOAD ERR:', err.response?.data || err.message);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-6">👨‍🏫 Teacher Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <Link to="/teacher/classes" className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
          <p className="text-xs text-gray-500">Today's Classes</p>
          <p className="text-2xl font-bold mt-1">5</p>
        </Link>

        <Link to="/teacher/student-attendance" className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
          <p className="text-xs text-gray-500">Attendance</p>
          <p className="text-xl font-bold mt-1">Mark</p>
        </Link>

        <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
          <p className="text-xs text-gray-600 flex items-center gap-1"><Calendar size={14} /> Exams</p>
          <p className="text-2xl font-bold mt-1 text-blue-600">{counts.exams}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
          <p className="text-xs text-gray-600 flex items-center gap-1"><BookOpen size={14} /> Books</p>
          <p className="text-2xl font-bold mt-1 text-green-600">{counts.library}</p>
        </div>

        <Link to="/teacher/notices" className="bg-purple-50 p-4 rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition">
          <p className="text-xs text-gray-600 flex items-center gap-1"><Bell size={14} /> Notices</p>
          <p className="text-2xl font-bold mt-1 text-purple-600">{counts.notices}</p>
        </Link>

        <Link to="/teacher/documents" className="bg-orange-50 p-4 rounded-lg shadow-sm border border-orange-200 hover:shadow-md transition">
          <p className="text-xs text-gray-600">Documents</p>
          <p className="text-2xl font-bold mt-1 text-orange-600">{counts.docs}</p>
        </Link>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Upcoming Exams */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            📝 Upcoming Exams
          </h2>
          {exams.length > 0 ? (
            <div className="space-y-2">
              {exams.map((exam) => (
                <div key={exam._id} className="p-3 bg-blue-50 rounded border-l-4 border-blue-600">
                  <p className="font-medium text-sm text-gray-900">{exam.examName}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Classes: {Array.isArray(exam.classes) ? exam.classes.join(", ") : exam.classes}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No exams scheduled</p>
          )}
        </div>

        {/* Library Books */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-green-600" />
            📚 Latest Books
          </h2>
          {library.length > 0 ? (
            <div className="space-y-2">
              {library.map((book) => (
                <div key={book._id} className="p-3 bg-green-50 rounded border-l-4 border-green-600">
                  <p className="font-medium text-sm text-gray-900">{book.title}</p>
                  <p className="text-xs text-gray-600 mt-1">by {book.author}</p>
                  <p className="text-xs text-green-700 mt-1">Available: {book.availableQuantity}/{book.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No books in library</p>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Bell size={18} className="text-purple-600" />
            📢 Announcements
          </h2>
          {noticesList.length > 0 ? (
            <div className="space-y-2">
              {noticesList.map((notice) => (
                <div key={notice._id} className="p-3 bg-purple-50 rounded border-l-4 border-purple-600">
                  <p className="font-medium text-sm text-gray-900">{notice.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notice.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No notices</p>
          )}
        </div>

      </div>

      {/* Bottom Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-2">Salary & Payments</h2>
          <p className="text-sm text-gray-600">You have {counts.payments} recorded payments.</p>
          <Link to="/teacher/salary" className="text-blue-600 mt-3 inline-block text-sm font-medium">View salary history →</Link>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-2">Attendance Overview</h2>
          <p className="text-sm text-gray-600">Mark daily attendance for your classes.</p>
          <Link to="/teacher/student-attendance" className="text-blue-600 mt-3 inline-block text-sm font-medium">Go to attendance →</Link>
        </div>
      </div>
    </div>
  );
}
