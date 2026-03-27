import { useEffect, useState } from "react";
import axios from "axios";
import BulkAdmissionModal from "./BulkAdmissionModal";
import API_BASE_URL from "../../../config/api";

export default function AdmissionForm() {
  const [openBulk, setOpenBulk] = useState(false);
  const [preview, setPreview] = useState(null);
  const [sessions, setSessions] = useState([]);

  const [formData, setFormData] = useState({
    session: "",
    admissionDate: "",

    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    religion: "",
    nationality: "",
    aadhaar: "",

    studentLoginId: "",
    studentPassword: "",

    className: "",
    section: "",
    roll: "",
    medium: "",
    prevSchool: "",
    prevClass: "",
    tcNumber: "",
    admissionType: "",

    fatherName: "",
    fatherMobile: "",
    fatherEmail: "",
    fatherOccupation: "",
    fatherIncome: "",
    motherName: "",
    motherMobile: "",
    motherOccupation: "",
    guardianName: "",
    guardianRelation: "",
    guardianMobile: "",

    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* 🔥 FETCH SESSIONS FROM BACKEND */
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/sessions`)
      .then(res => setSessions(res.data))
      .catch(err => console.error("Session load error", err));
  }, []);

  const numericFields = ["roll", "aadhaar", "fatherMobile", "motherMobile", "guardianMobile", "fatherIncome"];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      setFormData({ ...formData, photo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, v ?? ""));

      await axios.post(`${API_BASE_URL}/api/students`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Student admitted successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Admission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Student Admission</h1>
        <button onClick={() => setOpenBulk(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Bulk Admission
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">

        {/* STUDENT DETAILS */}
        <Section title="Student Details">

          {/* SESSION DROPDOWN */}
          <Select
            label="Session"
            name="session"
            value={formData.session}
            onChange={handleChange}
            options={sessions.map(s => ({ label: s.name, value: s.name }))}
            required
          />

          <Input type="date" label="Admission Date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />

          {/* GENDER */}
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
          />

          <Input type="date" label="DOB" name="dob" value={formData.dob} onChange={handleChange} />

          {/* BLOOD GROUP */}
          <Select
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            options={["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => ({ label: b, value: b }))}
          />

          <Input label="Religion" name="religion" value={formData.religion} onChange={handleChange} />
          <Input label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
          <Input label="Aadhaar" name="aadhaar" value={formData.aadhaar} onChange={handleChange} />

        </Section>

        {/* LOGIN */}
        <Section title="Login Details">
          <Input label="Login ID (Email)" name="studentLoginId" value={formData.studentLoginId} onChange={handleChange} required />
          <Input label="Password" name="studentPassword" value={formData.studentPassword} onChange={handleChange} required />
        </Section>

        {/* ACADEMIC */}
        <Section title="Academic Details">
          <Input label="Class" name="className" value={formData.className} onChange={handleChange} />
          <Input label="Section" name="section" value={formData.section} onChange={handleChange} />
          <Input label="Roll" name="roll" value={formData.roll} onChange={handleChange} />

          {/* MEDIUM */}
          <Select
            label="Medium"
            name="medium"
            value={formData.medium}
            onChange={handleChange}
            options={[
              { label: "English", value: "English" },
              { label: "Hindi", value: "Hindi" },
              { label: "Urdu", value: "Urdu" },
            ]}
          />

          <Input label="Previous School" name="prevSchool" value={formData.prevSchool} onChange={handleChange} />
          <Input label="Previous Class" name="prevClass" value={formData.prevClass} onChange={handleChange} />
          <Input label="TC Number" name="tcNumber" value={formData.tcNumber} onChange={handleChange} />
          <Input label="Admission Type" name="admissionType" value={formData.admissionType} onChange={handleChange} />
        </Section>

        {/* PARENTS */}
        <Section title="Parent Details">
          <Input label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
          <Input label="Father Mobile" name="fatherMobile" value={formData.fatherMobile} onChange={handleChange} />
          <Input label="Father Email" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} />
          <Input label="Father Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} />
          <Input label="Father Income" name="fatherIncome" value={formData.fatherIncome} onChange={handleChange} />

          <Input label="Mother Name" name="motherName" value={formData.motherName} onChange={handleChange} />
          <Input label="Mother Mobile" name="motherMobile" value={formData.motherMobile} onChange={handleChange} />
          <Input label="Mother Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} />
        </Section>

        {/* GUARDIAN */}
        <Section title="Guardian Details">
          <Input label="Guardian Name" name="guardianName" value={formData.guardianName} onChange={handleChange} />
          <Input label="Relation" name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} />
          <Input label="Mobile" name="guardianMobile" value={formData.guardianMobile} onChange={handleChange} />
        </Section>

        {/* PHOTO UPLOAD */}
<div className="mt-8">
  <label className="block text-sm font-medium mb-2">
    Student Photo
  </label>

  <label className="flex items-center gap-3 px-4 py-2 bg-gray-50 border rounded cursor-pointer w-full md:w-1/3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0016.414 7L13 3.586A2 2 0 0011.586 3H4z" />
    </svg>

    <span className="text-sm text-gray-700">
      Click to upload a photo
    </span>

    <input
      type="file"
      name="photo"
      accept="image/*"
      onChange={handleChange}
      className="hidden"
    />
  </label>

  {formData.photo && (
    <div className="mt-3 flex items-center gap-3">
      <img
        src={preview}
        alt="preview"
        className="w-24 h-24 rounded object-cover border"
      />
      <div>
        <div className="text-sm">{formData.photo.name}</div>
        <div className="text-xs text-gray-500">
          {(formData.photo.size / 1024).toFixed(0)} KB
        </div>
      </div>
    </div>
  )}
</div>


        <button disabled={submitting} className="mt-8 bg-green-600 text-white px-6 py-2 rounded">
          {submitting ? "Saving..." : "Save Admission"}
        </button>
      </form>

      {openBulk && <BulkAdmissionModal onClose={() => setOpenBulk(false)} />}
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input {...props} className="w-full border px-3 py-2 rounded mt-1" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select {...props} className="w-full border px-3 py-2 rounded mt-1">
        <option value="">Select {label}</option>
        {options.map((o, i) => (
          <option key={i} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <>
      <h2 className="text-lg font-semibold mt-10 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{children}</div>
    </>
  );
}
