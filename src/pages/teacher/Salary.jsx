import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Salary() {
  const [payments, setPayments] = useState([]);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/teachers/me/salary', { headers: { Authorization: `Bearer ${token}` } });
        setTeacher(res.data.teacher);
        setPayments(res.data.payments);
      } catch (err) {
        console.error('LOAD SALARY ERR:', err.response?.data || err.message);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Salary</h1>

      {teacher && (
        <div className="bg-white p-4 rounded border mb-4">
          <p className="text-sm text-gray-600">Name: {teacher.fullName}</p>
          <p className="text-sm text-gray-600">Base Salary: {teacher.salary || 0}</p>
        </div>
      )}

      <div className="space-y-3">
        {payments.map(p => (
          <div key={p._id} className="bg-white p-4 rounded border flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.month}</div>
              <div className="text-sm text-gray-600">Net: {p.netSalary}</div>
            </div>
            <div className="text-sm text-gray-500">Paid on: {new Date(p.paidAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {payments.length === 0 && <p className="text-gray-500">No payments found</p>}
    </div>
  );
}

