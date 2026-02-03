import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function EditParent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', studentId: '', isActive: true, className: '' });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudentDocId, setSelectedStudentDocId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const r = await api.get(`/users/${id}`);
        const p = r.data;
        setForm(f => ({ ...f, name: p.name || '', email: p.email || '', isActive: p.isActive ?? true }));
        // If a student is linked (this is the user's _id of a student), we need to find its student doc id later
        setForm(f => ({ ...f, studentId: p.student || '' }));
      } catch (err) {
        console.error('Failed to load parent', err);
        alert('Failed to load parent');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    // load class list
    const load = async () => {
      try{
        const r = await api.get('/students/classes');
        setClasses(r.data?.classes || []);
      }catch(err){ console.error('Failed to load classes', err); setClasses([]); }
    }
    load();
  },[]);

  useEffect(()=>{
    // when class selected, load students for that class
    const loadStudents = async () => {
      if(!form.className) {
        setStudents([]);
        setSelectedStudentDocId('');
        return;
      }
      try{
        const r = await api.get(`/students/class/${encodeURIComponent(form.className)}`);
        setStudents(r.data || []);
        // If form.studentId is set (it's a user id), find matching student doc
        if (form.studentId) {
          const matched = (r.data || []).find(s => {
            const linkedUser = s.user;
            const userId = linkedUser && (typeof linkedUser === 'object' ? linkedUser._id : linkedUser);
            return String(userId) === String(form.studentId);
          });
          if (matched) setSelectedStudentDocId(matched._id);
        }
      }catch(err){ console.error('Failed to load students for class', err); setStudents([]); }
    }
    loadStudents();
  },[form.className, form.studentId]);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const onSubmit = async (e) => {
    e.preventDefault();
    if(!form.name || !form.email){ setErrors({ general: 'Name and email are required' }); return; }
    try{
      const payload = { name: form.name, email: form.email, isActive: !!form.isActive };
      if (selectedStudentDocId) {
        // fetch student doc to get linked user id
        const r = await api.get(`/students/${selectedStudentDocId}`);
        const linkedUser = r.data?.user;
        const userId = linkedUser && (typeof linkedUser === 'object' ? linkedUser._id : linkedUser);
        if (userId) payload.studentId = userId;
      }
      const res = await api.put(`/users/${id}`, payload);
      alert(res.data.message || 'Updated');
      navigate('/admin/parents');
    }catch(err){
      console.error('Update failed', err);
      const msg = err?.response?.data?.message || 'Failed to update';
      setErrors({ general: msg });
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded border max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Parent</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={onChange} placeholder="Parent Name" className="border p-2 rounded w-full" />
        <input name="email" value={form.email} onChange={onChange} placeholder="Email" className="border p-2 rounded w-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Class</label>
            <select name="className" value={form.className} onChange={onChange} className="border p-2 rounded w-full">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Student</label>
            <select name="selectedStudent" value={selectedStudentDocId} onChange={(e)=> setSelectedStudentDocId(e.target.value)} className="border p-2 rounded w-full">
              <option value="">Select Student</option>
              {students.map(s=> {
                const label = `${s.firstName || s.name || ''} ${s.lastName || ''}`.trim();
                return <option key={s._id} value={s._id}>{label}</option>
              })}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.isActive} onChange={(e)=> setForm({...form, isActive: e.target.checked})} /> Active
        </label>

        {errors.general && <div className="text-red-600">{errors.general}</div>}

        <div className="flex items-center gap-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
          <button type="button" onClick={() => navigate('/admin/parents')} className="px-4 py-2 rounded border">Cancel</button>
        </div>
      </form>
    </div>
  )
}