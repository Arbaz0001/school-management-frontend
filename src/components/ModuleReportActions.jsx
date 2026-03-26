import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { exportRowsToCsv, printRowsReport } from "../utils/reporting";

export default function ModuleReportActions({
  title,
  columns,
  rows,
  summaryCards,
  canExport = true,
  canPrint = true,
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const dateField = useMemo(() => {
    const candidates = ["date", "paidOn", "createdAt", "updatedAt", "latestDate", "admissionDate"];
    return candidates.find((field) => safeRows.some((row) => row[field])) || null;
  }, [safeRows]);

  const filteredRows = useMemo(() => {
    if (!dateField || (!fromDate && !toDate)) return safeRows;

    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    if (to) to.setHours(23, 59, 59, 999);

    return safeRows.filter((row) => {
      const raw = row[dateField];
      if (!raw) return false;

      const current = new Date(raw);
      if (Number.isNaN(current.getTime())) return false;

      if (from && current < from) return false;
      if (to && current > to) return false;
      return true;
    });
  }, [safeRows, dateField, fromDate, toDate]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {dateField && (
        <>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            title="From date"
          />
          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            title="To date"
          />
        </>
      )}

      <button
        type="button"
        disabled={!canExport || filteredRows.length === 0}
        onClick={() =>
          exportRowsToCsv({
            columns,
            rows: filteredRows,
            fileName: `${String(title || "module").toLowerCase().replace(/\s+/g, "-")}-report.csv`,
          })
        }
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <Download size={14} />
        Export CSV
      </button>

      <button
        type="button"
        disabled={!canPrint || filteredRows.length === 0}
        onClick={() =>
          printRowsReport({
            title,
            columns,
            rows: filteredRows,
            summaryCards,
          })
        }
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <Printer size={14} />
        Print Report
      </button>
    </div>
  );
}
