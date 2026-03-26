import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Attendance(){
  const { refreshUser } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [studentName, setStudentName] = useState("");

  useEffect(()=>{
    const load = async()=>{
      setLoading(true);
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      setStudentName(me.student.name || "");
      try {
        const res = await api.get(`/student-attendance/${me.student._id}`);
        setRecords(res.data || []);
      } catch (err) {
        console.error("Error loading attendance:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[refreshUser]);

  const filteredRecords = records.filter(r => 
    filterStatus === "All" || r.status?.toLowerCase() === filterStatus.toLowerCase()
  );

  const presentDays = records.filter(r => r.status?.toLowerCase() === "present").length;
  const absentDays = records.filter(r => r.status?.toLowerCase() === "absent").length;
  const leaveDays = records.filter(r => r.status?.toLowerCase() === "leave").length;
  const attendancePercentage = records.length > 0 ? Math.round((presentDays / records.length) * 100) : 0;

  const getStatusColor = (status) => {
    const lowerStatus = status?.toLowerCase() || '';
    if (lowerStatus === 'present') {
      return 'bg-green-500';
    }
    if (lowerStatus === 'absent') {
      return 'bg-red-500';
    }
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Attendance Records</h1>
          <p className="text-gray-600 text-sm mt-1">{studentName}</p>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-blue-600">
          {attendancePercentage}%
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Present</p>
              <p className="text-xl md:text-2xl font-bold text-green-600 mt-2">{presentDays}</p>
            </div>
            <CheckCircle size={28} className="text-green-400 opacity-40" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Absent</p>
              <p className="text-xl md:text-2xl font-bold text-red-600 mt-2">{absentDays}</p>
            </div>
            <XCircle size={28} className="text-red-400 opacity-40" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Leave</p>
              <p className="text-xl md:text-2xl font-bold text-orange-600 mt-2">{leaveDays}</p>
            </div>
            <Clock size={28} className="text-orange-400 opacity-40" />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Total Days</p>
              <p className="text-xl md:text-2xl font-bold text-blue-600 mt-2">{records.length}</p>
            </div>
            <Calendar size={28} className="text-blue-400 opacity-40" />
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white p-4 md:p-6 rounded shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <h2 className="font-semibold text-base md:text-lg">Attendance Details</h2>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded text-sm w-full md:w-48 bg-white"
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading attendance records...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-100">
                <tr className="text-left">
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 hidden sm:table-cell">Day</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(r => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded text-white text-xs font-medium ${getStatusColor(r.status)}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 hidden sm:table-cell text-gray-600">{new Date(r.date).toLocaleDateString('en-US', {weekday: 'short'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No attendance records found</p>
          </div>
        )}
      </div>
    </div>
  )
}
