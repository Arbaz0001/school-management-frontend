import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../../config/api";

const CLASS_ORDER = [
  "Nursery",
  "LKG",
  "UKG",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

export default function StudentPromotion() {
  const [sessions, setSessions] = useState([]);
  const [classCounts, setClassCounts] = useState([]);

  const [fromSession, setFromSession] = useState("");
  const [toSession, setToSession] = useState("");
  const [fromClass, setFromClass] = useState("");
  const [toClass, setToClass] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // fetch sessions and class counts
    axios
      .get(`${API_BASE_URL}/api/sessions`)
      .then((res) => setSessions(res.data))
      .catch(() => {});

    axios
      .get(`${API_BASE_URL}/api/students/class-count`)
      .then((res) => setClassCounts(res.data.map(c => c._id)))
      .catch(() => {});
  }, []);

  // Auto compute suggested toClass when fromClass changes
  useEffect(() => {
    if (!fromClass) return;
    const idx = CLASS_ORDER.indexOf(fromClass);
    if (idx !== -1 && idx < CLASS_ORDER.length - 1) setToClass(CLASS_ORDER[idx + 1]);
    else {
      const n = parseInt(fromClass);
      if (!isNaN(n)) setToClass(String(n + 1));
    }
  }, [fromClass]);

  // Auto load students when class or fromSession changes
  useEffect(() => {
    if (!fromClass || !fromSession) return;
    loadStudents();
  }, [fromClass, fromSession]);

  const authHeaders = () => ({ headers: { Authorization: "Bearer " + localStorage.getItem("token") } });

  const loadStudents = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.get(`${API_BASE_URL}/api/students`, { params: { className: fromClass, session: fromSession } });
      setStudents(res.data.students || res.data);
      setSelectedIds(new Set());
      setSelectAll(false);
    } catch (err) {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelectedIds(s);
    setSelectAll(s.size === students.length && students.length > 0);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
      setSelectAll(false);
    } else {
      setSelectedIds(new Set(students.map(s => s._id)));
      setSelectAll(true);
    }
  };

  const promoteSelected = async () => {
    if (selectedIds.size === 0) {
      setError("Please select at least one student");
      return;
    }
    if (!toSession) {
      setError("Select target session");
      return;
    }
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/students/promote`,
        {
          mode: "selectedStudents",
          studentIds: Array.from(selectedIds),
          targetSession: toSession,
          targetClass: toClass || null,
        },
        authHeaders()
      );
      setMessage(`Promoted ${res.data.promoted} students successfully`);
      // refresh students list
      await loadStudents();
    } catch (err) {
      setError(err?.response?.data?.message || "Promotion failed");
    } finally {
      setLoading(false);
    }
  };

  const promoteAllInClass = async () => {
    if (!fromClass || !fromSession) {
      setError("Select source class and session");
      return;
    }
    if (!toSession) {
      setError("Select target session");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/students/promote`,
        {
          mode: "bulkClass",
          className: fromClass,
          fromSession,
          targetSession: toSession,
          targetClass: toClass || null,
        },
        authHeaders()
      );
      setMessage(`Promoted ${res.data.promoted} students successfully`);
      await loadStudents();
    } catch (err) {
      setError(err?.response?.data?.message || "Promotion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Student Promotion</h1>

      {message && <p className="p-3 bg-green-100 text-green-800 rounded mb-4">{message}</p>}
      {error && <p className="p-3 bg-red-100 text-red-800 rounded mb-4">{error}</p>}

      <div className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">From Session</label>
            <select className="w-full border p-2 rounded" value={fromSession} onChange={e => setFromSession(e.target.value)}>
              <option value="">Select session</option>
              {sessions.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">From Class</label>
            <select className="w-full border p-2 rounded" value={fromClass} onChange={e => setFromClass(e.target.value)}>
              <option value="">Select class</option>
              {classCounts.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Session</label>
            <select className="w-full border p-2 rounded" value={toSession} onChange={e => setToSession(e.target.value)}>
              <option value="">Select target session</option>
              {sessions.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">To Class (optional - auto suggests)</label>
            <input className="w-full border p-2 rounded" value={toClass} onChange={e => setToClass(e.target.value)} placeholder="Leave empty to auto compute" />
          </div>

          <div className="flex items-end gap-3">
            <button onClick={promoteAllInClass} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">Promote All in Class</button>
            <button onClick={loadStudents} disabled={loading} className="bg-gray-200 px-4 py-2 rounded">Reload Students</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Students ({students.length})</h2>

        <div className="mb-2 flex items-center gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
            <span className="text-sm">Select All</span>
          </label>
          <button onClick={promoteSelected} disabled={loading || selectedIds.size === 0} className="bg-green-600 text-white px-3 py-1 rounded">Promote Selected</button>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : (
          <table className="w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Class</th>
                <th className="p-2 text-left">Session</th>
                <th className="p-2">Select</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s._id} className="border-t">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{s.firstName} {s.lastName}</td>
                  <td className="p-2">{s.className}</td>
                  <td className="p-2">{s.session}</td>
                  <td className="p-2 text-center"><input type="checkbox" checked={selectedIds.has(s._id)} onChange={() => toggleSelect(s._id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}