import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { User, GraduationCap, IdCard } from "lucide-react";

export default function StudentProfile(){
  const { refreshUser } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async()=>{
      setLoading(true);
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      try {
        const res = await api.get(`/students/${me.student._id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Error loading student profile:", err);
        setStudent(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[refreshUser]);

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500 text-lg">No student linked to your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
        <User size={32} className="text-blue-600" />
        Student Profile
      </h1>

      {/* Main Profile Card */}
      <div className="bg-white p-4 md:p-6 rounded shadow">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shrink-0">
            {student?.name ? (student.name.split(' ').map(n=>n[0]).slice(0,2).join('')) : 'S'}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{student.name}</h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">{student.className} - {student.section}</p>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Roll: {student.roll}</p>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Academic Info */}
        <div className="bg-white p-4 md:p-5 rounded shadow">
          <h3 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
            <GraduationCap size={22} className="text-blue-600" />
            Academic Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Class</p>
              <p className="font-semibold text-base">{student.className || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Section</p>
              <p className="font-semibold text-base">{student.section || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Roll Number</p>
              <p className="font-semibold text-base">{student.roll || '-'}</p>
            </div>
            {student.admissionNo && (
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Admission No.</p>
                <p className="font-semibold text-base">{student.admissionNo}</p>
              </div>
            )}
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white p-4 md:p-5 rounded shadow">
          <h3 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
            <IdCard size={22} className="text-green-600" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Gender</p>
              <p className="font-semibold text-base">{student.gender || '-'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs md:text-sm">Date of Birth</p>
              <p className="font-semibold text-base">{student.dob ? new Date(student.dob).toLocaleDateString() : '-'}</p>
            </div>
            {student.email && (
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Email</p>
                <p className="font-semibold text-base truncate">{student.email}</p>
              </div>
            )}
            {student.phone && (
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Phone</p>
                <p className="font-semibold text-base">{student.phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
