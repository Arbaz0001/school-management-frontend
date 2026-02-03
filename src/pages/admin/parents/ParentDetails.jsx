import { User, Mail } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";

export default function ParentDetails() {
  const { id } = useParams();
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/users/${id}`)
      .then(res => setParent(res.data))
      .catch(err => {
        console.error('Failed to load parent', err);
        alert('Failed to load parent');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    if (!confirm('Delete this parent? This will remove their account.')) return;
    try {
      await api.delete(`/users/${id}`);
      alert('Parent removed');
      navigate('/admin/parents');
    } catch (err) {
      console.error('Delete failed', err);
      alert(err?.response?.data?.message || 'Failed to delete parent');
    }
  };

  const onSend = async () => {
    if (!confirm('Send credentials (this will reset the password) to this parent?')) return;
    try{
      const res = await api.post(`/users/${id}/send-credentials`);
      alert(`${res.data.message || 'Sent'}\n${res.data.loginDetails?.password ? 'New Password: ' + res.data.loginDetails.password : ''}`);
    }catch(err){
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to send credentials');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!parent) return <div>Parent not found.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border flex items-center gap-6 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <User size={36} className="text-blue-700" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{parent.name}</h1>
            <p className="text-sm text-gray-500">{parent.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded ${parent.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {parent.isActive ? 'Active' : 'Disabled'}
            </span>
            <div className="text-sm text-gray-600 mt-2">Student: {parent.student?.name || '-'}</div>
          </div>
        </div>

        <div className="space-x-3">
          {user?.role === 'admin' && (
            <>
              <button onClick={() => navigate(`/admin/parents/edit/${id}`)} className="px-4 py-2 bg-gray-100 rounded">Edit</button>
              <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </>
          )}
          {user?.role === 'admin' && <button onClick={onSend} className="px-4 py-2 bg-yellow-500 text-white rounded">Send Credentials</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded border">
          <h2 className="font-semibold mb-4">Contact</h2>
          <div className="space-y-3 text-sm">
            <p className="flex items-center gap-2"><Mail size={14} /> {parent.email}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded border">
          <h2 className="font-semibold mb-4">Linked Student</h2>
          <div className="space-y-2 text-sm">
            <div className="font-semibold">{parent.student?.name || '-'}</div>
            <div className="text-gray-500">Email: {parent.student?.email || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
