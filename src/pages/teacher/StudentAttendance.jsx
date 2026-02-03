import { useState, useEffect } from "react";
import api from "../../services/api";

export default function StudentAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [className, setClassName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [historyStudent, setHistoryStudent] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/teachers/me', { headers: { Authorization: `Bearer ${token}` } });
        setClasses(res.data.teacher.classes || []);
      } catch (err) {
        console.error('LOAD PROFILE ERR:', err.response?.data || err.message);
      }
    };
    loadProfile();
  }, []);

  const loadStudents = async (cls) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await api.get(`/students/class/${encodeURIComponent(cls)}`, { headers: { Authorization: `Bearer ${token}` } });
      const list = res.data.students || [];
      setStudents(list);
      setAttendance({});
      // load existing attendance for this class and date
      await loadExistingAttendance(cls, date, list);
    } catch (err) {
      console.error('LOAD STUDENTS ERR:', err.response?.data || err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadExistingAttendance = async (cls, forDate, list) => {
    if (!cls || !forDate) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/attendance/class/${encodeURIComponent(cls)}?date=${encodeURIComponent(forDate)}`, { headers: { Authorization: `Bearer ${token}` } });
      const rows = res.data.rows || [];
      const map = {};
      rows.forEach(r => {
        if (r.attendance) map[r.student._id] = r.attendance.status;
      });
      // fill with existing statuses or default 'A'
      const newMap = {};
      (list || students).forEach(s => { newMap[s._id] = map[s._id] || 'A'; });
      setAttendance(newMap);
    } catch (err) {
      console.error('LOAD EXISTING ATT ERR:', err.response?.data || err.message);
      // fallback: set all A
      const fallback = {};
      (list || students).forEach(s => { fallback[s._id] = 'A'; });
      setAttendance(fallback);
    }
  };

  // UI helpers
  const markAll = (status) => {
    const newMap = {};
    students.forEach(s => { newMap[s._id] = status; });
    setAttendance(newMap);
  };

  const handleChange = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  const submitAttendance = async () => {
    if (!className) return alert('Please select a class');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        date,
        attendance: students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'A' }))
      };
      await api.post('/attendance/mark/batch', payload, { headers: { Authorization: `Bearer ${token}` } });
      alert('Attendance saved successfully ✅');
    } catch (err) {
      console.error('SUBMIT ATT ERR:', err.response?.data || err.message);
      alert('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const openHistory = async (student) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/student-attendance/${student._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setHistoryRecords(res.data || []);
      setHistoryStudent(student);
      setHistoryOpen(true);
    } catch (err) {
      console.error('HISTORY LOAD ERR:', err.response?.data || err.message);
      alert('Failed to load history');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Student Attendance</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select className="border p-2 rounded" value={className} onChange={(e) => { setClassName(e.target.value); loadStudents(e.target.value); }}>
          <option value="">Select Class</option>
          {classes.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select className="border p-2 rounded">
          <option>Select Section</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>

        <select className="border p-2 rounded">
          <option>Select Subject</option>
        </select>

        <input type="date" className="border p-2 rounded" value={date} onChange={async (e) => { setDate(e.target.value); if (className) await loadExistingAttendance(className, e.target.value); }} />
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-4">
        <button onClick={() => markAll('P')} className="bg-green-600 text-white px-3 py-1 rounded">Mark all Present</button>
        <button onClick={() => markAll('A')} className="bg-red-600 text-white px-3 py-1 rounded">Mark all Absent</button>
        <button onClick={() => setAttendance({})} className="bg-gray-200 px-3 py-1 rounded">Clear</button>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Roll No</th>
              <th className="p-3 text-left">Student Name</th>
              <th className="p-3 text-center">Present</th>
              <th className="p-3 text-center">Absent</th>
              <th className="p-3 text-center">History</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border-t">
                <td className="p-3">{student.roll || student._id}</td>
                <td className="p-3">{student.fullName || student.name}</td>
                <td className="p-3 text-center">
                  <input
                    type="radio"
                    name={`att-${student._id}`}
                    checked={attendance[student._id] === 'P'}
                    onChange={() => handleChange(student._id, "P")}
                  />
                </td>
                <td className="p-3 text-center">
                  <input
                    type="radio"
                    name={`att-${student._id}`}
                    checked={attendance[student._id] === 'A'}
                    onChange={() => handleChange(student._id, "A")}
                  />
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => openHistory(student)} className="text-blue-600 text-sm">History</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No students loaded</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submit */}
      <div className="mt-6">
        <button
          onClick={submitAttendance}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Attendance'}
        </button>
      </div>

      {/* History Modal */}
      {historyOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Attendance history — {historyStudent?.fullName}</h3>
              <button onClick={() => setHistoryOpen(false)} className="text-sm text-gray-500">Close</button>
            </div>
            <div className="space-y-2 max-h-64 overflow-auto">
              {historyRecords.length === 0 ? (
                <p className="text-gray-500">No records</p>
              ) : (
                historyRecords.map(r => (
                  <div key={r._id} className="flex justify-between border-b pb-2">
                    <div>{new Date(r.date).toLocaleDateString()}</div>
                    <div className="font-medium">{r.status === 'P' ? 'Present' : 'Absent'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
