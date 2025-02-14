import { Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Admin(Faculty)/admindashboard/Dashboard";
// import ManageExam from "./Components/Admin(Faculty)/ManageExam";
import Performance from "./Components/Admin(Faculty)/Performance";
import Students from "./Components/Admin(Faculty)/Students";
import AdminNavbar from "./Components/NavBar/AdminNavbar";
import LogOut from "./Components/Admin(Faculty)/LogOut";
import StudentDashBoard from "./Components/Student(User)/StudentDashBoard";
import Exam from "./Components/Student(User)/Exam";
import Logout from "./Components/Student(User)/Logout";
import StudentNavbar from "./Components/NavBar/StudentNavbar";
import DefaultQuiz from "./Components/MainDashBoard/DefaultQuiz";
import AdminLoginAndSignup from "./Components/MainDashBoard/AdminLoginAndSignup";
import StudentLogin from "./Components/MainDashBoard/StudentLogin";
// import Quiz from "./Components/Admin(Faculty)/Quiz";
import PerformancePage from "./Components/Admin(Faculty)/PerformancePage";
import AddQuestionPage from "./Components/Admin(Faculty)/AddQuestionPage";
import QuestionUpload from "./Components/Admin(Faculty)/QuestionUpload";

const App = () => {
  return (
    <Routes>

      <Route
        path="/admin/*"
        element={
          <AdminNavbar>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="manage-exam" element={<ManageExam />} /> */}
              <Route path="addquestion" element={<AddQuestionPage />} />
              <Route path="/addquestion/uploadquestion" element={<QuestionUpload />} />
              <Route path="performance" element={<Performance />} />
              <Route path="performance/:id" element={<PerformancePage/>} />
              <Route path="students" element={<Students />} />
              <Route path="logout" element={<LogOut />} />
            </Routes>
          </AdminNavbar>
        }
      />

      <Route
        path="/student/*"
        element={
          <StudentNavbar>
            <Routes>
              <Route path="/" element={<StudentDashBoard />} />
              <Route path="exam" element={<Exam />} />
              <Route path="logout" element={<Logout />} />
            </Routes>
          </StudentNavbar>
        }
      />

      <Route
        path="/*"
        element={
          <StudentNavbar>
            <Routes>
              <Route path="/" element={< DefaultQuiz />} />
              <Route path="adminlogin" element={<AdminLoginAndSignup />} />
              <Route path="studentlogin" element={<StudentLogin />} />
              {/* <Route path="quiz" element={<Quiz />} /> */}
            </Routes>
          </StudentNavbar>
        }
      />

    </Routes>
  );
};

export default App;
