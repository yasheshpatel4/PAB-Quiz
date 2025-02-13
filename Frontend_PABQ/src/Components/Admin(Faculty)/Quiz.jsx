import { useState, useEffect } from "react"

const Quiz = () => {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    fetch("/Question.json")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading questions:", error)
        setLoading(false)
      })
  }, [])

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1)
    }

    const nextQuestionIndex = currentQuestionIndex + 1

    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex)
      setSelectedAnswer(null)
    } else {
      setFinished(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Quiz Finished</h1>
          <p className="text-xl text-gray-700 mb-6">
            Your score: <span className="font-bold text-blue-600">{score}</span> out of{" "}
            <span className="font-bold">{questions.length}</span>
          </p>
          <button
            className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Restart Quiz
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestionIndex]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
          onClick={() => window.close()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Programming Quiz</h1>
        <div className="mb-6">
          <p className="text-gray-600 text-lg mb-2 text-center">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>
        <ul className="space-y-3">
          {question.incorrect_answers
            .concat(question.correct_answer)
            .sort(() => Math.random() - 0.5)
            .map((answer, index) => (
              <li key={index}>
                <button
                  onClick={() => setSelectedAnswer(answer)}
                  className={`w-full py-3 px-4 rounded-lg text-left transition duration-200 ease-in-out ${
                    selectedAnswer === answer ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  {answer}
                </button>
              </li>
            ))}
        </ul>
        <div className="mt-8 text-center">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`px-6 py-3 rounded-lg font-semibold text-lg shadow-md transition duration-200 ease-in-out ${
              selectedAnswer
                ? "bg-blue-500 text-white hover:bg-blue-600 transform hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz

