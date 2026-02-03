import { useEffect, useState, useContext } from "react";
import api from "../../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export default function ParentsList(){
  const [parents, setParents] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const load = async () => {
    try{
      const r = await api.get('/users');
      setParents(r.data.filter(u => u.role === 'parent'));
    }catch(err){ console.error(err); }
  }

  useEffect(()=>{
    load();
  },[]);

  const onDelete = async (id) => {
    if (!confirm('Delete this parent? This will remove their account.')) return;
    try{
      await api.delete(`/users/${id}`);
      setParents(ps => ps.filter(p => p._id !== id));
      alert('Parent removed');
    }catch(err){
      console.error('Delete failed', err);
      alert(err?.response?.data?.message || 'Failed to delete');
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Parents</h1>
        <Link to="/admin/parents/create" className="bg-blue-600 text-white px-3 py-1 rounded">Create Parent</Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Name</th>
            <th>Email</th>
            <th>Student</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parents.map(p=> (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">{p.student?.name || '-'}</td>
              <td className="p-2">
                <button onClick={() => navigate(`/admin/parents/${p._id}`)} className="bg-gray-200 px-3 py-1 rounded mr-2">View</button>
                {user?.role === 'admin' && (
                  <>
                    <button onClick={() => navigate(`/admin/parents/edit/${p._id}`)} className="bg-blue-600 text-white px-3 py-1 rounded mr-2">Edit</button>
                    <button onClick={() => onDelete(p._id)} className="bg-red-600 text-white px-3 py-1 rounded mr-2">Delete</button>
                    <button
                      onClick={async () => {
                        if (!confirm('Send credentials (this will reset the password) to this parent?')) return;
                        try {
                          const res = await api.post(`/users/${p._id}/send-credentials`);
                          alert(`${res.data.message || 'Sent'}\n${res.data.loginDetails?.password ? 'New Password: ' + res.data.loginDetails.password : ''}`);
                        } catch (err) {
                          console.error(err);
                          alert(err?.response?.data?.message || 'Failed to send credentials');
                        }
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >Send Credentials</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
