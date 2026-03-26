import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function Fees(){
  const { refreshUser } = useContext(AuthContext);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(()=>{
    const load = async()=>{
      setLoading(true);
      try {
        const me = await refreshUser(api);
        if(!me?.student?._id) return setFees([]);
        const res = await api.get(`/fees/student/${me.student._id}`);
        // API may return { fees: [...], totalAmount, totalPaid }
        const data = res.data || {};
        setFees(Array.isArray(data.fees) ? data.fees : (data || []));
      } catch (err) {
        console.error("Error loading fees:", err);
        setFees([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  },[refreshUser]);

  const filteredFees = fees.filter(f => (f.type || '').toLowerCase().includes(searchTerm.toLowerCase()));

  const totalAmount = fees.reduce((s, f) => s + (Number(f.amount) || 0), 0);
  const totalPaid = fees.reduce((s, f) => s + (f.paidOn ? (Number(f.amount) || 0) : 0), 0);
  const pendingAmount = totalAmount - totalPaid;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
          <DollarSign size={32} className="text-green-600" />
          Fees
        </h1>
        <div className="text-sm text-gray-600">
          Total Transactions: <strong>{fees.length}</strong>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Amount</p>
            <p className="font-semibold text-lg">${totalAmount.toFixed(2)}</p>
          </div>
          <TrendingUp size={28} className="text-gray-300" />
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Paid</p>
            <p className="font-semibold text-lg">${totalPaid.toFixed(2)}</p>
          </div>
          <div className="text-green-500">✓</div>
        </div>
        <div className="bg-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Pending</p>
            <p className="font-semibold text-lg">${pendingAmount.toFixed(2)}</p>
          </div>
          <Calendar size={28} className="text-red-300" />
        </div>
      </div>

      {/* Fees Table Card */}
      <div className="bg-white p-4 md:p-6 rounded shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <h2 className="font-semibold text-base md:text-lg">Fee Transactions</h2>
          <input 
            type="text" 
            placeholder="Search by type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded text-sm w-full md:w-64" 
          />
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading fees...</p>
          </div>
        )}

        {!loading && filteredFees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">{searchTerm ? 'No fees found matching your search' : 'No fees available'}</p>
          </div>
        )}

        {!loading && filteredFees.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-3">Fee Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Paid Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFees.map((f, i) => (
                    <tr key={f._id || i} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{f.type}</td>
                      <td className="p-3">${Number(f.amount || 0).toFixed(2)}</td>
                      <td className="p-3">{f.paidOn ? new Date(f.paidOn).toLocaleDateString() : 'Pending'}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded text-white text-xs font-medium ${f.paidOn ? 'bg-green-500' : 'bg-orange-500'}`}>
                          {f.paidOn ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs md:text-sm text-gray-600">
              Showing {filteredFees.length} of {fees.length} fees
            </div>
          </>
        )}
      </div>
    </div>
  )
}