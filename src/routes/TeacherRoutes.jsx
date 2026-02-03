import { Routes, Route } from "react-router-dom";
import TeacherLayout from "../components/teacher/TeacherLayout";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherProfile from "../pages/teacher/TeacherProfile";
import MyAttendance from "../pages/teacher/MyAttendance";
import StudentAttendance from "../pages/teacher/StudentAttendance";
import Notices from "../pages/teacher/Notices";
import Documents from "../pages/teacher/Documents";
import Homework from "../pages/teacher/Homework";
import Salary from "../pages/teacher/Salary";

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route element={<TeacherLayout />}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/profile" element={<TeacherProfile />} />
        <Route path="/teacher/my-attendance" element={<MyAttendance />} />
        <Route path="/teacher/student-attendance" element={<StudentAttendance />} />
        <Route path="/teacher/notices" element={<Notices />} />
        <Route path="/teacher/documents" element={<Documents />} />
        <Route path="/teacher/homework" element={<Homework />} />
        <Route path="/teacher/salary" element={<Salary />} />
      </Route>
    </Routes>
  );
}
