import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Timetable(){
  const { refreshUser } = useContext(AuthContext);
  const [tt, setTt] = useState([]);

  useEffect(()=>{
    const load = async()=>{
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      // no dedicated timetable endpoint — demo static
      setTt([
        {day: 'Mon', subject: 'Maths'},
        {day: 'Tue', subject: 'Science'},
      ]);
    }
    load();
  },[refreshUser]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Timetable (demo)</h1>
      <ul>
        {tt.map((t,i)=> <li key={i} className="py-2 border-t">{t.day}: {t.subject}</li>)}
      </ul>
    </div>
  )
}