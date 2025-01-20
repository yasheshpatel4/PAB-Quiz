import { useState, useEffect } from "react";

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [finished, setFinished] = useState(false);

    useEffect(() => {

        fetch("/Question.json")
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error loading questions:", error);
                setLoading(false);
            });
    }, []);

    const handleNext = () => {
        if (selectedAnswer === questions[currentQuestionIndex].correct_answer) {
            setScore(score + 1); 
        }

        const nextQuestionIndex = currentQuestionIndex + 1;

        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setSelectedAnswer(null); 
        } else {
            setFinished(true); 
        }
    };

    if (loading) {
        return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
    }

    if (finished) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Quiz Finished</h1>
                <p className="text-lg text-gray-700">
                    Your score: <span className="font-bold">{score}</span> out of {questions.length}
                </p>
                <button
                    className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    Restart Quiz
                </button>
            </div>
        );
    }

    const question = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="relative w-11/12 md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
                <button
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold"
                    onClick={() => window.close()}
                >
                    X
                </button>
                <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                    Programming Quiz
                </h1>
                <p className="text-gray-600 mb-2 text-center">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{question.question}</h3>
                <ul className="space-y-2">
                    {question.incorrect_answers
                        .concat(question.correct_answer)
                        .sort(() => Math.random() - 0.5)
                        .map((answer, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => setSelectedAnswer(answer)}
                                    className={`w-full py-3 px-4 rounded-lg border text-left ${selectedAnswer === answer
                                        ? "bg-blue-500 text-white border-blue-500"
                                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                                        }`}
                                >
                                    {answer}
                                </button>
                            </li>
                        ))}
                </ul>
                <div className="mt-6 text-center">
                    <button
                        onClick={handleNext}
                        disabled={!selectedAnswer}
                        className={`px-6 py-3 rounded-lg font-semibold shadow-md ${selectedAnswer
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Quiz;
