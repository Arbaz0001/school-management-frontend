import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import api from "../services/api";
import FormModal from "../components/FormModal";
import { useToast } from "../context/ToastContext";
import useTableQueryState from "../hooks/useTableQueryState";
import ModuleReportActions from "../components/ModuleReportActions";
import usePermissions from "../hooks/usePermissions";

const PAGE_SIZE = 8;

const feeFields = [
  { name: "studentId", label: "Student", type: "select", options: [] },
  { name: "amount", label: "Amount", type: "number" },
  { name: "type", label: "Fee Type", type: "select", options: ["monthly", "admission", "exam"] },
];

export default function Fees() {
  const { can } = usePermissions();
  const canCreate = can("fees", "create");
  const canExport = can("fees", "export");
  const canPrint = can("fees", "print");

  const { pushToast } = useToast();
  const { search, setSearch, debouncedSearch, page, setPage } = useTableQueryState();
  const [rows, setRows] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [studentOptions, setStudentOptions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [formValues, setFormValues] = useState({ studentId: "", amount: "", type: "monthly" });

  const loadData = async () => {
    setLoading(true);
    try {
      const studentsRes = await api.get("/students", {
        params: {
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
        },
      });

      const students = studentsRes.data?.students || [];
      const totalPagesFromApi = studentsRes.data?.totalPages || 1;
      setTotalPages(totalPagesFromApi);

      const studentDict = students.reduce((acc, student) => {
        acc[student._id] = student;
        return acc;
      }, {});
      setStudentMap(studentDict);

      const feeResponses = await Promise.all(
        students.map((student) => api.get(`/fees/student/${student.user || student._id}`)),
      );

      const mappedRows = students.map((student, index) => {
        const feePayload = feeResponses[index].data || {};
        return {
          id: student._id,
          studentId: student.user || student._id,
          name: [student.firstName, student.lastName].filter(Boolean).join(" ") || "-",
          className: student.className || "-",
          totalPaid: feePayload.totalPaid || 0,
          latestType: feePayload.latest?.type || "-",
          latestDate: feePayload.latest?.paidOn ? new Date(feePayload.latest.paidOn).toLocaleDateString() : "-",
          status: (feePayload.totalPaid || 0) > 0 ? "Active" : "Inactive",
        };
      });

      setRows(mappedRows);
      setStudentOptions(
        students.map((student) => ({
          value: student.user || student._id,
          label: [student.firstName, student.lastName].filter(Boolean).join(" ") || student.admissionId || "Student",
        })),
      );

      if (!formValues.studentId && students.length > 0) {
        setFormValues((prev) => ({ ...prev, studentId: students[0].user || students[0]._id }));
      }
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to load fees", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, debouncedSearch]);

  const handlePayFee = async () => {
    if (!canCreate) return;
    const studentId = formValues.studentId;
    const amount = Number(formValues.amount || 0);
    const type = formValues.type;

    if (!studentId || amount <= 0 || !type) {
      pushToast("Please fill all fee fields", "error");
      return;
    }

    const targetRow = rows.find((row) => row.studentId === studentId);
    const optimisticId = `optimistic-${Date.now()}`;

    setRows((prev) => {
      if (targetRow) {
        return prev.map((row) => {
          if (row.studentId !== studentId) return row;
          return {
            ...row,
            totalPaid: row.totalPaid + amount,
            latestType: type,
            latestDate: new Date().toLocaleDateString(),
            status: "Active",
          };
        });
      }

      const student = Object.values(studentMap).find((item) => (item.user || item._id) === studentId);
      return [
        {
          id: optimisticId,
          studentId,
          name: student ? [student.firstName, student.lastName].filter(Boolean).join(" ") : "Student",
          className: student?.className || "-",
          totalPaid: amount,
          latestType: type,
          latestDate: new Date().toLocaleDateString(),
          status: "Active",
        },
        ...prev,
      ];
    });

    setOpenModal(false);

    try {
      await api.post("/fees/pay", {
        studentId,
        amount,
        type,
      });
      pushToast("Fee payment recorded", "success");
      await loadData();
    } catch (err) {
      pushToast(err.response?.data?.message || "Failed to record fee payment", "error");
      await loadData();
    }
  };

  const summary = useMemo(() => {
    const totalPaid = rows.reduce((sum, row) => sum + (row.totalPaid || 0), 0);
    const active = rows.filter((row) => row.status === "Active").length;
    return {
      students: rows.length,
      totalPaid,
      active,
    };
  }, [rows]);

  const modalFields = feeFields.map((field) =>
    field.name === "studentId"
      ? { ...field, options: studentOptions }
      : field,
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fees</h1>
            <p className="mt-1 text-sm text-slate-500">Live fee collection with optimistic payment updates.</p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search student"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenModal(true)}
              disabled={!canCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
              Collect Fee
            </button>
          </div>
        </div>

        <div className="mt-4">
          <ModuleReportActions
            title="Fees Report"
            columns={[
              { key: "name", label: "Student" },
              { key: "className", label: "Class" },
              { key: "totalPaid", label: "Total Paid" },
              { key: "latestType", label: "Latest Type" },
              { key: "latestDate", label: "Latest Date" },
              { key: "status", label: "Status" },
            ]}
            rows={rows}
            summaryCards={[
              { label: "Students", value: summary.students },
              { label: "Total Paid", value: summary.totalPaid },
              { label: "Active Accounts", value: summary.active },
            ]}
            canExport={canExport}
            canPrint={canPrint}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard label="Students" value={String(summary.students)} />
          <SummaryCard label="Total Paid" value={`$${summary.totalPaid}`} />
          <SummaryCard label="Active Accounts" value={String(summary.active)} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <p className="text-sm text-slate-500">Loading fee data...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-3 py-2 text-left">Student</th>
                  <th className="px-3 py-2 text-left">Class</th>
                  <th className="px-3 py-2 text-left">Total Paid</th>
                  <th className="px-3 py-2 text-left">Latest Type</th>
                  <th className="px-3 py-2 text-left">Latest Date</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.name}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.className}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">${row.totalPaid}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.latestType}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{row.latestDate}</td>
                    <td className="px-3 py-2">
                      <span className={row.status === "Active" ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700" : "rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700"}>
                        {row.status}
                      </span>
                    </td>
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
          title="Collect Fee"
          fields={modalFields}
          values={formValues}
          onChange={(key, value) => setFormValues((prev) => ({ ...prev, [key]: value }))}
          onClose={() => setOpenModal(false)}
          onSubmit={handlePayFee}
          submitLabel="Save Payment"
        />
      )}
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
