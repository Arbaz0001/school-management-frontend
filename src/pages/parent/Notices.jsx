import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Notices(){
  const [notices, setNotices] = useState([]);

  useEffect(()=>{
    const load = async()=>{
      const res = await api.get('/notices');
      setNotices(res.data || []);
    }
    load();
  },[]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Notices</h1>
      {notices.map(n=> (
        <div key={n._id} className="border-t py-3">
          <div className="font-semibold">{n.title}</div>
          <div className="text-sm text-gray-500">{n.description}</div>
        </div>
      ))}
    </div>
  )
}