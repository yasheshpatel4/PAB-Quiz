import { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../NavBar/AdminNavbar";
import { AlertCircle, LoaderCircle, Trash2, PlusCircle, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuizDisplay = () => {
  const [quiz, setQuiz] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [questionCounts, setQuestionCounts] = useState({});

  const navigate = useNavigate();


  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/admin/getallquiz", {
          params: { email: localStorage.getItem("adminEmail") },
        });
        const quizdata = Array.isArray(response.data) ? response.data : [];

        const counts = {};
        await Promise.all(
          quizdata.map(async (quiz) => {
            try {
              const countResponse = await axios.get(`http://localhost:8080/auth/admin/noofquestion/${quiz.quizid}`);
              counts[quiz.quizid] = countResponse.data;
            } catch (err) {
              console.error(`Error fetching question count for quiz ID ${quiz.quizid}:`, err);
              counts[quiz.quizid] = 0;
            }
          })
        );

        setQuestionCounts(counts);
        setQuiz(quizdata);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to fetch quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);


  const handleAddQuestion = (id) => {
    localStorage.setItem("quizid", id);
    navigate("/admin/addquestion");
  };

  const handleUpload = async (id) => {

    try {
      const confirmUpload = window.confirm("Are you sure you want to upload the quiz?");

      if (confirmUpload) {
        const response = await axios.post(`http://localhost:8080/auth/admin/upload/${id}`);
        alert(response.data);
      }
    } catch (err) {
      console.error("Error uploading quiz:", err.response?.data || err.message);
      setError(err.response?.data || "Failed to upload quiz. Please try again.");
    }

  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/auth/admin/deletequiz/${id}`);
      setQuiz(quiz.filter((quiz) => quiz.quizid !== id));
      alert("Quiz deleted successfully.");
    } catch (err) {
      console.error("Error deleting quiz:", err.response?.data || err.message);
      setError(err.response?.data || "Failed to delete quiz. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => setError("")}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(quiz) || quiz.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 font-medium">No quizzes found.</p>
      </div>
    );
  }

  return (
    <AdminNavbar>
      <div className="ml-4 overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Quiz ID", "Subject", "Semester", "Duration", "Description", "NOF", "available", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quiz.map((item) => (
              <tr key={item.quizid} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quizid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizSubject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizSem}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizDuration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizDescription}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {questionCounts[item.quizid] || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.isAvailable === true ? "yes" : "no"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddQuestion(item.quizid)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                      title="Add question"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpload(item.quizid)}
                      className={`p-1 transition-colors duration-200 rounded-full ${(questionCounts[item.quizid] || 0) >= 5
                        ? "text-blue-600 hover:text-blue-800"
                        : "text-gray-300 cursor-not-allowed hover:ring-2 hover:ring-red-500 hover:ring-opacity-75"
                        }`}
                      title="Upload"
                      disabled={(questionCounts[item.quizid] || 0) < 5}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.quizid)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Remove quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminNavbar>
  );
};

export default QuizDisplay;