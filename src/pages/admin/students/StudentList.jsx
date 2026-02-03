import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/students";

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [session, setSession] = useState("");
  const [className, setClassName] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const limit = 10;

  /* FETCH STUDENTS */
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API, {
        params: {
          search: search || undefined,
          session: session || undefined,
          className: className || undefined,
          page,
          limit,
        },
      });

      // 🔥 IMPORTANT FIX
      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else if (Array.isArray(res.data.students)) {
        setStudents(res.data.students);
      } else {
        setStudents([]);
      }

    } catch (err) {
      console.error("Fetch students error:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, session, className, page]);

  /* DELETE */
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await axios.delete(`${API}/${id}`);
    fetchStudents();
  };

  /* EXPORT */
  const exportExcel = () => {
    if (!className || !session) {
      alert("Select class and session first");
      return;
    }
    window.open(
      `${API}/download/${className}?session=${session}`,
      "_blank"
    );
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">All Students</h1>
        <button
          onClick={exportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Export Excel
        </button>
      </div>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input
          placeholder="Search name / roll"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        />

        <input
          placeholder="Session (2025-2026)"
          value={session}
          onChange={(e) => {
            setPage(1);
            setSession(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        />

        <select
          value={className}
          onChange={(e) => {
            setPage(1);
            setClassName(e.target.value);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Classes</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={String(i + 1)}>
              Class {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th>Class</th>
              <th>Roll</th>
              <th>Session</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && students.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No students found
                </td>
              </tr>
            )}

            {students.map((s) => (
              <tr key={s._id} className="border-t">
                <td className="p-2">
                  {s.firstName} {s.lastName}
                </td>
                <td>{s.className || "-"}</td>
                <td>{s.roll || "-"}</td>
                <td>{s.session || "-"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => navigate(`/admin/students/${s._id}`)}
                    className="text-blue-600"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/admin/students/edit/${s._id}`)}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStudent(s._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">{page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
