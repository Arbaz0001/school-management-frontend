import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Homework() {
  const [homeworks, setHomeworks] = useState([]);
  const [title, setTitle] = useState("");
  const [classes, setClasses] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [showSubs, setShowSubs] = useState(null);
  const [subsMap, setSubsMap] = useState({});
  const [savingFeedback, setSavingFeedback] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/teachers/me/homework', { headers: { Authorization: `Bearer ${token}` } });
      setHomeworks(res.data.homeworks);
    } catch (err) {
      console.error('LOAD HW ERR:', err.response?.data || err.message);
    }
  };

  const fetchSubmissions = async (hwId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/homework/${hwId}/submissions`, { headers: { Authorization: `Bearer ${token}` } });
      setSubsMap(prev => ({ ...prev, [hwId]: res.data.submissions }));
    } catch (err) {
      console.error('FETCH SUBS ERR:', err.response?.data || err.message);
      alert('Failed to load submissions');
    }
  };

  const saveFeedback = async (submissionId, hwId) => {
    const grade = document.getElementById(`grade-${submissionId}`).value;
    const feedback = document.getElementById(`fb-${submissionId}`).value;
    setSavingFeedback(prev => ({ ...prev, [submissionId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await api.post(`/homework/submission/${submissionId}/feedback`, { grade, feedback }, { headers: { Authorization: `Bearer ${token}` } });
      // update local submission
      setSubsMap(prev => ({ ...prev, [hwId]: prev[hwId].map(x => x._id === submissionId ? res.data.submission : x) }));
      alert('Saved');
    } catch (err) {
      console.error('SAVE FB ERR:', err.response?.data || err.message);
      alert('Failed to save');
    } finally {
      setSavingFeedback(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const post = async (e) => {
    e.preventDefault();
    if (!title || !classes) return alert('Title and classes are required');

    const fd = new FormData();
    fd.append('title', title);
    fd.append('classes', classes);
    fd.append('description', description);
    if (file) fd.append('file', file);

    try {
      const token = localStorage.getItem('token');
      await api.post('/teachers/me/homework', fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      setTitle(''); setClasses(''); setDescription(''); setFile(null);
      load();
      alert('Homework posted');
    } catch (err) {
      console.error('POST HW ERROR:', err.response?.data || err.message);
      alert('Failed');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Homework</h1>

      <form onSubmit={post} className="bg-white p-4 rounded border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 rounded" />
          <input value={classes} onChange={e=>setClasses(e.target.value)} placeholder="Classes (comma separated)" className="border p-2 rounded" />
          <input type="date" className="border p-2 rounded" />
        </div>

        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full mt-3 border p-2 rounded" placeholder="Details" />
        <div className="flex items-center gap-3 mt-3">
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Post Homework</button>
        </div>
      </form>

      {homeworks.length === 0 ? (
        <p className="text-gray-500">No homework posted yet</p>
      ) : (
        <div className="space-y-3">
          {homeworks.map(h => (
            <div key={h._id} className="bg-white p-4 rounded border">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{h.title}</div>
                  <div className="text-sm text-gray-500">Classes: {h.classes?.join(', ')}</div>
                </div>
                {h.file && <a className="text-blue-600" href={`http://localhost:5000/uploads/docs/${h.file}`} target="_blank" rel="noreferrer">Download</a>}
              </div>
              <p className="mt-2 text-sm text-gray-700">{h.description}</p>
              {h.dueDate && <p className="text-sm text-gray-500 mt-2">Due: {new Date(h.dueDate).toLocaleDateString()}</p>}
              <div className="mt-3">
                <button onClick={async () => { setShowSubs(showSubs === h._id ? null : h._id); if (!subsMap[h._id]) await fetchSubmissions(h._id); }} className="text-sm bg-indigo-600 text-white px-3 py-1 rounded">{showSubs === h._id ? 'Hide Submissions' : 'View Submissions'}</button>
              </div>

              {showSubs === h._id && (
                <div className="mt-3 border-t pt-3 space-y-3">
                  {(subsMap[h._id] || []).length === 0 ? (
                    <div className="text-sm text-gray-500">No submissions yet</div>
                  ) : (
                    (subsMap[h._id] || []).map(s => (
                      <div key={s._id} className="p-3 bg-gray-50 rounded border">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{s.student?.firstName} {s.student?.lastName} • {s.student?.className} • Roll: {s.student?.roll}</div>
                            <div className="text-sm text-gray-600">Submitted: {s.submittedAt ? new Date(s.submittedAt).toLocaleString() : '—'}</div>
                          </div>
                          <div>
                            {s.file && <a className="text-blue-600" href={`http://localhost:5000/uploads/docs/${s.file}`} target="_blank" rel="noreferrer">Download</a>}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{s.note}</div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                          <input defaultValue={s.grade || ''} placeholder="Grade" id={`grade-${s._id}`} className="border p-2 rounded" />
                          <input defaultValue={s.feedback || ''} placeholder="Feedback" id={`fb-${s._id}`} className="border p-2 rounded" />
                          <div>
                            <button onClick={() => saveFeedback(s._id, h._id)} className="bg-green-600 text-white px-3 py-1 rounded">{savingFeedback[s._id] ? 'Saving...' : 'Save'}</button>
                          </div>
                        </div>
                      </div>
                    ))
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


