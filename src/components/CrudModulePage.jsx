import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "./DataTable";
import FormModal from "./FormModal";
import usePermissions from "../hooks/usePermissions";

function buildEmptyForm(fields) {
  return fields.reduce((acc, field) => {
    if (field.type === "select") {
      acc[field.name] = field.options?.[0] || "Active";
      return acc;
    }
    acc[field.name] = "";
    return acc;
  }, {});
}

export default function CrudModulePage({ config }) {
  const { can } = usePermissions();
  const resource = config.permissionKey || String(config.title || "").toLowerCase();
  const canCreate = can(resource, "create");
  const canEdit = can(resource, "edit");
  const canDelete = can(resource, "delete");
  const canExport = can(resource, "export");
  const canPrint = can(resource, "print");

  const [rows, setRows] = useState(config.initialRows);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState(() => buildEmptyForm(config.fields));

  const modalTitle = editingId ? `Edit ${config.singular}` : `Add ${config.singular}`;

  const summary = useMemo(
    () => [
      { label: "Total", value: rows.length },
      { label: "Active", value: rows.filter((item) => item.status === "Active").length },
      { label: "Inactive", value: rows.filter((item) => item.status !== "Active").length },
    ],
    [rows],
  );

  const handleAdd = () => {
    if (!canCreate) return;
    setEditingId(null);
    setFormValues(buildEmptyForm(config.fields));
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    if (!canEdit) return;
    setEditingId(row.id);
    setFormValues(row);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    if (!canDelete) return;
    setRows((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = () => {
    if (editingId) {
      setRows((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...formValues } : item)));
    } else {
      setRows((prev) => [{ id: Date.now(), ...formValues }, ...prev]);
    }
    setOpenModal(false);
    setEditingId(null);
    setFormValues(buildEmptyForm(config.fields));
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{config.title}</h1>
            <p className="mt-1 text-sm text-slate-500">Manage {config.title.toLowerCase()} records with full CRUD operations.</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={16} />
            {config.addLabel}
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
      </section>

      <DataTable
        columns={config.columns}
        rows={rows}
        searchPlaceholder={config.searchPlaceholder}
        onEdit={handleEdit}
        onDelete={handleDelete}
        reportTitle={`${config.title} Report`}
        summaryCards={summary}
        canEdit={canEdit}
        canDelete={canDelete}
        canExport={canExport}
        canPrint={canPrint}
      />

      {canCreate && (
        <FormModal
          isOpen={openModal}
          title={modalTitle}
          fields={config.fields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={handleSubmit}
          submitLabel={editingId ? `Update ${config.singular}` : `Create ${config.singular}`}
        />
      )}
    </div>
  );
}