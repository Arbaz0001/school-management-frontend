import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import api from "../services/api";
import usePermissions from "../hooks/usePermissions";

const columns = [
  { key: "name", label: "Name" },
  { key: "subject", label: "Subject" },
  { key: "designation", label: "Designation" },
  { key: "status", label: "Status" },
];

const fields = [
  { name: "name", label: "Teacher Name" },
  { name: "email", label: "Email", type: "email" },
  { name: "password", label: "Password", type: "password", required: false },
  { name: "subject", label: "Subject" },
  { name: "designation", label: "Designation" },
  { name: "className", label: "Class" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  subject: "",
  designation: "",
  className: "",
  status: "Active",
};

function toViewRow(item) {
  const isActive = item.user?.isActive !== false;
  return {
    id: item._id,
    name: item.fullName || "-",
    subject: item.subjects?.join(", ") || "-",
    designation: item.qualification || "Teacher",
    status: isActive ? "Active" : "Inactive",
    createdAt: item.createdAt || null,
    _raw: item,
  };
}

export default function Teachers() {
  const { can } = usePermissions();
  const canCreate = can("teachers", "create");
  const canEdit = can("teachers", "edit");
  const canDelete = can("teachers", "delete");
  const canExport = can("teachers", "export");
  const canPrint = can("teachers", "print");

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
      const [teachersRes, sessionRes] = await Promise.all([
        api.get("/teachers", { params: { limit: 200 } }),
        api.get("/sessions/active"),
      ]);

      const teachers = teachersRes.data?.data || [];
      setRows(teachers.map(toViewRow));
      setActiveSessionName(sessionRes.data?.name || "");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch teachers");
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
    const raw = row._raw || {};
    setFormValues({
      name: raw.fullName || "",
      email: raw.email || raw.username || "",
      password: "",
      subject: raw.subjects?.[0] || "",
      designation: raw.qualification || "",
      className: raw.classes?.[0] || "",
      status: raw.user?.isActive === false ? "Inactive" : "Active",
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
      await api.delete(`/teachers/${id}`);
      setRows((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Teacher deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete teacher");
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
        await api.put(`/teachers/${editingId}`, {
          fullName: formValues.name,
          email: formValues.email,
          username: formValues.email,
          subjects: formValues.subject,
          qualification: formValues.designation,
          classes: formValues.className,
          isActive: formValues.status === "Active",
        });
        setSuccess("Teacher updated successfully");
      } else {
        await api.post("/teachers/create", {
          session: activeSessionName,
          fullName: formValues.name,
          email: formValues.email,
          username: formValues.email,
          password: formValues.password || "teacher123",
          subjects: formValues.subject,
          qualification: formValues.designation,
          classes: formValues.className,
          joiningDate: new Date().toISOString(),
          salary: 0,
        });
        setSuccess("Teacher created successfully");
      }

      setOpenModal(false);
      setEditingId(null);
      setFormValues(emptyForm);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Teachers</h1>
            <p className="mt-1 text-sm text-slate-500">Manage teachers with backend-connected CRUD operations.</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add Teacher
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
        searchPlaceholder="Search teacher by name, subject, designation..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        reportTitle="Teachers Report"
        summaryCards={summary}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
        canPrint={canPrint}
      />

      {canCreate && (
        <FormModal
          isOpen={openModal}
          title={editingId ? "Edit Teacher" : "Add Teacher"}
          fields={fields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          submitLabel={editingId ? "Update Teacher" : "Create Teacher"}
        />
      )}
    </div>
  );
}
