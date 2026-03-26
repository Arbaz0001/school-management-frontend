import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import api from "../services/api";
import usePermissions from "../hooks/usePermissions";

const columns = [
  { key: "name", label: "Parent Name" },
  { key: "student", label: "Student" },
  { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
];

const emptyForm = {
  name: "",
  email: "",
  password: "",
  studentId: "",
  status: "Active",
};

function toViewRow(user) {
  return {
    id: user._id,
    name: user.name || "-",
    student: user.student?.name || "-",
    phone: "-",
    status: user.isActive ? "Active" : "Inactive",
    createdAt: user.createdAt || null,
    _raw: user,
  };
}

export default function Parents() {
  const { can } = usePermissions();
  const canCreate = can("parents", "create");
  const canEdit = can("parents", "edit");
  const canDelete = can("parents", "delete");
  const canExport = can("parents", "export");
  const canPrint = can("parents", "print");

  const [rows, setRows] = useState([]);
  const [studentOptions, setStudentOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fields = useMemo(
    () => [
      { name: "name", label: "Parent Name" },
      { name: "email", label: "Email", type: "email" },
      { name: "password", label: "Password", type: "password", required: false },
      {
        name: "studentId",
        label: "Linked Student",
        type: "select",
        options: studentOptions.map((s) => ({ value: s.id, label: s.name })),
      },
      { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
    ],
    [studentOptions],
  );

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
      const usersRes = await api.get("/users");
      const users = usersRes.data || [];

      const parents = users.filter((user) => user.role === "parent");
      const students = users.filter((user) => user.role === "student");

      setRows(parents.map(toViewRow));
      const options = students.map((student) => ({ id: student._id, name: student.name }));
      setStudentOptions(options);

      setFormValues((prev) => ({
        ...prev,
        studentId: prev.studentId || options[0]?.id || "",
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch parents");
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
    setFormValues({
      ...emptyForm,
      studentId: studentOptions[0]?.id || "",
    });
    setOpenModal(true);
    setError("");
    setSuccess("");
  };

  const handleEdit = (row) => {
    if (!canEdit) return;
    const raw = row._raw || {};
    setEditingId(row.id);
    setFormValues({
      name: raw.name || "",
      email: raw.email || "",
      password: "",
      studentId: raw.student?._id || studentOptions[0]?.id || "",
      status: raw.isActive ? "Active" : "Inactive",
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
      await api.delete(`/users/${id}`);
      setRows((prev) => prev.filter((item) => item.id !== id));
      setSuccess("Parent deleted successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete parent");
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
        await api.put(`/users/${editingId}`, {
          name: formValues.name,
          email: formValues.email,
          studentId: formValues.studentId,
          isActive: formValues.status === "Active",
        });
        setSuccess("Parent updated successfully");
      } else {
        await api.post("/users/create", {
          name: formValues.name,
          email: formValues.email,
          role: "parent",
          studentId: formValues.studentId,
          password: formValues.password || "parent123",
        });
        setSuccess("Parent created successfully");
      }

      setOpenModal(false);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save parent");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Parents</h1>
            <p className="mt-1 text-sm text-slate-500">Manage parents with backend-connected CRUD operations.</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            Add Parent
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
        searchPlaceholder="Search parent by name, student, status..."
        onEdit={handleEdit}
        onDelete={handleDelete}
        reportTitle="Parents Report"
        summaryCards={summary}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
        canPrint={canPrint}
      />

      {canCreate && (
        <FormModal
          isOpen={openModal}
          title={editingId ? "Edit Parent" : "Add Parent"}
          fields={fields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          submitLabel={editingId ? "Update Parent" : "Create Parent"}
        />
      )}
    </div>
  );
}
