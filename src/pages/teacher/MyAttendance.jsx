export default function MyAttendance() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h1 className="text-2xl font-semibold mb-4">My Attendance</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Present Days</p>
          <p className="text-xl font-bold">22</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Absent Days</p>
          <p className="text-xl font-bold">2</p>
        </div>
        <div className="p-4 border rounded">
          <p className="text-sm text-gray-500">Attendance %</p>
          <p className="text-xl font-bold">91%</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Detailed attendance table yahan aayegi
      </p>
    </div>
  );
}
