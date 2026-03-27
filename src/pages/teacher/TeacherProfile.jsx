import { useEffect, useState } from "react";
import api from "../../services/api";
import API_BASE_URL from "../../config/api";

export default function TeacherProfile() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await api.get('/teachers/me', { headers: { Authorization: `Bearer ${token}` } });
        setTeacher(res.data.teacher);
      } catch (err) {
        console.error('LOAD PROFILE ERR:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '-');

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && teacher && (
        <div className="space-y-6">
          {/* Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded border">
              <h2 className="font-semibold mb-2">Account Info</h2>
              <p><span className="text-sm text-gray-500">Login / Username:</span> <strong>{teacher.username || '-'}</strong></p>
              <p><span className="text-sm text-gray-500">Login Email:</span> {teacher.user?.email || '-'}</p>
              <p><span className="text-sm text-gray-500">Active:</span> {teacher.user?.isActive ? 'Yes' : 'No'}</p>
              <p><span className="text-sm text-gray-500">Session:</span> {teacher.user?.session?.name || (teacher.user?.session || '-')}</p>
              <p><span className="text-sm text-gray-500">Role:</span> {teacher.role || 'teacher'}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded border">
              <h2 className="font-semibold mb-2">Timestamps</h2>
              <p><span className="text-sm text-gray-500">Created:</span> {fmtDate(teacher.createdAt)}</p>
              <p><span className="text-sm text-gray-500">Updated:</span> {fmtDate(teacher.updatedAt)}</p>
            </div>
          </div>

          {/* Personal */}
          <div className="p-4 bg-white rounded border">
            <h2 className="font-semibold mb-2">Personal Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Full name</p>
                <div className="font-medium">{teacher.fullName}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="font-medium">{teacher.email}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <div className="font-medium">{teacher.phone || '-'}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <div className="font-medium">{teacher.gender || '-'}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <div className="font-medium">{fmtDate(teacher.dob)}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <div className="font-medium">{teacher.address || '-'}</div>
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="p-4 bg-white rounded border">
            <h2 className="font-semibold mb-2">Professional Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <div className="font-medium">{teacher.qualification || '-'}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <div className="font-medium">{teacher.experience || '-'}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Subjects</p>
                <div className="font-medium">{teacher.subjects?.length ? teacher.subjects.join(', ') : '-'}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Classes</p>
                <div className="font-medium">{teacher.classes?.length ? teacher.classes.join(', ') : '-'}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Joining Date</p>
                <div className="font-medium">{fmtDate(teacher.joiningDate)}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <div className="font-medium">{teacher.salary == null ? '-' : `₹${teacher.salary}`}</div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="p-4 bg-white rounded border">
            <h2 className="font-semibold mb-2">Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <p className="text-sm text-gray-500">Resume</p>
                {teacher.documents?.resume ? (
                  <a className="text-blue-600" href={`${API_BASE_URL}/uploads/docs/${teacher.documents.resume}`} target="_blank" rel="noreferrer">Download</a>
                ) : (
                  <span className="text-gray-500">Not uploaded</span>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Qualification Certificate</p>
                {teacher.documents?.qualificationCert ? (
                  <a className="text-blue-600" href={`${API_BASE_URL}/uploads/docs/${teacher.documents.qualificationCert}`} target="_blank" rel="noreferrer">Download</a>
                ) : (
                  <span className="text-gray-500">Not uploaded</span>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Aadhaar / ID</p>
                {teacher.documents?.aadhaar ? (
                  <a className="text-blue-600" href={`${API_BASE_URL}/uploads/docs/${teacher.documents.aadhaar}`} target="_blank" rel="noreferrer">Download</a>
                ) : (
                  <span className="text-gray-500">Not uploaded</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
