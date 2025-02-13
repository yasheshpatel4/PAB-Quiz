import { useState, useEffect } from 'react';
import AdminNavbar from '../NavBar/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './admindashboard/Modal';
import Input from './admindashboard/Input';
import Button from './admindashboard/Button';

const AddQuestionPage = () => {
    const quizid = localStorage.getItem('quizid');
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(5); // Default to 5 questions

   useEffect(() => {
    if (!quizid) {
        console.error("Quiz ID is not defined.");
        return;
    }
    const fetchQuiz = async () => {
        try {
            const response = await axios.get("http://localhost:8080/auth/admin/getallquestion", {
                params: { quizid },
            });
            const quizdata = Array.isArray(response.data) ? response.data : [];
            setQuestions(quizdata);
        } catch (err) {
            console.error("Error fetching quizzes:", err);
        }
    };
    fetchQuiz();
   }, [quizid]);
    
    const toggleUpload = () => {
        navigate('/admin/');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e) => {
        setTotalQuestions(Number(e.target.value)); // Update the total questions based on selection
    };


    const handleSubmit = async () => {
        if (questions.length < 5) {
            alert('You need to add at least 5 questions.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/auth/admin/addquestion', { questions }, {
                params: { quizid: quizid },
            });
            alert(response.data);
            navigate('/admin/');
        } catch (error) {
            console.error('Error submitting questions:', error);
            alert('An error occurred while submitting questions.');
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <>
            <AdminNavbar>
                <button
                    onClick={toggleUpload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
                >
                    Back to List
                </button>
                <div>
                    <h2 className="text-lg font-bold">Add Question for Quiz ID: {quizid}</h2>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    disabled={questions.length >= 20} 
                    className={`my-4 px-4 py-2 text-white rounded-lg transition-colors duration-200 ${questions.length >= 20
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700' 
                        }`}
                >
                    Add Question
                </button>

                {showForm && (
                    <Modal title="Add Question" handleCloseModal={() => setShowForm(false)}>
                        <form>
                            <Input
                                label="Question"
                                name="question"
                                value={formData.question}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Answer"
                                name="answer"
                                value={formData.answer}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Option 1"
                                name="option1"
                                value={formData.option1}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Option 2"
                                name="option2"
                                value={formData.option2}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Option 3"
                                name="option3"
                                value={formData.option3}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Option 4"
                                name="option4"
                                value={formData.option4}
                                onChange={handleInputChange}
                            />
                            <div className="my-4">
                                <label className="block">Select Number of Questions (5-20):</label>
                                <select
                                    value={totalQuestions}
                                    onChange={handleSelectChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    {Array.from({ length: 16 }, (_, index) => (
                                        <option key={index} value={index + 5}>
                                            {index + 5}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>
                                    next
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Display Questions */}
                {questions.length > 0 && (
                    <div>
                        <table className="table-auto w-full border-collapse border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Question</th>
                                    <th className="border border-gray-300 px-4 py-2">Answer</th>
                                    <th className="border border-gray-300 px-4 py-2">Option 1</th>
                                    <th className="border border-gray-300 px-4 py-2">Option 2</th>
                                    <th className="border border-gray-300 px-4 py-2">Option 3</th>
                                    <th className="border border-gray-300 px-4 py-2">Option 4</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">{q.question}</td>
                                        <td className="border border-gray-300 px-4 py-2">{q.answer}</td>
                                        <td className="border border-gray-300 px-4 py-2">{q.option1}</td>
                                        <td className="border border-gray-300 px-4 py-2">{q.option2}</td>
                                        <td className="border border-gray-300 px-4 py-2">{q.option3}</td>
                                        <td className="border border-gray-300 px-4 py-2">{q.option4}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </AdminNavbar>
        </>
    );
};

export default AddQuestionPage

