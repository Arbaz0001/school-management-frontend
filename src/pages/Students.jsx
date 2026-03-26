import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import api from "../services/api";
import usePermissions from "../hooks/usePermissions";

const columns = [
  { key: "name", label: "Name" },
  { key: "className", label: "Class" },
  { key: "section", label: "Section" },
  { key: "status", label: "Status" },
];

const fields = [
  { name: "name", label: "Student Name" },
  { name: "email", label: "Login Email", type: "email" },
  { name: "password", label: "Password", type: "password", required: false },
  { name: "className", label: "Class" },
  { name: "section", label: "Section" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  className: "",
  section: "",
  status: "Active",
};

function toViewRow(student) {
  const name = [student.firstName, student.lastName].filter(Boolean).join(" ").trim();
  return {
    id: student._id,
    name: name || "Unnamed",
    className: student.className || "-",
    section: student.section || "-",
    status: "Active",
    createdAt: student.createdAt || null,
    _raw: student,
  };
}

function toFormData(formValues, activeSessionName) {
  const [firstName, ...rest] = String(formValues.name || "").trim().split(" ");
  const lastName = rest.join(" ") || "Student";

  const data = new FormData();
  data.append("session", activeSessionName || "");
  data.append("admissionDate", new Date().toISOString());
  data.append("firstName", firstName || "Student");
  data.append("lastName", lastName);
  data.append("className", formValues.className || "Class 1");
  data.append("section", formValues.section || "A");
  data.append("roll", String(Math.floor(Math.random() * 90) + 10));
  data.append("gender", "Not Specified");
  data.append("studentLoginId", formValues.email || `student${Date.now()}@school.local`);
  data.append("studentPassword", formValues.password || "student123");
  data.append("fatherName", "N/A");
  data.append("fatherMobile", "N/A");
  data.append("motherName", "N/A");
  data.append("guardianName", "N/A");
  data.append("guardianRelation", "Guardian");
  data.append("guardianMobile", "N/A");
  return data;
}

export default function Students() {
  const { can } = usePermissions();
  const canCreate = can("students", "create");
  const canEdit = can("students", "edit");
  const canDelete = can("students", "delete");
  const canExport = can("students", "export");
  const canPrint = can("students", "print");

  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [activeSessionName, setActiveSessionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const summary = useMemo(
    () => [
      { label: "Total", value: rows.length },
      { label: "Active", value: rows.filter((item) => item.status === "Active").length },
      { label: "Inactive", value: rows.filter((item) => item.status !== "Active").length },
    ],
    [rows],
  );

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, sessionRes] = await Promise.all([
        api.get("/students", { params: { limit: 200 } }),
        api.get("/sessions/active"),
      ]);

      const students = studentsRes.data?.students || [];
      setRows(students.map(toViewRow));
      setActiveSessionName(sessionRes.data?.name || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    if (!canCreate) return;
    setEditingId(null);
    setFormValues(emptyForm);
    setOpenModal(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (row) => {
    if (!canEdit) return;
    setEditingId(row.id);
    setFormValues({
      name: row.name,
      email: row._raw?.studentLoginId || "",
      password: "",
      className: row.className,
      section: row.section,
      status: row.status,
    });
    setOpenModal(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id) => {
    if (!canDelete) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.delete(`/students/${id}`);
      setRows((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Student deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        const [firstName, ...rest] = String(formValues.name || "").trim().split(" ");
        await api.put(`/students/${editingId}`, {
          firstName: firstName || "Student",
          lastName: rest.join(" ") || "Updated",
          className: formValues.className,
          section: formValues.section,
        });
        setSuccess("Student updated successfully");
      } else {
        const payload = toFormData(formValues, activeSessionName);
        await api.post("/students", payload);
        setSuccess("Student created successfully");
      }

      setOpenModal(false);
      setEditingId(null);
      setFormValues(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
            <p className="mt-1 text-sm text-slate-500">Manage students with backend-connected CRUD operations.</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add Student
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {summary.map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{card.value}</p>
            </div>
          ))}
        </div>

        {loading && <p className="mt-3 text-sm text-slate-500">Loading...</p>}
        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}
        {success && <p className="mt-3 text-sm text-emerald-600">{success}</p>}
      </section>

      <DataTable
        columns={columns}
        rows={rows}
        searchPlaceholder="Search student by name, class, section..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        reportTitle="Students Report"
        summaryCards={summary}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
        canPrint={canPrint}
      />

      {canCreate && (
        <FormModal
          isOpen={openModal}
          title={editingId ? "Edit Student" : "Add Student"}
          fields={fields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          submitLabel={editingId ? "Update Student" : "Create Student"}
        />
      )}
    </div>
  );
}
