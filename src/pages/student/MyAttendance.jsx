import { useEffect, useState } from "react";
import api from "../../services/api";

const MyAttendance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem("token");
      const res = await api.get("/attendance/student", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">My Attendance</h1>

      <table className="w-full bg-white shadow">
        <thead className="bg-gray-200">
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(a => (
            <tr key={a._id}>
              <td className="p-2">{a.date}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAttendance;
