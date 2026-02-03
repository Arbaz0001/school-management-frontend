import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    subjects: "",
    classes: "",
    joiningDate: "",
    salary: "",
    username: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) return;
    api.get(`/teachers/${id}`)
      .then(res => {
        const t = res.data;
        setForm({
          fullName: t.fullName || t.user?.name || "",
          email: t.email || t.user?.email || "",
          phone: t.phone || "",
          qualification: t.qualification || "",
          experience: t.experience || "",
          subjects: (t.subjects || []).join(', '),
          classes: (t.classes || []).join(', '),
          joiningDate: t.joiningDate ? new Date(t.joiningDate).toISOString().slice(0,10) : "",
          salary: t.salary || "",
          username: t.username || "",
          isActive: t.user?.isActive ?? true,
        });
      })
      .catch(err => {
        console.error('Failed to load teacher', err);
        alert('Failed to load teacher');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onChange = (e) => setForm({...form, [e.target.name]: e.target.value});

  const validate = (data) => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.fullName || data.fullName.trim().length === 0) errs.fullName = 'Full name is required';
    if (data.email && !emailRx.test(data.email)) errs.email = 'Invalid email';
    if (data.salary && isNaN(Number(data.salary))) errs.salary = 'Salary must be a number';
    if (data.joiningDate && isNaN(new Date(data.joiningDate).getTime())) errs.joiningDate = 'Invalid date';
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      const payload = { ...form };
      const res = await api.put(`/teachers/${id}`, payload);
      alert(res.data.message || 'Updated');
      navigate(`/admin/teachers/${id}/profile`);
    } catch (err) {
      console.error('Update failed', err);
      if (err?.response?.data?.errors) {
        const map = {};
        err.response.data.errors.forEach(e => map[e.field] = e.message);
        setErrors(map);
        return;
      }
      alert(err?.response?.data?.message || 'Failed to update teacher');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded border max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Edit Teacher</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input name="fullName" value={form.fullName} onChange={onChange} className="border p-2 rounded" />
            {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
          </div>
          <div>
            <input name="email" value={form.email} onChange={onChange} className="border p-2 rounded" />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div>
            <input name="phone" value={form.phone} onChange={onChange} className="border p-2 rounded" />
          </div>
          <div>
            <input name="qualification" value={form.qualification} onChange={onChange} className="border p-2 rounded" />
          </div>
          <div>
            <input name="experience" value={form.experience} onChange={onChange} className="border p-2 rounded" />
          </div>
          <div>
            <input name="subjects" value={form.subjects} onChange={onChange} placeholder="Comma separated" className="border p-2 rounded" />
          </div>
          <div>
            <input name="classes" value={form.classes} onChange={onChange} placeholder="Comma separated" className="border p-2 rounded" />
          </div>
          <div>
            <input type="date" name="joiningDate" value={form.joiningDate} onChange={onChange} className="border p-2 rounded" />
            {errors.joiningDate && <p className="text-red-600 text-sm">{errors.joiningDate}</p>}
          </div>
          <div>
            <input name="salary" value={form.salary} onChange={onChange} className="border p-2 rounded" />
            {errors.salary && <p className="text-red-600 text-sm">{errors.salary}</p>}
          </div>
          <div>
            <input name="username" value={form.username} onChange={onChange} className="border p-2 rounded" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} /> Active
          </label>
          <button className="mt-2 bg-green-600 text-white px-6 py-2 rounded">Update</button>
        </div>
      </form>
    </div>
  );
}
