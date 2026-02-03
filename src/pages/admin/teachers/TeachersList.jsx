import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const limit = 10;

  const load = (p = 1, query = "") => {
    setLoading(true);
    api
      .get(`/teachers?page=${p}&limit=${limit}&q=${encodeURIComponent(query)}`)
      .then((res) => {
        setTeachers(res.data.data);
        setPage(res.data.page);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Failed to load teachers", err);
        alert("Failed to load teachers");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(1, "");
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(1, q);
  };

  const gotoPage = (p) => {
    if (p < 1 || p > totalPages) return;
    load(p, q);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Teachers</h1>
        <div className="flex items-center space-x-4">
          <form onSubmit={onSearch} className="flex items-center space-x-2">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, username or subjects" className="border p-2 rounded" />
            <button type="submit" className="bg-gray-200 px-3 py-2 rounded">Search</button>
          </form>
          <Link
            to="/admin/teachers/create"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Teacher
          </Link>
        </div>
      </div>

      <div className="bg-white border rounded">
        {loading ? (
          <div className="p-6">Loading teachers...</div>
        ) : teachers.length === 0 ? (
          <div className="p-6">No teachers found.</div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Username</th>
                  <th className="p-3 text-left">Session</th>
                  <th className="p-3 text-left">Subjects</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t._id} className="border-t">
                    <td className="p-3">{t.fullName || t.user?.name}</td>
                    <td className="p-3">{t.email || t.user?.email}</td>
                    <td className="p-3">{t.username}</td>
                    <td className="p-3">{t.user?.session?.name || "-"}</td>
                    <td className="p-3">{t.subjects?.join(", ") || "-"}</td>
                    <td className="p-3">{t.user?.isActive ? "Active" : "Disabled"}</td>
                    <td className="p-3 space-x-3">
                    <Link to={`/admin/teachers/${t._id}/profile`}>Profile</Link>
                    <Link to={`/admin/teachers/edit/${t._id}`}>Edit</Link>
                    <Link to={`/admin/teachers/${t._id}/salary`}>Salary</Link>
                    <Link to={`/admin/teachers/${t._id}/notices`}>Notice</Link>
                    <button onClick={async () => {
                      if (!confirm('Delete this teacher? This will disable their login and remove their profile.')) return;
                      try {
                        await api.delete(`/teachers/${t._id}`);
                        // remove from list
                        setTeachers(prev => prev.filter(x => x._id !== t._id));
                        alert('Teacher removed');
                      } catch (err) {
                        console.error('Delete failed', err);
                        alert(err?.response?.data?.message || 'Failed to delete teacher');
                      }
                    }} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="p-4 flex items-center justify-between">
              <div>
                Page {page} of {totalPages}
              </div>
              <div className="space-x-2">
                <button onClick={() => gotoPage(page - 1)} className="px-3 py-1 bg-gray-100 rounded" disabled={page === 1}>Prev</button>
                <button onClick={() => gotoPage(page + 1)} className="px-3 py-1 bg-gray-100 rounded" disabled={page === totalPages}>Next</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
