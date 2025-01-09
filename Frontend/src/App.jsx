import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDasboard from './Admin/AdminDasboard'
import './App.css'
import Home from './Home/Home'
import StudentDashboard from './Student/StudentDashboard'
import Defaultquiz from './Home/Defaultquiz'
import LoginSignup from './LoginSignup'
import Category from './Admin/Category'
import ManageExam from './Admin/ManageExam'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<LoginSignup />} />
          <Route path="/admin/dashboard" element={<AdminDasboard />} />
          <Route path='/admin/category' element={<Category />} />
          <Route path="/admin/manage-exam" element={<ManageExam/>} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/admin/logout" element={<Home />} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
