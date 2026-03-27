import { useEffect, useState } from "react";
import api from "../../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/api";

const API = API_BASE_URL;

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [s, setStudent] = useState(null);

  useEffect(() => {
    api
      .get(`/students/${id}`)
      .then((res) => setStudent(res.data))
      .catch((err) => console.error("Student details error", err));
  }, [id]);

  if (!s) return <p className="p-6">Loading student details...</p>;

  const photoUrl = s.photo ? `${API}/uploads/photos/${s.photo}` : "";

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER CARD */}
      <div className="bg-white shadow rounded p-6 flex justify-between items-center mb-6">
        <div className="flex gap-6 items-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="student"
              className="w-32 h-32 rounded object-cover border"
            />
          ) : (
            <div className="w-32 h-32 rounded border bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
              No photo
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold">
              {s.firstName} {s.lastName}
            </h1>
            <p className="text-gray-600">
              Class {s.className} | Section {s.section}
            </p>
            <p className="text-sm text-gray-500">
              Admission ID: {s.admissionId}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/students/edit/${s._id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Edit
          </button>

          <a
            href={`${API}/api/students/download/${s.className}?session=${s.session}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Download
          </a>
        </div>
      </div>

      {/* DETAILS SECTIONS */}
      <Card title="Academic Details">
        <Row label="Session" value={s.session} />
        <Row label="Class" value={s.className} />
        <Row label="Section" value={s.section} />
        <Row label="Roll No" value={s.roll} />
        <Row label="Medium" value={s.medium} />
        <Row label="Admission Type" value={s.admissionType} />
        <Row label="Previous School" value={s.prevSchool} />
        <Row label="Admission Date" value={s.admissionDate?.slice(0, 10)} />
      </Card>

      <Card title="Personal Details">
        <Row label="Gender" value={s.gender} />
        <Row label="DOB" value={s.dob?.slice(0, 10)} />
        <Row label="Blood Group" value={s.bloodGroup} />
        <Row label="Religion" value={s.religion} />
        <Row label="Nationality" value={s.nationality} />
        <Row label="Aadhaar" value={s.aadhaar} />
      </Card>

      <Card title="Parent Details">
        <Row label="Father Name" value={s.father?.name} />
        <Row label="Father Mobile" value={s.father?.mobile} />
        <Row label="Father Occupation" value={s.father?.occupation} />
        <Row label="Father Income" value={s.father?.income} />
        <Row label="Mother Name" value={s.mother?.name} />
        <Row label="Mother Mobile" value={s.mother?.mobile} />
        <Row label="Guardian Name" value={s.guardian?.name} />
        <Row label="Guardian Mobile" value={s.guardian?.mobile} />
      </Card>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Card({ title, children }) {
  return (
    <div className="bg-white shadow rounded p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <p className="text-sm">
      <span className="font-medium">{label}:</span>{" "}
      {value || "-"}
    </p>
  );
}
