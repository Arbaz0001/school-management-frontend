import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { DollarSign, Bell, GraduationCap, Wallet, User } from "lucide-react";

export default function ParentDashboard() {
  const { refreshUser } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [feesSummary, setFeesSummary] = useState({ totalPaid: 0, fees: [] });
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const load = async () => {
      const me = await refreshUser(api);
      if (!me) return;
      const studentId = me.student?._id;
      if (!studentId) return;

      try {
        const [sRes, attRes, feeRes, noticeRes] = await Promise.all([
          api.get(`/students/${studentId}`),
          api.get(`/student-attendance/${studentId}`),
          api.get(`/fees/student/${studentId}`),
          api.get(`/notices`),
        ]);

        setStudent(sRes.data);
        setAttendanceCount(attRes.data.length || 0);
        setFeesSummary(feeRes.data || { totalPaid: 0, fees: [] });
        setNotices((noticeRes.data || []).slice(0, 5));
      } catch (err) {
        console.error("Parent dashboard load failed", err.response || err);
      }
    };
    load();
  }, [refreshUser]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Parent Dashboard</h1>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Due Fees</div>
            <div className="text-xl font-bold">${feesSummary?.totalPaid || 0}</div>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <DollarSign className="text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Notifications</div>
            <div className="text-xl font-bold">{notices.length}</div>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Bell className="text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Result</div>
            <div className="text-xl font-bold">16</div>
          </div>
          <div className="p-3 bg-amber-100 rounded-full">
            <GraduationCap className="text-amber-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Expenses</div>
            <div className="text-xl font-bold">${(feesSummary?.fees || []).reduce((s, f) => s + (f.amount || 0), 0)}</div>
          </div>
          <div className="p-3 bg-sky-100 rounded-full">
            <Wallet className="text-sky-600" />
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* My Kids */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">My Kids</h2>
              <div className="text-sm text-gray-400">...</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded p-4 flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-2xl font-semibold text-blue-700">
                  {student?.name ? (student.name.split(' ').map(n=>n[0]).slice(0,2).join('')) : 'S'}
                </div>
                <div>
                  <div className="text-sm text-gray-500">Name:</div>
                  <div className="font-semibold">{student?.name || '-'}</div>
                  <div className="text-sm text-gray-500">Gender: {student?.gender || '-'}</div>
                  <div className="text-sm text-gray-500">Class: {student?.className || '-'}</div>
                </div>
              </div>

              <div className="border rounded p-4">
                <div className="text-sm text-gray-500">Admission Id</div>
                <div className="font-semibold">{student?._id ? '#' + student._id.slice(-4) : '-'}</div>
                <div className="mt-2 text-sm text-gray-500">Roll: {student?.roll || '-'}</div>
                <div className="mt-2 text-sm text-gray-500">Section: {student?.section || '-'}</div>
              </div>
            </div>
          </div>

          {/* All Expenses */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">All Expenses</h2>
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Search..." className="border p-2 rounded text-sm" />
                <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">SEARCH</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th>ID</th>
                    <th>Expense</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>E-Mail</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(feesSummary?.fees || []).map((f, i) => (
                    <tr key={f._id || i} className="border-t">
                      <td className="p-2">#{(f._id||'').slice(-6)}</td>
                      <td className="p-2">{f.type}</td>
                      <td className="p-2">${f.amount}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white text-xs ${true ? 'bg-green-500' : 'bg-red-500'}`}>
                          Paid
                        </span>
                      </td>
                      <td className="p-2">{student?.email || '-'}</td>
                      <td className="p-2">{f.paidOn ? new Date(f.paidOn).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!feesSummary?.fees?.length && <p className="text-gray-500 mt-3">No fee records found.</p>}

          </div>

        </div>

        {/* Right: notifications & exam results */}
        <div className="space-y-4">

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">Notifications</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notices.map(n => (
                <div key={n._id} className="flex items-start gap-3">
                  <div className="w-2 h-10 bg-indigo-100 rounded" />
                  <div>
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="text-sm text-gray-500">{n.description?.slice(0,80)}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
              {!notices.length && <div className="text-gray-500">No notices</div>}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-3">All Exam Results</h3>
            <div className="text-sm text-gray-500">No results available yet — check back after exams.</div>
          </div>

        </div>
      </div>
    </div>
  );
}

