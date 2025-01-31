import { useEffect, useState } from "react";
import axios from "axios";
import StudentNavbar from "../NavBar/StudentNavbar";

function StudentDashBoard() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  const handleOpen = () => {
    
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/students/allquiz", {
          params: { studentEmail: localStorage.getItem("studentEmail"), studentID: localStorage.getItem("studentID") }
        });
        setQuizzes(response.data);
      } catch (err) {
        setError("Failed to fetch quizzes.");
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100">
      <StudentNavbar />
      <div className="flex-1 p-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold dark:text-black">📚 Available Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-500 mt-2">Select a quiz and test your knowledge!</p>
        </div>

        {/* Display error message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Quiz List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div
                key={quiz.quizid}
                className="bg-white bg-opacity-80 dark:bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                <h2 className="text-xl font-bold text-gray-900 dark:text-black mb-2">{quiz.QuizSubject}</h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-500">
                  <p className="text-sm">🆔 Quiz ID: <span className="font-medium">{quiz.quizid}</span></p>
                  <p className="text-sm">⏳ Duration: <span className="font-medium">{quiz.QuizDuration}</span></p>
                  <p className="text-sm">📝 Description: <span className="font-medium">{quiz.QuizDescription}</span></p>
                  
                </div>
                <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all"
                  onClick={handleOpen}>
                  Take Quiz 🚀
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-600 col-span-full">No quizzes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashBoard;
