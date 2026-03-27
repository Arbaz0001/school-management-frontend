import { useEffect, useState } from "react";
import api from "../../services/api";
import API_BASE_URL from "../../config/api";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get('/teachers/me/documents', { headers: { Authorization: `Bearer ${token}` } });
      setDocs(res.data.docs);
    } catch (err) {
      console.error('LOAD DOCS ERROR:', err.response?.data || err.message);
    }
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title || file.name);

    try {
      const token = localStorage.getItem('token');
      await api.post('/teachers/me/documents', fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      setFile(null); setTitle('');
      loadDocs();
      alert('Uploaded');
    } catch (err) {
      console.error('UPLOAD ERROR:', err.response?.data || err.message);
      alert('Upload failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Documents</h1>

      <form onSubmit={upload} className="mb-6 bg-white p-4 rounded border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded" />
          <input type="file" onChange={e => setFile(e.target.files[0])} className="" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Upload</button>
        </div>
      </form>

      {docs.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet</p>
      ) : (
        <ul className="space-y-3">
          {docs.map(d => (
            <li key={d._id} className="bg-white p-3 rounded border flex justify-between items-center">
              <div>
                <div className="font-medium">{d.title}</div>
                <div className="text-sm text-gray-500">{d.description}</div>
              </div>
              <a className="text-blue-600" href={`${API_BASE_URL}/uploads/docs/${d.file}`} target="_blank" rel="noreferrer">Download</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

