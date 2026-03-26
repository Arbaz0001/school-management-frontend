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
  { name: "name", label: "Subject Name" },
  { name: "code", label: "Subject Code" },
  { name: "className", label: "Class" },
  { name: "teacher", label: "Teacher" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

const emptyForm = {
  name: "",
  code: "",
  className: "",
  teacher: "",
  status: "Active",
};

export default function Subjects() {
  const { can } = usePermissions();
  const canCreate = can("subjects", "create");
  const canEdit = can("subjects", "edit");
  const canDelete = can("subjects", "delete");
  const canExport = can("subjects", "export");
  const canPrint = can("subjects", "print");

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

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subjects", {
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
      pushToast(err.response?.data?.message || "Failed to load subjects", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
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
      code: row.code || "",
      className: row.className || "",
      teacher: row.teacher || "",
      status: row.status || "Active",
    });
    setOpenModal(true);
  };

  const onDelete = async (id) => {
    if (!canDelete) return;
    const previous = rows;
    setRows((prev) => prev.filter((row) => row._id !== id));
    try {
      await api.delete(`/subjects/${id}`);
      pushToast("Subject deleted", "success");
      loadSubjects();
    } catch (err) {
      setRows(previous);
      pushToast(err.response?.data?.message || "Failed to delete subject", "error");
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
      code: formValues.code,
      className: formValues.className,
      teacher: formValues.teacher,
      status: formValues.status,
    };

    const optimisticId = `temp-${Date.now()}`;

    try {
      if (editingId) {
        setRows((prev) => prev.map((row) => (row._id === editingId ? { ...row, ...payload } : row)));
        setOpenModal(false);

        await api.put(`/subjects/${editingId}`, payload);
        pushToast("Subject updated", "success");
        loadSubjects();
      } else {
        setRows((prev) => [{ _id: optimisticId, ...payload }, ...prev]);
        setOpenModal(false);

        await api.post("/subjects", payload);
        pushToast("Subject created", "success");
        loadSubjects();
      }

      setEditingId(null);
      setFormValues(emptyForm);
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to save subject", "error");
      loadSubjects();
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subjects</h1>
            <p className="mt-1 text-sm text-slate-500">Manage subjects with live CRUD operations.</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search subject"
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
              Add Subject
            </button>
          </div>
        </div>

        <div className="mt-4">
          <ModuleReportActions
            title="Subjects Report"
            columns={[
              { key: "name", label: "Subject" },
              { key: "code", label: "Code" },
              { key: "className", label: "Class" },
              { key: "teacher", label: "Teacher" },
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
          <p className="text-sm text-slate-500">Loading subjects...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-left">Subject</th>
                  <th className="px-3 py-2 text-left">Code</th>
                  <th className="px-3 py-2 text-left">Class</th>
                  <th className="px-3 py-2 text-left">Teacher</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  {(canEdit || canDelete) && <th className="px-3 py-2 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row._id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.name || "-"}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.code || "-"}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.className || "-"}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.teacher || "-"}</td>
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
          title={editingId ? "Edit Subject" : "Add Subject"}
          fields={fields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={onSubmit}
          submitLabel={editingId ? "Update Subject" : "Create Subject"}
        />
      )}

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete Subject"
        message="This action cannot be undone. Are you sure you want to delete this subject?"
        onConfirm={onConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        confirmLabel="Delete Subject"
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
