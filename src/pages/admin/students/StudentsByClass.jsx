import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/api";

export default function StudentsByClass() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/students/class-count`)
      .then((res) => setData(res.data));
  }, []);

  const classes = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">All Students</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {classes.map((cls) => {
          const found = data.find((d) => d._id === cls);
          return (
            <div
              key={cls}
              onClick={() => navigate(`/admin/students/class/${cls}`)}
              className="cursor-pointer bg-white shadow rounded p-4 text-center hover:scale-105 transition"
            >
              <h2 className="text-lg font-semibold">Class {cls}</h2>
              <p className="text-sm text-gray-600">
                {found ? found.total : 0} Students
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}