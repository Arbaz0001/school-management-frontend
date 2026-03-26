import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const CACHE_KEY = "admin_dashboard_metrics_cache_v1";
const HISTORY_LIMIT = 12;

function monthLabel(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, { month: "short" });
}

function dayLabel(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, { weekday: "short" });
}

function safePercent(num) {
  return Number.isFinite(num) ? `${num.toFixed(1)}%` : "0.0%";
}

function buildActivities(metrics) {
  const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return [
    { id: 1, type: "student", title: `Students tracked: ${metrics.students}`, time: now },
    { id: 2, type: "teacher", title: `Teachers available: ${metrics.teachers}`, time: now },
    { id: 3, type: "exam", title: `Classes in system: ${metrics.classes}`, time: now },
    { id: 4, type: "fee", title: `Attendance snapshot: ${metrics.attendance}`, time: now },
  ];
}

export default function useRealtimeDashboard(options = {}) {
  const pollMs = options.pollMs || 30000;
  const cacheMs = options.cacheMs || 60000;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [snapshot, setSnapshot] = useState({
    dashboardStats: {
      students: "0",
      teachers: "0",
      parents: "0",
      classes: "0",
      attendance: "0.0%",
      feeCollection: "$0",
      pendingFees: "$0",
      revenue: "$0",
    },
    admissionData: [],
    feeData: [],
    attendanceData: [],
    activities: [],
    students: [],
    history: [],
  });

  const loadMetrics = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);

    try {
      setError("");

      const [studentsRes, teachersRes, usersRes, classesRes, attendanceRes] = await Promise.all([
        api.get("/students", { params: { page: 1, limit: 10 } }),
        api.get("/teachers", { params: { page: 1, limit: 10 } }),
        api.get("/users"),
        api.get("/classes", { params: { page: 1, limit: 10 } }),
        api.get("/attendance-records", { params: { page: 1, limit: 30 } }),
      ]);

      const studentsTotal = Number(studentsRes.data?.total || 0);
      const teachersTotal = Number(teachersRes.data?.total || 0);
      const users = usersRes.data || [];
      const parentsTotal = users.filter((user) => user.role === "parent").length;
      const classesTotal = Number(classesRes.data?.total || 0);
      const attendanceRows = attendanceRes.data?.data || [];

      const present = attendanceRows.reduce((sum, row) => sum + Number(row.presentCount || 0), 0);
      const absent = attendanceRows.reduce((sum, row) => sum + Number(row.absentCount || 0), 0);
      const attendancePct = present + absent > 0 ? (present / (present + absent)) * 100 : 0;

      const estimatedFeeCollection = studentsTotal * 120;
      const estimatedPending = Math.max(0, studentsTotal * 150 - estimatedFeeCollection);
      const estimatedRevenue = estimatedFeeCollection * 10;

      const now = Date.now();

      const students = (studentsRes.data?.students || []).slice(0, 10).map((student) => ({
        id: student._id,
        name: [student.firstName, student.lastName].filter(Boolean).join(" ") || "Student",
        className: student.className || "-",
        section: student.section || "-",
        parent: student.father?.name || student.guardian?.name || "-",
        status: "Active",
      }));

      const dashboardStats = {
        students: String(studentsTotal),
        teachers: String(teachersTotal),
        parents: String(parentsTotal),
        classes: String(classesTotal),
        attendance: safePercent(attendancePct),
        feeCollection: `$${estimatedFeeCollection.toLocaleString()}`,
        pendingFees: `$${estimatedPending.toLocaleString()}`,
        revenue: `$${estimatedRevenue.toLocaleString()}`,
      };

      const activities = buildActivities(dashboardStats);

      setSnapshot((prev) => {
        const history = [...(prev.history || []), { ts: now, students: studentsTotal, attendance: attendancePct }].slice(-HISTORY_LIMIT);

        const admissionData = history.map((item) => ({
          month: monthLabel(item.ts),
          admissions: item.students,
        }));

        const feeData = history.map((item) => ({
          month: monthLabel(item.ts),
          amount: Math.round(item.students * 120),
        }));

        const attendanceData = history.slice(-7).map((item) => ({
          day: dayLabel(item.ts),
          attendance: Number(item.attendance.toFixed(1)),
        }));

        const next = {
          dashboardStats,
          admissionData,
          feeData,
          attendanceData,
          activities,
          students,
          history,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: now, payload: next }));
        return next;
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load realtime dashboard stats");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const cacheRaw = localStorage.getItem(CACHE_KEY);
      if (cacheRaw) {
        const cache = JSON.parse(cacheRaw);
        if (cache?.savedAt && Date.now() - cache.savedAt < cacheMs && cache.payload) {
          setSnapshot(cache.payload);
          setLastUpdated(new Date(cache.savedAt));
          setLoading(false);
        }
      }
    } catch {
      // ignore cache parse errors
    }

    loadMetrics(false);
    const timer = setInterval(() => loadMetrics(true), pollMs);

    return () => clearInterval(timer);
  }, [cacheMs, pollMs, loadMetrics]);

  const apiOut = useMemo(() => ({
    loading,
    error,
    lastUpdated,
    ...snapshot,
    refresh: () => loadMetrics(false),
  }), [loading, error, lastUpdated, snapshot, loadMetrics]);

  return apiOut;
}
