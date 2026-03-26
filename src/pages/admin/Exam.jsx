import { useState, useEffect } from "react";
import api from "../../services/api";
import { Trash2, Edit2, Plus, Calendar, Clock } from "lucide-react";

export default function AdminExam() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    examName: "",
    examType: "Unit Test",
    description: "",
    classes: [],
    subjects: [],
    startDate: "",
    endDate: "",
    totalMarks: 100,
    duration: 60,
    schedule: [],
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get("/exams");
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    try {
      const classes = formData.classes.split(",").map((c) => c.trim()).filter(Boolean);
      const subjects = formData.subjects.split(",").map((s) => s.trim()).filter(Boolean);

      const payload = {
        ...formData,
        classes,
        subjects,
      };

      if (editingId) {
        await api.put(`/exams/${editingId}`, payload);
      } else {
        await api.post("/exams", payload);
      }
      fetchExams();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error("Error saving exam:", error);
      alert(error.response?.data?.message || "Error saving exam");
    }
  };

  const resetForm = () => {
    setFormData({
      examName: "",
      examType: "Unit Test",
      description: "",
      classes: [],
      subjects: [],
      startDate: "",
      endDate: "",
      totalMarks: 100,
      duration: 60,
      schedule: [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this exam?")) {
      try {
        await api.delete(`/exams/${id}`);
        fetchExams();
      } catch (error) {
        console.error("Error deleting exam:", error);
      }
    }
  };

  const handleEdit = (exam) => {
    setFormData({
      ...exam,
      classes: Array.isArray(exam.classes) ? exam.classes.join(", ") : "",
      subjects: Array.isArray(exam.subjects) ? exam.subjects.join(", ") : "",
    });
    setEditingId(exam._id);
    setShowForm(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📝 Exam Management</h1>
        <p className="text-sm text-gray-600 mt-1">Schedule and manage school exams</p>
      </div>

      {/* ADD BUTTON */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
        >
          <Plus size={20} /> Schedule New Exam
        </button>
      </div>

      {/* ADD/EDIT FORM */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Exam" : "Schedule New Exam"}</h2>
          <form onSubmit={handleAddExam} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Exam Name *"
              value={formData.examName}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Unit Test">Unit Test</option>
              <option value="Mid-term">Mid-term</option>
              <option value="Final">Final</option>
              <option value="Practical">Practical</option>
              <option value="Viva">Viva</option>
              <option value="Project">Project</option>
            </select>
            <input
              type="text"
              placeholder="Classes (comma separated, e.g., 10A, 10B) *"
              value={typeof formData.classes === "string" ? formData.classes : formData.classes.join(", ")}
              onChange={(e) => setFormData({ ...formData, classes: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Subjects (comma separated, e.g., Math, Science) *"
              value={typeof formData.subjects === "string" ? formData.subjects : formData.subjects.join(", ")}
              onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              value={formData.startDate.split("T")[0]}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              value={formData.endDate.split("T")[0]}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.totalMarks}
              onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="col-span-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="col-span-1 sm:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
            />
            <div className="col-span-1 sm:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? "Update Exam" : "Schedule Exam"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EXAMS TABLE/GRID */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading exams...</div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md text-gray-500">
          No exams scheduled
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Desktop Table */}
          <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Exam Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Classes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dates</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam.examName}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {exam.examType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {Array.isArray(exam.classes) ? exam.classes.join(", ") : exam.classes}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-blue-600" />
                        {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(exam)}
                        className="text-blue-600 hover:text-blue-800 transition p-1"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(exam._id)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sm:hidden space-y-3">
            {exams.map((exam) => (
              <div key={exam._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600">
                <h3 className="font-semibold text-gray-900">{exam.examName}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Type:</span> {exam.examType}
                  </p>
                  <p>
                    <span className="font-medium">Classes:</span>{" "}
                    {Array.isArray(exam.classes) ? exam.classes.join(", ") : exam.classes}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock size={14} />
                    {exam.duration} minutes | {exam.totalMarks} marks
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(exam)}
                    className="flex-1 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
                    className="flex-1 text-red-600 hover:bg-red-50 px-3 py-2 rounded transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
