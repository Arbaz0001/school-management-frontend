import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const Login = lazy(() => import("./pages/Login"));

/* ================= ADMIN ================= */
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Students = lazy(() => import("./pages/Students"));
const Teachers = lazy(() => import("./pages/Teachers"));
const Parents = lazy(() => import("./pages/Parents"));
const Classes = lazy(() => import("./pages/Classes"));
const Subjects = lazy(() => import("./pages/Subjects"));
const Attendance = lazy(() => import("./pages/Attendance"));
const Fees = lazy(() => import("./pages/Fees"));
const Exams = lazy(() => import("./pages/Exams"));
const Timetable = lazy(() => import("./pages/Timetable"));
const Library = lazy(() => import("./pages/Library"));
const Transport = lazy(() => import("./pages/Transport"));
const Hostel = lazy(() => import("./pages/Hostel"));
const Notices = lazy(() => import("./pages/Notices"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));

/* ================= TEACHER ================= */
const TeacherLayout = lazy(() => import("./components/teacher/TeacherLayout"));
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const TeacherProfile = lazy(() => import("./pages/teacher/TeacherProfile"));
const TeacherMyAttendance = lazy(() => import("./pages/teacher/MyAttendance"));
const StudentAttendance = lazy(() => import("./pages/teacher/StudentAttendance"));
const TeacherNotices = lazy(() => import("./pages/teacher/Notices"));
const Documents = lazy(() => import("./pages/teacher/Documents"));
const Homework = lazy(() => import("./pages/teacher/Homework"));
const Salary = lazy(() => import("./pages/teacher/Salary"));

/* ================= STUDENT ================= */
const StudentLayout = lazy(() => import("./components/student/StudentLayout"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentNotices = lazy(() => import("./pages/student/Notices"));
const StudentHomework = lazy(() => import("./pages/student/Homework"));
const MyAttendance = lazy(() => import("./pages/student/MyAttendance"));

/* ================= PARENT ================= */
const ParentLayout = lazy(() => import("./components/parent/ParentLayout"));
const ParentDashboard = lazy(() => import("./pages/parent/ParentDashboard"));
const StudentProfile = lazy(() => import("./pages/parent/StudentProfile"));
const ParentAttendance = lazy(() => import("./pages/parent/Attendance"));
const ParentFees = lazy(() => import("./pages/parent/Fees"));
const ParentResults = lazy(() => import("./pages/parent/Results"));
const ParentTimetable = lazy(() => import("./pages/parent/Timetable"));
const ParentNotices = lazy(() => import("./pages/parent/Notices"));
const ParentSettings = lazy(() => import("./pages/parent/Settings"));

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-600 dark:bg-slate-950 dark:text-slate-200">
      Loading module...
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
            <Route path="/" element={<Login />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="parents" element={<Parents />} />
            <Route path="classes" element={<Classes />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="fees" element={<Fees />} />
            <Route path="exams" element={<Exams />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="library" element={<Library />} />
            <Route path="transport" element={<Transport />} />
            <Route path="hostel" element={<Hostel />} />
            <Route path="notices" element={<Notices />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route
            path="/teacher"
            element={
              <ProtectedRoute role="teacher">
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="my-attendance" element={<TeacherMyAttendance />} />
            <Route path="student-attendance" element={<StudentAttendance />} />
            <Route path="notices" element={<TeacherNotices />} />
            <Route path="documents" element={<Documents />} />
            <Route path="homework" element={<Homework />} />
            <Route path="salary" element={<Salary />} />
          </Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="attendance" element={<MyAttendance />} />
            <Route path="notices" element={<StudentNotices />} />
            <Route path="homework" element={<StudentHomework />} />
          </Route>

          <Route
            path="/parent"
            element={
              <ProtectedRoute role="parent">
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="student-profile" element={<StudentProfile />} />
            <Route path="attendance" element={<ParentAttendance />} />
            <Route path="fees" element={<ParentFees />} />
            <Route path="results" element={<ParentResults />} />
            <Route path="timetable" element={<ParentTimetable />} />
            <Route path="notices" element={<ParentNotices />} />
            <Route path="settings" element={<ParentSettings />} />
            </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
