import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function QuizModal({ quiz, onClose }) {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timer, setTimer] = useState(quiz.QuizDuration * 60);
    const [agreed, setAgreed] = useState(false);
    const [tabSwitch, setTabSwitch] = useState(false);
    const [score, setScore] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        if (agreed) {
            fetchQuestions();
            enterFullScreen();
        }
    }, [agreed]);

    useEffect(() => {
        if (timer > 0 && agreed) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            submitQuiz(false);
        }
    }, [timer, agreed]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitch(true);
                window.alert("⚠️ Tab switching detected! Quiz auto-submitted.");
                submitQuiz(true);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/students/getquestion", {
                params: { quizId: quiz.quizid },
            });

            const formattedQuestions = response.data.map(q => ({
                ...q,
                options: [q.option1, q.option2, q.option3, q.option4],
            }));

            setQuestions(formattedQuestions);
        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    };

    const enterFullScreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Error entering fullscreen mode:", err);
            });

            const preventEscape = (e) => {
                if (e.key === "Escape") e.preventDefault();
            };

            document.addEventListener("keydown", preventEscape);

            return () => {
                document.removeEventListener("keydown", preventEscape);
            };
        }
    };

    const handleAnswer = (questionId, option) => {
        const updatedAnswers = { ...answers, [questionId]: option };
        setAnswers(updatedAnswers);
    };

    const handleNavigation = (index) => {
        if (index >= 0 && index < questions.length) {
            setCurrentIndex(index);
        }
    };

    const submitQuiz = async (tabViolation) => {
        const studentEmail = localStorage.getItem("studentEmail");

        if (!studentEmail) {
            console.error("Error: Student email is missing.");
            return;
        }

         // Only send answers in body

        // console.log("Submitting Quiz:", { quizId: quiz.quizid, studentEmail, tabViolation, answers }); // Debugging

        try {
            const response = await axios.post(
                `http://localhost:8080/api/students/submitQuiz`,
                answers,
                {
                    params: { quizId: quiz.quizid, studentEmail, tabViolation }
                }
            );

            window.alert(response.data);
            navigate("/student/exam");
        } catch (err) {
            console.error("Error submitting quiz:", err.response ? err.response.data : err.message);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl text-center">
                {!agreed ? (
                    <>
                        <h2 className="text-xl font-bold">📜 Quiz Agreement</h2>
                        <p className="text-sm text-gray-600">You must stay in full screen & attempt all questions.</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setAgreed(true)}>Agree ✅</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel ❌</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold">{quiz.QuizSubject}</h2>
                        <p className="text-sm text-gray-600">
                            ⏳ Time Left: {String(Math.floor(timer / 60)).padStart(2, '0')}:
                            {String(timer % 60).padStart(2, '0')}
                        </p>

                        {tabSwitch && <p className="text-red-500">⚠️ Tab switching detected! Quiz auto-submitted.</p>}

                        {questions.length > 0 ? (
                            <div className="mt-4">
                                <div className="grid grid-cols-5 gap-2 mb-4">
                                    {questions.map((q, index) => (
                                        <button
                                            key={index}
                                            className={`w-10 h-10 rounded ${answers[q.questionid] ? "bg-green-500 text-white" : "bg-orange-500 text-white"}`}
                                            onClick={() => handleNavigation(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <p className="font-semibold">{questions[currentIndex]?.question}</p>
                                <div className="mt-2 space-y-2">
                                    {questions[currentIndex]?.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className={`block w-full px-4 py-2 border rounded ${answers[questions[currentIndex].questionid] === option ? "bg-green-300" : "bg-gray-100"}`}
                                            onClick={() => handleAnswer(questions[currentIndex].questionid, option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleNavigation(currentIndex - 1)} disabled={currentIndex === 0}>⬅ Prev</button>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleNavigation(currentIndex + 1)} disabled={currentIndex === questions.length - 1}>Next ➡</button>
                                </div>

                                {Object.keys(answers).length === questions.length && (
                                    <button className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded w-full" onClick={() => submitQuiz(false)}>Submit ✅</button>
                                )}
                            </div>
                        ) : (
                            <p>Loading questions...</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default QuizModal;
