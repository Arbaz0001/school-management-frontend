import { useMemo, useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";

const PAGE_SIZE = 6;

export default function StudentsTable({ students }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = students.filter((s) => {
      if (!q) return true;
      return [s.name, s.className, s.section, s.parent, s.status]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    return list.sort((a, b) => {
      const valueA = String(a[sortBy]).toLowerCase();
      const valueB = String(b[sortBy]).toLowerCase();
      const compare = valueA.localeCompare(valueB, undefined, { numeric: true });
      return sortOrder === "asc" ? compare : -compare;
    });
  }, [students, search, sortBy, sortOrder]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const start = (safePage - 1) * PAGE_SIZE;
  const rows = filtered.slice(start, start + PAGE_SIZE);

  const onSort = (field) => {
    setPage(1);
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(field);
    setSortOrder("asc");
  };

  const columnHeader = (field, label) => (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
    >
      {label}
      <ArrowDownUp size={12} />
    </button>
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Recent Students</h3>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, class, parent..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none ring-sky-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="px-3 py-2 text-left">{columnHeader("name", "Name")}</th>
              <th className="px-3 py-2 text-left">{columnHeader("className", "Class")}</th>
              <th className="px-3 py-2 text-left">{columnHeader("section", "Section")}</th>
              <th className="px-3 py-2 text-left">{columnHeader("parent", "Parent")}</th>
              <th className="px-3 py-2 text-left">{columnHeader("status", "Status")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((student) => {
              const statusClass =
                student.status === "Active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";

              return (
                <tr key={student.id} className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60">
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-100">{student.name}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.className}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.section}</td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{student.parent}</td>
                  <td className="px-3 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs font-semibold " + statusClass}>
                      {student.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
        <p>
          Showing {rows.length} of {filtered.length} students
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Previous
          </button>
          <span className="text-slate-600 dark:text-slate-300">
            Page {safePage} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            disabled={safePage === pageCount}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 dark:border-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}