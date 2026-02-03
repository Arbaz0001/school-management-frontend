import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function StudentProfile(){
  const { refreshUser } = useContext(AuthContext);
  const [student, setStudent] = useState(null);

  useEffect(()=>{
    const load = async()=>{
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      const res = await api.get(`/students/${me.student._id}`);
      setStudent(res.data);
    }
    load();
  },[refreshUser]);

  if(!student) return <div className="bg-white p-6 rounded shadow">No student linked to your account.</div>

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Student Profile</h1>
      <p><strong>Name:</strong> {student.name}</p>
      <p><strong>Class:</strong> {student.className || '-'}</p>
      <p><strong>Roll:</strong> {student.roll || '-'}</p>
      <p><strong>Section:</strong> {student.section || '-'}</p>
    </div>
  )
}
