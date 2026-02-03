import { useState } from "react";
import api from "../../../services/api";

export default function TeacherSalary() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const [allowances, setAllowances] = useState(0);
  const [overtime, setOvertime] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [note, setNote] = useState("");

  const search = async (e) => {
    e && e.preventDefault();
    if (!q) return;
    setLoading(true);
    try {
      const res = await api.get(`/teachers?q=${encodeURIComponent(q)}&limit=10`);
      setResults(res.data.data || []);
    } catch (err) {
      console.error('Search failed', err);
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const select = async (t) => {
    setSelected(t);
    setPayments([]);
    try {
      const res = await api.get(`/teachers/${t._id}/salary`);
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error('Failed load payments', err);
      alert('Failed to load payments');
    }
  };

  const pay = async () => {
    if (!selected) return alert('Select a teacher first');
    // basic validation
    if (!month) return alert('Select month');
    if (isNaN(Number(allowances)) || isNaN(Number(overtime)) || isNaN(Number(deductions))) return alert('Allowances/Overtime/Deductions must be numbers');

    try {
      const payload = { month, allowances: Number(allowances), overtime: Number(overtime), deductions: Number(deductions), note };
      const res = await api.post(`/teachers/${selected._id}/salary`, payload);
      alert(res.data.message || 'Paid');
      // reload payments
      const r = await api.get(`/teachers/${selected._id}/salary`);
      setPayments(r.data.payments || []);
    } catch (err) {
      console.error('Payment failed', err);
      alert(err?.response?.data?.message || 'Payment failed');
    }
  };

  const isPaidForMonth = (m) => payments.some(p => p.month === m);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border">
        <h1 className="text-2xl font-semibold mb-4">Teacher Salary Payments</h1>

        <form onSubmit={search} className="flex gap-2 items-center">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search teacher by name/username/email" className="border p-2 rounded w-72" />
          <button className="px-3 py-2 bg-gray-200 rounded">Search</button>
        </form>

        {loading && <div className="mt-4">Searching...</div>}

        <div className="mt-4">
          {results.map(r => (
            <div key={r._id} className="p-2 border rounded mb-2 flex justify-between items-center">
              <div>
                <div className="font-semibold">{r.fullName || r.user?.name}</div>
                <div className="text-sm text-gray-500">{r.email || r.user?.email} • {r.username}</div>
              </div>
              <div>
                <button onClick={() => select(r)} className="px-3 py-1 bg-blue-600 text-white rounded">Select</button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {selected && (
        <div className="bg-white p-6 rounded border">
          <h2 className="text-xl font-semibold">{selected.fullName || selected.user?.name}</h2>
          <div className="mt-2 text-sm text-gray-600">Username: {selected.username} • Email: {selected.email || selected.user?.email}</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm">Month</label>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded" />
              <div className="text-sm mt-1">Status: {isPaidForMonth(month) ? <span className="text-green-600">Paid</span> : <span className="text-red-600">Unpaid</span>}</div>
            </div>

            <div>
              <label className="block text-sm">Base Salary</label>
              <div className="border p-2 rounded">₹{selected.salary || 0}</div>
            </div>

            <div>
              <label className="block text-sm">Allowances</label>
              <input value={allowances} onChange={(e) => setAllowances(e.target.value)} className="border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm">Overtime (amount)</label>
              <input value={overtime} onChange={(e) => setOvertime(e.target.value)} className="border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm">Deductions</label>
              <input value={deductions} onChange={(e) => setDeductions(e.target.value)} className="border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm">Note</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} className="border p-2 rounded" />
            </div>

            <div className="md:col-span-3 mt-2">
              <div className="font-semibold">Net Salary: ₹{(Number(selected.salary||0) + Number(allowances||0) + Number(overtime||0) - Number(deductions||0)).toFixed(2)}</div>
              <div className="mt-2">
                <button onClick={pay} className="px-4 py-2 bg-green-600 text-white rounded">Pay Salary</button>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <h3 className="font-semibold">Payment History</h3>
          {payments.length === 0 ? (
            <div className="text-sm text-gray-500 mt-2">No payments found.</div>
          ) : (
            <table className="w-full text-sm mt-2">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Month</th>
                  <th className="p-2 text-left">Gross</th>
                  <th className="p-2 text-left">Allowances</th>
                  <th className="p-2 text-left">Overtime</th>
                  <th className="p-2 text-left">Deductions</th>
                  <th className="p-2 text-left">Net</th>
                  <th className="p-2 text-left">Paid At</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p._id} className="border-t">
                    <td className="p-2">{p.month}</td>
                    <td className="p-2">₹{p.baseSalary}</td>
                    <td className="p-2">₹{p.allowances}</td>
                    <td className="p-2">₹{p.overtime}</td>
                    <td className="p-2">₹{p.deductions}</td>
                    <td className="p-2">₹{p.netSalary}</td>
                    <td className="p-2">{new Date(p.paidAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
