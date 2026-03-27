import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../config/api";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/students/${id}`)
      .then(res => setForm(res.data));
  }, []);

  const save = async () => {
    await axios.put(`${API_BASE_URL}/api/students/${id}`, form);
    alert("Updated");
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <input
        className="border w-full p-2 mb-3"
        value={form.firstName || ""}
        onChange={e => setForm({ ...form, firstName: e.target.value })}
      />
      <input
        className="border w-full p-2 mb-3"
        value={form.lastName || ""}
        onChange={e => setForm({ ...form, lastName: e.target.value })}
      />

      <button
        onClick={save}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}