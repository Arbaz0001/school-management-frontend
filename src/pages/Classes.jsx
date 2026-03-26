import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import api from "../services/api";
import FormModal from "../components/FormModal";
import { useToast } from "../context/ToastContext";
import useTableQueryState from "../hooks/useTableQueryState";
import ConfirmDialog from "../components/ConfirmDialog";
import ModuleReportActions from "../components/ModuleReportActions";
import usePermissions from "../hooks/usePermissions";

const PAGE_SIZE = 10;

const fields = [
  { name: "name", label: "Class Name" },
  { name: "section", label: "Section" },
  { name: "classTeacher", label: "Class Teacher" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

const emptyForm = {
  name: "",
  section: "",
  classTeacher: "",
  capacity: "",
  status: "Active",
};

export default function Classes() {
  const { can } = usePermissions();
  const canCreate = can("classes", "create");
  const canEdit = can("classes", "edit");
  const canDelete = can("classes", "delete");
  const canExport = can("classes", "export");
  const canPrint = can("classes", "print");

  const { pushToast } = useToast();
  const { search, setSearch, debouncedSearch, page, setPage } = useTableQueryState();

  const [rows, setRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/classes", {
        params: {
          q: debouncedSearch,
          page,
          limit: PAGE_SIZE,
        },
      });

      setRows(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to load classes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [page, debouncedSearch]);

  const summary = useMemo(
    () => ({
      total,
      active: rows.filter((row) => row.status === "Active").length,
      inactive: rows.filter((row) => row.status !== "Active").length,
    }),
    [rows, total],
  );

  const onAdd = () => {
    if (!canCreate) return;
    setEditingId(null);
    setFormValues(emptyForm);
    setOpenModal(true);
  };

  const onEdit = (row) => {
    if (!canEdit) return;
    setEditingId(row._id);
    setFormValues({
      name: row.name || "",
      section: row.section || "",
      classTeacher: row.classTeacher || "",
      capacity: row.capacity ?? "",
      status: row.status || "Active",
    });
    setOpenModal(true);
  };

  const onDelete = async (id) => {
    if (!canDelete) return;
    const previous = rows;
    setRows((prev) => prev.filter((row) => row._id !== id));
    try {
      await api.delete(`/classes/${id}`);
      pushToast("Class deleted", "success");
      loadClasses();
    } catch (err) {
      setRows(previous);
      pushToast(err.response?.data?.message || "Failed to delete class", "error");
    }
  };

  const onDeleteRequested = (id) => {
    if (!canDelete) return;
    setPendingDeleteId(id);
  };

  const onConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    await onDelete(pendingDeleteId);
    setPendingDeleteId(null);
  };

  const onSubmit = async () => {
    const payload = {
      name: formValues.name,
      section: formValues.section,
      classTeacher: formValues.classTeacher,
      capacity: Number(formValues.capacity || 0),
      status: formValues.status,
    };

    const optimisticId = `temp-${Date.now()}`;

    try {
      if (editingId) {
        const previous = rows;
        setRows((prev) => prev.map((row) => (row._id === editingId ? { ...row, ...payload } : row)));
        setOpenModal(false);

        await api.put(`/classes/${editingId}`, payload);
        pushToast("Class updated", "success");
        loadClasses();
      } else {
        setRows((prev) => [{ _id: optimisticId, ...payload }, ...prev]);
        setOpenModal(false);

        await api.post("/classes", payload);
        pushToast("Class created", "success");
        loadClasses();
      }

      setEditingId(null);
      setFormValues(emptyForm);
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to save class", "error");
      loadClasses();
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classes</h1>
            <p className="mt-1 text-sm text-slate-500">Manage classes with live CRUD operations.</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search class"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="button"
              onClick={onAdd}
              disabled={!canCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              Add Class
            </button>
          </div>
        </div>

        <div className="mt-4">
          <ModuleReportActions
            title="Classes Report"
            columns={[
              { key: "name", label: "Class" },
              { key: "section", label: "Section" },
              { key: "classTeacher", label: "Class Teacher" },
              { key: "capacity", label: "Capacity" },
              { key: "status", label: "Status" },
            ]}
            rows={rows}
            summaryCards={[
              { label: "Total", value: summary.total },
              { label: "Active", value: summary.active },
              { label: "Inactive", value: summary.inactive },
            ]}
            canExport={canExport}
            canPrint={canPrint}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Total" value={String(summary.total)} />
          <SummaryCard label="Active" value={String(summary.active)} />
          <SummaryCard label="Inactive" value={String(summary.inactive)} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <p className="text-sm text-slate-500">Loading classes...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-left">Class</th>
                  <th className="px-3 py-2 text-left">Section</th>
                  <th className="px-3 py-2 text-left">Class Teacher</th>
                  <th className="px-3 py-2 text-left">Capacity</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  {(canEdit || canDelete) && <th className="px-3 py-2 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.name || "-"}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.section || "-"}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.classTeacher || "-"}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.capacity ?? "-"}</td>
                    <td className="px-3 py-2">
                      <span className={row.status === "Active" ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700" : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"}>
                        {row.status || "Inactive"}
                      </span>
                    </td>
                    {(canEdit || canDelete) && (
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onEdit(row)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                            >
                              <Pencil size={12} />
                              Edit
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => onDeleteRequested(row._id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pager page={page} totalPages={totalPages} onPage={setPage} />
      </section>

      {canCreate && (
        <FormModal
          isOpen={openModal}
          title={editingId ? "Edit Class" : "Add Class"}
          fields={fields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={onSubmit}
          submitLabel={editingId ? "Update Class" : "Create Class"}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete Class"
        message="This action cannot be undone. Are you sure you want to delete this class?"
        onConfirm={onConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        confirmLabel="Delete Class"
      />
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function Pager({ page, totalPages, onPage }) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-600 dark:text-slate-300">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPage(Math.max(1, page - 1))}
        className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
      >
        Previous
      </button>
      <span>
        Page {page} of {Math.max(1, totalPages)}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
      >
        Next
      </button>
    </div>
  );
}
