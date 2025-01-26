import { useState, useEffect } from "react"
import AdminNavbar from "../NavBar/AdminNavbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Modal from "./admindashboard/Modal"
import Input from "./admindashboard/Input"
import Button from "./admindashboard/Button"

const AddQuestionPage = () => {
  const quizid = localStorage.getItem("quizid")
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [questions, setQuestions] = useState([])
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(5)

  useEffect(() => {
    if (!quizid) {
      console.error("Quiz ID is not defined.")
      return
    }
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/admin/getallquestion", {
          params: { quizid },
        })
        const quizdata = Array.isArray(response.data) ? response.data : []
        setQuestions(quizdata)
      } catch (err) {
        console.error("Error fetching quizzes:", err)
      }
    }
    fetchQuiz()
  }, [quizid])

  const toggleUpload = () => {
    navigate("/admin/")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (e) => {
    setTotalQuestions(Number(e.target.value))
  }

  const handleSubmit = async () => {
    if (questions.length < 5) {
      alert("You need to add at least 5 questions.")
      return
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/admin/addquestion",
        { questions },
        {
          params: { quizid: quizid },
        },
      )
      alert(response.data)
      navigate("/admin/")
    } catch (error) {
      console.error("Error submitting questions:", error)
      alert("An error occurred while submitting questions.")
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <AdminNavbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={toggleUpload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to List
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Add Questions for Quiz ID: {quizid}</h2>
        </div>

        <button
          onClick={() => setShowForm(true)}
          disabled={questions.length >= 20}
          className={`mb-6 px-6 py-3 text-white rounded-lg transition-colors duration-200 ${
            questions.length >= 20 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Add Question
        </button>

        {showForm && (
          <Modal title="Add Question" handleCloseModal={() => setShowForm(false)}>
            <form className="space-y-4">
              <Input label="Question" name="question" value={formData.question} onChange={handleInputChange} />
              <Input label="Answer" name="answer" value={formData.answer} onChange={handleInputChange} />
              <Input label="Option 1" name="option1" value={formData.option1} onChange={handleInputChange} />
              <Input label="Option 2" name="option2" value={formData.option2} onChange={handleInputChange} />
              <Input label="Option 3" name="option3" value={formData.option3} onChange={handleInputChange} />
              <Input label="Option 4" name="option4" value={formData.option4} onChange={handleInputChange} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Number of Questions (5-20):
                </label>
                <select
                  value={totalQuestions}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 16 }, (_, index) => (
                    <option key={index} value={index + 5}>
                      {index + 5}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button onClick={() => setShowForm(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Next
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {questions.length > 0 && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Question", "Answer", "Option 1", "Option 2", "Option 3", "Option 4"].map((header) => (
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
                  {questions.map((q, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.question}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.answer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.option1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.option2}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.option3}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.option4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            disabled={currentIndex === questions.length - 1}
            className={`px-4 py-2 rounded-lg ${
              currentIndex === questions.length - 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </AdminNavbar>
  )
}

export default AddQuestionPage

