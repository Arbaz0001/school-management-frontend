import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Results(){
  const { refreshUser } = useContext(AuthContext);
  const [results, setResults] = useState([]);

  useEffect(()=>{
    const load = async()=>{
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      // results endpoint not implemented; fallback to notices for demo
      try{
        const res = await api.get('/notices');
        setResults((res.data || []).slice(0,5));
      }catch(err){console.error(err)}
    }
    load();
  },[refreshUser]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Results (demo)</h1>
      {results.map(r=> (
        <div key={r._id} className="border-t py-3">
          <div className="font-semibold">{r.title}</div>
          <div className="text-sm text-gray-500">{r.type}</div>
        </div>
      ))}
    </div>
  )
}