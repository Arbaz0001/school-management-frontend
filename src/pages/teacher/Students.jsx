export default function Students() {
  const students = [
    { roll: 1, name: "Aman Verma", status: "Active" },
    { roll: 2, name: "Neha Singh", status: "Active" },
    { roll: 3, name: "Rohit Sharma", status: "Inactive" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Students</h1>

      <div className="bg-white border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Roll</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{s.roll}</td>
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
