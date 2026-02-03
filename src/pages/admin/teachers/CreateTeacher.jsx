import { useState, useEffect } from "react";
import api from "../../../services/api";
import { getSessions } from "../../../services/sessionApi";
import { useNavigate } from "react-router-dom";

export default function CreateTeacher() {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    session: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    qualification: "",
    experience: "",
    subjects: "",
    classes: "",
    joiningDate: "",
    salary: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getSessions()
      .then((res) => setSessions(res.data))
      .catch((err) => console.error("Failed to load sessions", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = (data) => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.session) errs.session = 'Session is required';
    if (!data.fullName || data.fullName.trim().length === 0) errs.fullName = 'Full name is required';
    if (!data.username || data.username.trim().length === 0) errs.username = 'Username is required';
    if (!data.password || data.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (data.email && !emailRx.test(data.email)) errs.email = 'Invalid email';
    if (data.salary && isNaN(Number(data.salary))) errs.salary = 'Salary must be a number';
    if (data.joiningDate && isNaN(new Date(data.joiningDate).getTime())) errs.joiningDate = 'Invalid date';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validate(formData);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    try {
      const payload = { ...formData };
      // POST to backend
      const res = await api.post("/teachers/create", payload);
      alert(res.data.message || "Teacher created successfully");
      // Optionally navigate to teachers list
      navigate("/admin/teachers");
    } catch (err) {
      console.error("Create teacher failed", err.response || err);
      if (err?.response?.data?.errors) {
        const map = {};
        err.response.data.errors.forEach(e => map[e.field] = e.message);
        setErrors(map);
        return;
      }
      alert(err?.response?.data?.message || "Failed to create teacher");
    }
  };

  return (
    <div className="bg-white p-6 rounded border max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Create Teacher</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ================= PERSONAL DETAILS ================= */}
        <div>
          <h2 className="font-semibold mb-4">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" />
              {errors.fullName && <p className="text-red-600 text-sm">{errors.fullName}</p>}
            </div>
            <div>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
              {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
            </div>
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="border p-2 rounded" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded md:col-span-2" />
          </div>
        </div>

        {/* ================= PROFESSIONAL DETAILS ================= */}
        <div>
          <h2 className="font-semibold mb-4">Professional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="Qualification" className="border p-2 rounded" />
            <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (Years)" className="border p-2 rounded" />
            <input name="subjects" value={formData.subjects} onChange={handleChange} placeholder="Subjects (Maths, Science)" className="border p-2 rounded" />
            <input name="classes" value={formData.classes} onChange={handleChange} placeholder="Classes (8A, 9B)" className="border p-2 rounded" />
            <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="border p-2 rounded" />
          </div>
        </div>

        {/* ================= SALARY ================= */}
        <div>
          <h2 className="font-semibold mb-4">Salary Details</h2>
          <input name="salary" value={formData.salary} onChange={handleChange} placeholder="Monthly Salary" className="border p-2 rounded w-full md:w-1/3" />            {errors.salary && <p className="text-red-600 text-sm">{errors.salary}</p>}        </div>

        {/* ================= LOGIN (ADMIN SETS) ================= */}
        <div>
          <h2 className="font-semibold mb-4">Login Credentials (Admin Only)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input name="username" value={formData.username} onChange={handleChange} placeholder="Username (login id)" className="border p-2 rounded" />
              {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
            </div>
            <div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="border p-2 rounded" />
              {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
            </div>
          </div>
        </div>

        {/* ================= SESSION ================= */}
        <div>
          <h2 className="font-semibold mb-4">Assign Session</h2>
          <select name="session" value={formData.session} onChange={handleChange} className="border p-2 rounded w-full md:w-1/3">
            <option value="">Select Session</option>
            {sessions.map((s) => (
              <option key={s._id} value={s.name}>{s.name}</option>
            ))}
          </select>
          {errors.session && <p className="text-red-600 text-sm">{errors.session}</p>}
        </div>

        {/* SUBMIT */}
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded">
          Save Teacher
        </button>
      </form>
    </div>
  );
}
