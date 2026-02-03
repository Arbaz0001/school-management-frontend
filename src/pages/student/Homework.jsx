import { useEffect, useState } from "react";
import api from "../../services/api";

export default function StudentHomework() {
  const [homeworks, setHomeworks] = useState([]);
  const [openForm, setOpenForm] = useState(null);
  const [submissions, setSubmissions] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/students/me/homework', { headers: { Authorization: `Bearer ${token}` } });
        setHomeworks(res.data.homeworks || []);
      } catch (err) {
        console.error('LOAD HW ERR:', err.response?.data || err.message);
      }
    };
    load();
  }, []);

  const fetchMySubmission = async (hwId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/homework/${hwId}/my-submission`, { headers: { Authorization: `Bearer ${token}` } });
      setSubmissions(prev => ({ ...prev, [hwId]: res.data.submission }));
    } catch (err) {
      console.error('FETCH SUB ERR:', err.response?.data || err.message);
    }
  };

  const handleToggle = async (hwId) => {
    setOpenForm(openForm === hwId ? null : hwId);
    if (!submissions[hwId]) {
      await fetchMySubmission(hwId);
    }
  };

  const handleSubmit = async (e, hwId) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    const note = e.target.note.value;
    if (!file && !note) return alert('Attach a file or add a note before submitting');

    setLoadingSubmit(true);
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      if (file) form.append('file', file);
      form.append('note', note);

      const res = await api.post(`/homework/${hwId}/submit`, form, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      setSubmissions(prev => ({ ...prev, [hwId]: res.data.submission }));
      alert('Submitted successfully');
      setOpenForm(null);
    } catch (err) {
      console.error('SUBMIT ERR:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Homework</h1>

      {homeworks.length === 0 ? (
        <p className="text-gray-500">No homework assigned to your classes yet</p>
      ) : (
        <div className="space-y-3">
          {homeworks.map(h => (
            <div key={h._id} className="bg-white rounded border p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{h.title}</div>
                  <div className="text-sm text-gray-500">Posted: {new Date(h.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="space-x-3 flex items-center">
                  {h.file && <a className="text-blue-600" href={`http://localhost:5000/uploads/docs/${h.file}`} target="_blank" rel="noreferrer">Download</a>}
                  <button className="text-sm text-white bg-blue-600 px-3 py-1 rounded" onClick={() => handleToggle(h._id)}>{openForm === h._id ? 'Close' : 'Submit'}</button>
                </div>
              </div>
              <p className="mt-2 text-gray-700">{h.description}</p>
              {h.dueDate && <p className="mt-2 text-sm text-gray-500">Due: {new Date(h.dueDate).toLocaleDateString()}</p>}

              {openForm === h._id && (
                <div className="mt-3 border-t pt-3">
                  {submissions[h._id] ? (
                    <div className="text-sm text-green-700">You submitted on {new Date(submissions[h._id].submittedAt).toLocaleString()}. {submissions[h._id].file && <a className="text-blue-600 ml-2" href={`http://localhost:5000/uploads/docs/${submissions[h._id].file}`} target="_blank" rel="noreferrer">View</a>}</div>
                  ) : (
                    <form onSubmit={(e) => handleSubmit(e, h._id)} className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium">Attach file</label>
                        <input type="file" name="file" className="mt-1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Note / Comments</label>
                        <textarea name="note" rows={3} className="w-full border rounded p-2 mt-1"></textarea>
                      </div>
                      <div>
                        <button disabled={loadingSubmit} className="bg-green-600 text-white px-3 py-1 rounded">{loadingSubmit ? 'Submitting...' : 'Submit Homework'}</button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}