import { User, Mail, Phone, BookOpen, Calendar, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function TeacherProfileView() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/teachers/${id}`)
      .then(res => setTeacher(res.data))
      .catch(err => {
        console.error('Failed to load teacher', err);
        alert('Failed to load teacher');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    if (!confirm('Delete this teacher? This will disable their login and remove the profile.')) return;
    try {
      await api.delete(`/teachers/${id}`);
      alert('Teacher removed');
      navigate('/admin/teachers');
    } catch (err) {
      console.error('Delete failed', err);
      alert(err?.response?.data?.message || 'Failed to delete teacher');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!teacher) return <div>Teacher not found.</div>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white p-6 rounded border flex items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={40} className="text-blue-700" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{teacher.fullName || teacher.user?.name}</h1>
            <p className="text-sm text-gray-500">{(teacher.subjects || []).join(', ')} Teacher</p>
            <span className="inline-block mt-2 px-3 py-1 text-xs rounded bg-green-100 text-green-700">
              {teacher.user?.isActive ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>

        <div className="space-x-3">
          <button onClick={() => navigate(`/admin/teachers/edit/${id}`)} className="px-4 py-2 bg-gray-100 rounded">Edit</button>
          <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PERSONAL INFO */}
        <div className="bg-white p-6 rounded border">
          <h2 className="font-semibold mb-4">Personal Information</h2>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <Mail size={14} /> {teacher.email || teacher.user?.email}
            </p>
            <p className="flex items-center gap-2">
              <Phone size={14} /> {teacher.phone}
            </p>
            <p className="flex items-center gap-2">
              <Calendar size={14} /> Joining Date: {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>

        {/* PROFESSIONAL INFO */}
        <div className="bg-white p-6 rounded border">
          <h2 className="font-semibold mb-4">Professional Information</h2>

          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2">
              <BookOpen size={14} /> Subjects: {(teacher.subjects || []).join(', ')}
            </p>
            <p className="flex items-center gap-2">
              <Briefcase size={14} /> Experience: {teacher.experience || '-'}
            </p>
            <p>
              <b>Qualification:</b> {teacher.qualification || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* CLASSES & SALARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ASSIGNED CLASSES */}
        <div className="bg-white p-6 rounded border">
          <h2 className="font-semibold mb-4">Assigned Classes</h2>

          <div className="flex flex-wrap gap-2">
            {(teacher.classes || []).map((cls, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700"
              >
                {cls}
              </span>
            ))}
          </div>
        </div>

        {/* SALARY SNAPSHOT */}
        <div className="bg-white p-6 rounded border">
          <h2 className="font-semibold mb-4">Salary Snapshot</h2>
          <p className="text-lg font-bold">{teacher.salary ? `₹${teacher.salary}` : '-'}</p>
          <p className="text-sm text-gray-500">
            (View full salary details in Salary section)
          </p>
        </div>
      </div>

    </div>
  );
}
