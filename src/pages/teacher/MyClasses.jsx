export default function MyClasses() {
  const classes = [
    { class: "8th", subject: "Maths", students: 45 },
    { class: "9th", subject: "Maths", students: 60 },
    { class: "10th", subject: "Maths", students: 55 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Classes</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((c, i) => (
          <div key={i} className="bg-white p-5 rounded border">
            <p className="font-semibold">Class: {c.class}</p>
            <p className="text-sm text-gray-600">Subject: {c.subject}</p>
            <p className="text-sm text-gray-600">
              Students: {c.students}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
