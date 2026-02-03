import { useState, useEffect } from "react";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateParent(){
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  // store the selected Student document id separately so we can fetch details
  const [selectedStudentDocId, setSelectedStudentDocId] = useState('');

  const [form, setForm] = useState({ name: '', email: '', className: '', studentId: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    // load class list
    const load = async () => {
      try{
        const r = await api.get('/students/classes');
        setClasses(r.data?.classes || []);
      }catch(err){
        console.error('Failed to load classes', err?.response?.data || err);
        setClasses([]);
      }
    }
    load();
  },[]);

  useEffect(()=>{
    // when class selected, load students for that class
    const loadStudents = async () => {
      if(!form.className) {
        setStudents([]);
        setSelectedStudentDocId('');
        setStudentDetails(null);
        setForm(f => ({ ...f, studentId: '' }));
        return;
      }
      setLoadingStudents(true);
      try{
        const r = await api.get(`/students/class/${encodeURIComponent(form.className)}`);
        setStudents(r.data || []);
      }catch(err){
        console.error('Failed to load students for class', err?.response?.data || err);
        setStudents([]);
      }finally{
        setLoadingStudents(false);
      }
    }
    loadStudents();
  },[form.className]);

  useEffect(()=>{
    // when student doc id selected, fetch details (we use doc id to fetch the Student doc)
    const loadDetails = async () => {
      if(!selectedStudentDocId){ setStudentDetails(null); return; }
      try{
        const r = await api.get(`/students/${selectedStudentDocId}`);
        setStudentDetails(r.data);
        // set the form.studentId to the linked User id expected by the backend (User._id)
        const linkedUser = r.data?.user;
        const userId = linkedUser && (typeof linkedUser === 'object' ? linkedUser._id : linkedUser);
        setForm(f => ({ ...f, studentId: userId || '' }));
      }catch(err){
        console.error('Failed to load student details', err?.response?.data || err);
        setStudentDetails(null);
        setForm(f => ({ ...f, studentId: '' }));
      }
    }
    loadDetails();
  },[selectedStudentDocId]);

  const handleChange = (e)=> setForm({...form, [e.target.name]: e.target.value});

  const handleSubmit = async (e)=>{
    e.preventDefault();
    // basic validation
    if(!form.name || !form.email || !selectedStudentDocId){
      setErrors({ general: 'All fields required' });
      return;
    }

    // ensure selected student has a linked User id
    if(!studentDetails?.user){
      setErrors({ general: 'Selected student does not have a linked user account. Please create the student login first.' });
      return;
    }

    // validate password if provided
    if(form.password && form.password.length < 6){
      setErrors({ general: 'Password must be at least 6 characters' });
      return;
    }

    try{
      setErrors({});
      const payload = { name: form.name, email: form.email, role: 'parent', studentId: form.studentId };
      if(form.password) payload.password = form.password;

      const res = await api.post('/users/create', payload);
      // show generated or provided password to admin and whether email was sent
      const pwd = res.data?.loginDetails?.password;
      const emailSent = res.data?.emailSent;
      alert(`${res.data.message || 'Parent created'}${pwd ? '\nPassword: ' + pwd : ''}${emailSent ? '\nEmail sent to user' : '\nEmail not sent (check SMTP settings)'} `);
      navigate('/admin/parents');
    }catch(err){
      console.error('Create parent error', err?.response || err);
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Error creating parent';
      setErrors({ general: msg });
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create Parent</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Parent Name" className="border p-2 rounded w-full" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Class</label>
            <select name="className" value={form.className} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Student</label>
            <select name="selectedStudent" value={selectedStudentDocId} onChange={(e)=>{
              const docId = e.target.value;
              setSelectedStudentDocId(docId);
            }} className="border p-2 rounded w-full">
              <option value="">{loadingStudents ? 'Loading students...' : 'Select Student'}</option>
              {students.map(s=> {
                const label = `${s.firstName || s.name || ''} ${s.lastName || ''}`.trim();
                return <option key={s._id} value={s._id}>{label}</option>
              })}
            </select>
          </div>
        </div>

        {studentDetails && (
          <div className="border p-3 rounded bg-gray-50">
            <div className="text-sm text-gray-500">Selected Student</div>
            <div className="font-semibold">{studentDetails?.firstName ? `${studentDetails.firstName} ${studentDetails.lastName || ''}` : studentDetails.name}</div>
            <div className="text-sm text-gray-500">Class: {studentDetails?.className || '-'}</div>
            <div className="text-sm text-gray-500">Roll: {studentDetails?.roll || '-'}</div>
            {!studentDetails?.user && (
              <div className="text-sm text-red-600 mt-2">Selected student has no linked login account. Create the student's login before assigning a parent.</div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-1">Password (optional — leave empty to auto-generate)</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded w-full" />
        </div>

        {errors.general && <div className="text-red-600">{errors.general}</div>}
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!selectedStudentDocId || !form.name || !form.email || !studentDetails?.user}>Create Parent</button>
      </form>
    </div>
  )
}
