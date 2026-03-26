import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { BookOpen, Calendar, Bus, Hotel, Bell } from "lucide-react";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [counts, setCounts] = useState({ homeworks: 0, notices: 0, exams: 0, books: 0 });
  const [exams, setExams] = useState([]);
  const [books, setBooks] = useState([]);
  const [transport, setTransport] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [studentRes, hwRes, noticesRes, attRes, examsRes, booksRes, transportRes] = await Promise.all([
        api.get('/students/me', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/students/me/homework', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { homeworks: [] } })),
        api.get('/notices/my', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { notices: [] } })),
        api.get('/student-attendance/me', { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        api.get('/exams').catch(() => ({ data: [] })),
        api.get('/library').catch(() => ({ data: [] })),
        api.get('/transport').catch(() => ({ data: [] })),
      ]);

      const studentData = studentRes.data;
      const examsData = Array.isArray(examsRes.data) ? examsRes.data : [];
      const booksData = Array.isArray(booksRes.data) ? booksRes.data : [];
      const transportData = Array.isArray(transportRes.data) ? transportRes.data : [];
      const noticesData = noticesRes.data.notices || [];

      setStudent(studentData);
      setExams(examsData.slice(0, 3));
      setBooks(booksData.slice(0, 3));
      setNotices(noticesData.slice(0, 3));
      setAttendance(attRes ? attRes.data : null);
      
      // Find assigned transport
      const assignedBus = transportData.find(bus => 
        bus.assignedStudents?.some(id => String(id) === String(studentData._id))
      );
      setTransport(assignedBus || null);

      setCounts({ 
        homeworks: hwRes.data.homeworks?.length || 0, 
        notices: noticesData.length || 0,
        exams: examsData.length || 0,
        books: booksData.length || 0
      });
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
      <h1 className="text-2xl font-semibold">👨‍🎓 Welcome back, {student.firstName}!</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Card title="Class" value={student.className || '-'} icon="📚" />
        <Card title="Section" value={student.section || '-'} icon="📍" />
        <Card title="Attendance" value={attendance ? attendance.length : '-'} icon="📊" link="/student/attendance" />
        <Card title="Exams" value={counts.exams} icon="📝" />
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Exam Schedule */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Calendar size={18} className="text-blue-600" />
            📝 Your Exams
          </h2>
          {exams.length > 0 ? (
            <div className="space-y-2">
              {exams.map((exam) => (
                <div key={exam._id} className="p-3 bg-blue-50 rounded border-l-4 border-blue-600 text-sm">
                  <p className="font-medium text-gray-900">{exam.examName}</p>
                  <p className="text-xs text-gray-600 mt-1">Type: {exam.examType}</p>
                  <p className="text-xs text-blue-700 mt-1">{exam.totalMarks} marks • {exam.duration} min</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No exams scheduled yet</p>
          )}
        </div>

        {/* Library Books */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <BookOpen size={18} className="text-green-600" />
            📚 Library
          </h2>
          {books.length > 0 ? (
            <div className="space-y-2">
              {books.map((book) => (
                <div key={book._id} className="p-3 bg-green-50 rounded border-l-4 border-green-600 text-sm">
                  <p className="font-medium text-gray-900">{book.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{book.author}</p>
                  <p className="text-xs text-green-700 mt-1">Available: {book.availableQuantity}/{book.quantity}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No books in library</p>
          )}
        </div>

        {/* Transport & Announcements */}
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Bell size={18} className="text-purple-600" />
            📢 Updates
          </h2>
          {transport ? (
            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-600 mb-3">
              <p className="font-medium text-sm text-gray-900 flex items-center gap-1"><Bus size={14} /> Your Bus</p>
              <p className="text-xs text-gray-600 mt-1">🚌 Bus {transport.busNumber}</p>
              <p className="text-xs text-gray-600">Driver: {transport.driverName}</p>
              <p className="text-xs text-blue-700 mt-1">📍 {transport.route}</p>
            </div>
          ) : (
            <p className="text-xs text-gray-500 mb-3">No transport assigned</p>
          )}
          
          {notices.length > 0 ? (
            <div className="space-y-2">
              {notices.map((notice) => (
                <div key={notice._id} className="p-2 bg-purple-50 rounded border-l-4 border-purple-600 text-xs">
                  <p className="font-medium text-gray-900">{notice.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">No announcements</p>
          )}
        </div>

      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3">📋 Homework</h2>
          <p className="text-sm text-gray-600 mb-3">You have {counts.homeworks} homeworks.</p>
          <Link to="/student/homework" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
            View Homework →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-3">📢 Notices</h2>
          <p className="text-sm text-gray-600 mb-3">You have {counts.notices} notices.</p>
          <Link to="/student/notices" className="bg-purple-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-700">
            View Notices →
          </Link>
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
