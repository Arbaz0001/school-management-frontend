import { useMemo, useState } from "react";
import { ArrowDownUp, Pencil, Search, Trash2 } from "lucide-react";
import ModuleReportActions from "./ModuleReportActions";

const PAGE_SIZE = 8;

export default function DataTable({
  columns,
  rows,
  searchPlaceholder,
  onEdit,
  onDelete,
  reportTitle = "Module Report",
  summaryCards = [],
  canEdit = true,
  canDelete = true,
  canExport = true,
  canPrint = true,
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(columns[0]?.key || "name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const searched = rows.filter((row) => {
      if (!normalized) return true;
      return columns.some((col) => {
        const value = row[col.key];
        return String(value ?? "").toLowerCase().includes(normalized);
      });
    });

    return [...searched].sort((a, b) => {
      const left = String(a[sortKey] ?? "").toLowerCase();
      const right = String(b[sortKey] ?? "").toLowerCase();
      const result = left.localeCompare(right, undefined, { numeric: true });
      return sortOrder === "asc" ? result : -result;
    });
  }, [rows, columns, query, sortKey, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleRows = filteredRows.slice(start, start + PAGE_SIZE);

  const handleSort = (key) => {
    setPage(1);
    if (key === sortKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortOrder("asc");
  };

  const showActions = canEdit || canDelete;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Records</h2>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <ModuleReportActions
            title={reportTitle}
            columns={columns}
            rows={filteredRows}
            summaryCards={summaryCards}
            canExport={canExport}
            canPrint={canPrint}
          />
          <div className="relative w-full md:w-80">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none ring-blue-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((column) => (
                <th key={column.key} className="px-3 py-2 text-left">
                  <button
                    type="button"
                    onClick={() => handleSort(column.key)}
                    className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                  >
                    {column.label}
                    <ArrowDownUp size={12} />
                  </button>
                </th>
              ))}
              {showActions && (
                <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                {columns.map((column) => {
                  if (column.key === "status") {
                    const statusClass =
                      row.status === "Active"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";

                    return (
                      <td key={column.key} className="px-3 py-3">
                        <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + statusClass}>
                          {row.status}
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={column.key} className="px-3 py-3 text-slate-700 dark:text-slate-200">
                      {row[column.key]}
                    </td>
                  );
                })}
                {showActions && (
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit?.(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete?.(row.id)}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20"
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

      <div className="mt-4 flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Showing {visibleRows.length} of {filteredRows.length} entries
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Previous
          </button>
          <span className="text-slate-600 dark:text-slate-300">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            disabled={currentPage === pageCount}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}