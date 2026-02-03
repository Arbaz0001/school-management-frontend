import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Attendance(){
  const { refreshUser } = useContext(AuthContext);
  const [records, setRecords] = useState([]);

  useEffect(()=>{
    const load = async()=>{
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      const res = await api.get(`/student-attendance/${me.student._id}`);
      setRecords(res.data);
    }
    load();
  },[refreshUser]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Attendance</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r=> (
            <tr key={r._id} className="border-t">
              <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!records.length && <p className="text-gray-500">No attendance records found.</p>}
    </div>
  )
}
