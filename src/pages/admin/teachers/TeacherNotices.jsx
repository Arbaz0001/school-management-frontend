import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";

export default function TeacherNotices() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [notices, setNotices] = useState([]);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    if (!id) return;
    const headers = { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } };
    api.get(`/teachers/${id}`, headers)
      .then(res => setTeacher(res.data))
      .catch(() => {});

    loadNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadNotices = async () => {
    try {
      const headers = { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } };
      const res = await api.get(`/teachers/${id}/notices`, headers);
      setNotices(res.data.notices || []);
    } catch (err) {
      console.error('Failed to load notices', err);
      alert('Failed to load notices');
    }
  };

  const onSend = async (e) => {
    e.preventDefault();
    if (!title || !text) return alert('Title and text required');

    const form = new FormData();
    form.append('title', title);
    form.append('text', text);
    if (file) form.append('file', file);

    try {
      const headers = { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } };
      const res = await api.post(`/teachers/${id}/notices`, form, headers);
      alert(res.data.message || 'Sent');
      setTitle(''); setText(''); setFile(null);
      loadNotices();
    } catch (err) {
      console.error('Send failed', err);
      alert(err?.response?.data?.message || 'Failed to send notice');
    }
  };

  return (
    <div className="bg-white p-6 rounded border max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Send Notice to Teacher</h1>

      {teacher && (
        <div className="text-sm text-gray-600">Sending to: <b>{teacher.fullName || teacher.user?.name}</b> ({teacher.username || teacher.user?.email})</div>
      )}

      <form onSubmit={onSend} className="space-y-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice Title" className="border p-2 rounded w-full" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Notice Description" className="border p-2 rounded w-full h-32" />

        <div>
          <label className="block text-sm mb-1">Attach PDF (optional)</label>
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded">Send Notice</button>
        </div>
      </form>

      <hr />

      <h2 className="text-xl font-semibold">Notices</h2>
      {notices.length === 0 ? (
        <div className="text-sm text-gray-500">No notices yet.</div>
      ) : (
        <div className="space-y-3">
          {notices.map(n => (
            <div key={n._id} className="border p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-sm text-gray-600">{new Date(n.createdAt).toLocaleString()} by {n.sentBy?.name || 'Admin'}</div>
                </div>
                {n.file && (
                  <a className="text-blue-600" href={`/uploads/notices/${n.file}`} target="_blank" rel="noreferrer">Download PDF</a>
                )}
              </div>

              <div className="mt-2 text-sm">{n.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

