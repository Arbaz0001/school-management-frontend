import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Fees(){
  const { refreshUser } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(()=>{
    const load = async()=>{
      const me = await refreshUser(api);
      if(!me?.student?._id) return;
      const res = await api.get(`/fees/student/${me.student._id}`);
      setFees(res.data.fees || []);
      setSummary(res.data);
    }
    load();
  },[refreshUser]);

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Fees</h1>
      <div className="mb-4">Total Paid: <strong>{summary?.totalPaid || 0}</strong></div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {fees.map(f=> (
            <tr key={f._id} className="border-t">
              <td className="p-2">{f.type}</td>
              <td className="p-2">{f.amount}</td>
              <td className="p-2">{new Date(f.paidOn).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {!fees.length && <p className="text-gray-500">No fees found.</p>}
    </div>
  )
}