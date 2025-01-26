import { useState, useEffect } from "react"
import axios from "axios"
import AdminNavbar from "../NavBar/AdminNavbar"
import { AlertCircle, LoaderCircle, Trash2, Edit2 } from "lucide-react"

const QuizDisplay = () => {
  const [quiz, setQuiz] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/admin/getallquiz")
        const quizdata = Array.isArray(response.data) ? response.data : []
        setQuiz(quizdata)
      } catch (err) {
        console.error("Error fetching quizzes:", err)
        setError("Failed to fetch quizzes. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [])

  const handleUpdate = (id) => {
    alert(`Update functionality for quiz ID: ${id}`)
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this quiz?")
    if (!confirmed) return

    try {
      await axios.delete(`http://localhost:8080/auth/admin/deletequiz/${id}`)
      setQuiz(quiz.filter((quiz) => quiz.Quizid !== id))
      alert("Quiz deleted successfully.")
    } catch (err) {
      console.error("Error deleting quiz:", err.response?.data || err.message)
      setError(err.response?.data || "Failed to delete quiz. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-700 font-medium text-lg">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-red-200">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-700 mb-6 text-lg">{error}</p>
          <button
            onClick={() => setError("")}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-lg font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  if (!Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl text-gray-700 font-medium">No quizzes found.</p>
      </div>
    )
  }

  return (
    <AdminNavbar>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Management</h1>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["#", "Quiz ID", "Subject", "Semester", "Duration", "Description", "Actions"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quiz.map((item, index) => (
                  <tr key={item.Quizid} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Quizid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizSubject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizSem}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizDuration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdate(item.Quizid)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          title="Edit quiz"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.Quizid)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Delete quiz"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminNavbar>
  )
}

export default QuizDisplay

