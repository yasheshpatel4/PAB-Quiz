import { useEffect, useState } from "react";
import axios from "axios";
import StudentNavbar from "../NavBar/StudentNavbar";
import QuizModal from "./QuizModal";

function StudentDashBoard() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const extraMinutes = 5; // This should match the backend 's' value

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/students/allquiz", {
          params: { studentEmail: localStorage.getItem("studentEmail"), studentID: localStorage.getItem("studentID") }
        });

        const currentTime = new Date();

        // Filter quizzes based on time
        const validQuizzes = response.data.filter((quiz) => {
          const startTime = new Date(quiz.createdAt); // Convert to Date object
          const quizEndTime = new Date(startTime.getTime() + (quiz.QuizDuration + extraMinutes) * 60000);

          return currentTime >= startTime && currentTime <= quizEndTime;
        });

        setQuizzes(validQuizzes);
      } catch (err) {
        setError("Failed to fetch quizzes.");
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleOpenQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100">
      <StudentNavbar />
      <div className="flex-1 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold dark:text-black">📚 Available Quizzes</h1>
          <p className="text-gray-600 dark:text-gray-500 mt-2">Select a quiz and test your knowledge!</p>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

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
                  <p className="text-sm">⏳ Duration: <span className="font-medium">{quiz.QuizDuration} minutes</span></p>
                  <p className="text-sm">📝 Description: <span className="font-medium">{quiz.QuizDescription}</span></p>
                </div>
                <button
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition-all"
                  onClick={() => handleOpenQuiz(quiz)}
                >
                  Take Quiz 🚀
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-600 col-span-full">No quizzes available.</p>
          )}
        </div>
      </div>

      {selectedQuiz && <QuizModal quiz={selectedQuiz} onClose={() => setSelectedQuiz(null)} />}
    </div>
  );
}

export default StudentDashBoard;
