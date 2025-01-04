import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDasboard from './Admin/AdminDasboard'
import './App.css'
import Home from './Home/Home'
import StudentDashboard from './Student/StudentDashboard'
import Defaultquiz from './Home/Defaultquiz'

function App() {

  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<AdminDasboard />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </BrowserRouter>

  return (
    <>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </>
  )
}

export default App
