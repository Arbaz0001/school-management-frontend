import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

/* ================= ADMIN ================= */
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

/* STUDENTS */
import AllStudents from "./pages/admin/students/AllStudents";
import StudentDetails from "./pages/admin/students/StudentDetails";
import AdmissionForm from "./pages/admin/students/AdmissionForm";
import StudentPromotion from "./pages/admin/students/StudentPromotion";
import StudentsByClass from "./pages/admin/students/StudentsByClass";
import StudentList from "./pages/admin/students/StudentList";
import EditStudent from "./pages/admin/students/EditStudent";

/* TEACHERS (ADMIN) */
import TeachersList from "./pages/admin/teachers/TeachersList";
import CreateTeacher from "./pages/admin/teachers/CreateTeacher";
import TeacherSalary from "./pages/admin/teachers/TeacherSalary";
import TeacherNotices from "./pages/admin/teachers/TeacherNotices";
import TeacherProfileView from "./pages/admin/teachers/TeacherProfileView";
import EditTeacher from "./pages/admin/teachers/EditTeacher";

/* PARENTS (ADMIN) */
import ParentsList from "./pages/admin/parents/ParentsList";
import CreateParent from "./pages/admin/parents/CreateParent";
import ParentDetails from "./pages/admin/parents/ParentDetails";
import EditParent from "./pages/admin/parents/EditParent";


/* ================= TEACHER ================= */
import TeacherLayout from "./components/teacher/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherProfile from "./pages/teacher/TeacherProfile";
import TeacherMyAttendance from "./pages/teacher/MyAttendance";
import StudentAttendance from "./pages/teacher/StudentAttendance";
import Notices from "./pages/teacher/Notices";
import Documents from "./pages/teacher/Documents";
import Homework from "./pages/teacher/Homework";
import Salary from "./pages/teacher/Salary";

/* ================= STUDENT ================= */
import StudentLayout from "./components/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentNotices from "./pages/student/Notices";
import StudentHomework from "./pages/student/Homework";
import MyAttendance from "./pages/student/MyAttendance";

/* ================= PARENT ================= */
import ParentLayout from "./components/parent/ParentLayout";
import ParentDashboard from "./pages/parent/ParentDashboard";
import StudentProfile from "./pages/parent/StudentProfile";
import ParentAttendance from "./pages/parent/Attendance";
import ParentFees from "./pages/parent/Fees";
import ParentResults from "./pages/parent/Results";
import ParentTimetable from "./pages/parent/Timetable";
import ParentNotices from "./pages/parent/Notices";
import ParentSettings from "./pages/parent/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN */}
          <Route path="/" element={<Login />} />

          {/* ================= ADMIN ================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* STUDENTS */}
            <Route path="students" element={<StudentsByClass />} />
            <Route path="students/all" element={<AllStudents />} />
            <Route path="students/details" element={<StudentDetails />} />
            <Route path="students/admission" element={<AdmissionForm />} />
            <Route path="students/promotion" element={<StudentPromotion />} />
            <Route path="students/class/:className" element={<StudentList />} />
            <Route path="students/edit/:id" element={<EditStudent />} />
            <Route path="students/:id" element={<StudentDetails />} />

            {/* TEACHERS */}
            <Route path="teachers" element={<TeachersList />} />
            <Route path="teachers/create" element={<CreateTeacher />} />
            <Route path="teachers/:id/salary" element={<TeacherSalary />} />
            <Route path="teachers/:id/notices" element={<TeacherNotices />} />
            <Route path="teachers/edit/:id" element={<EditTeacher />} />
            <Route path="teachers/:id/profile" element={<TeacherProfileView />} />

            {/* PARENTS */}
            <Route path="parents" element={<ParentsList />} />
            <Route path="parents/create" element={<CreateParent />} />
            <Route path="parents/edit/:id" element={<EditParent />} />
            <Route path="parents/:id" element={<ParentDetails />} />

          </Route>

          {/* ================= TEACHER ================= */}
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
            <Route path="notices" element={<Notices />} />
            <Route path="documents" element={<Documents />} />
            <Route path="homework" element={<Homework />} />
            <Route path="salary" element={<Salary />} />
          </Route>

          {/* ================= STUDENT ================= */}
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

          {/* ================= PARENT ================= */}
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
