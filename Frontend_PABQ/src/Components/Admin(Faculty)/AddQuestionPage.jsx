import { useState, useEffect } from 'react';
import AdminNavbar from '../NavBar/AdminNavbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from './admindashboard/Modal';
import Input from './admindashboard/Input';
import Button from './admindashboard/Button';
import { Trash2, Edit2 } from "lucide-react";

const AddQuestionPage = () => {
    const quizid = localStorage.getItem('quizid');
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null); // Track index for editing
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
    });
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
                setQuestions(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Error fetching quizzes:", err);
            }
        };
        fetchQuiz();
    }, [quizid]);

    const toggleUpload = () => navigate('/admin/');

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (editingIndex !== null) {
            // Update the question instead of adding a new one
            const updatedQuestions = [...questions];
            updatedQuestions[editingIndex] = formData;
            setQuestions(updatedQuestions);
            setEditingIndex(null); // Reset editing mode
        } else {
            setQuestions([...questions, formData]);
        }

        // Reset form
        setFormData({
            question: '',
            answer: '',
            option1: '',
            option2: '',
            option3: '',
            option4: '',
        });
        setShowForm(false);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/auth/admin/addquestion',  questions , {
                params: { quizid },
            });
            alert(response.data);
            navigate('/admin/');
        } catch (error) {
            console.error('Error submitting questions:', error);
            alert('An error occurred while submitting questions.');
        }
    };

    const handleUpload = () => {
        navigate("/admin/addquestion/uploadquestion")
    }

    const handleEdit = (index) => {
        // setFormData(questions[index]); // Load question data into the form
        // setEditingIndex(index);
        // setShowForm(true);
        console.log(index)
        if (!window.confirm('Are you sure you want to updtae this question?')) return;

    };

    const handleDelete = async (questionId) => {
        if (!questionId) {
            console.error("Error: questionId is undefined!");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8080/auth/admin/deletequestion/${questionId}`);
            alert(response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };

    return (
        <AdminNavbar>
            <div className="p-6 bg-gray-50 min-h-screen ml-20">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => {
                            setFormData({
                                question: '',
                                answer: '',
                                option1: '',
                                option2: '',
                                option3: '',
                                option4: '',
                            });
                            setShowForm(true);
                        }}
                        disabled={questions.length >= 20}
                        className={`px-6 py-2 rounded-lg transition duration-300 shadow-md ${questions.length >= 20
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {editingIndex !== null ? "Edit Question" : "Add Question"}
                    </button>

                    <h2 className="text-2xl font-bold text-gray-800">Manage Questions for Quiz ID: {quizid}</h2>

                    <div className="flex space-x-4">
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 shadow-md"
                        >
                            Upload Question
                        </button>

                        <button
                            onClick={toggleUpload}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-300 shadow-md"
                        >
                            Back to List
                        </button>
                    </div>
                </div>

                {showForm && (
                    <Modal title={editingIndex !== null ? "Edit Question" : "Add Question"} handleCloseModal={() => setShowForm(false)}>
                        <form className="space-y-4">
                            <Input label="Question" name="question" value={formData.question} onChange={handleInputChange} />
                            <Input label="Answer" name="answer" value={formData.answer} onChange={handleInputChange} />
                            <Input label="Option 1" name="option1" value={formData.option1} onChange={handleInputChange} />
                            <Input label="Option 2" name="option2" value={formData.option2} onChange={handleInputChange} />
                            <Input label="Option 3" name="option3" value={formData.option3} onChange={handleInputChange} />
                            <Input label="Option 4" name="option4" value={formData.option4} onChange={handleInputChange} />

                            <div className="flex justify-end space-x-4">
                                <Button onClick={() => setShowForm(false)}>Cancel</Button>
                                {questions.length + 1 < totalQuestions ? (
                                    <Button onClick={handleNext}>{editingIndex !== null ? "Update" : `Next (${questions.length + 1}/${totalQuestions})`}</Button>
                                ) : (
                                    <Button onClick={handleSubmit}>Submit</Button>
                                )}
                            </div>
                        </form>
                    </Modal>
                )}

                {/* Display Questions */}
                {questions.length > 0 && (
                    <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2">Question</th>
                                    <th className="px-4 py-2">Answer</th>
                                    <th className="px-4 py-2">Options 1</th>
                                    <th className="px-4 py-2">Options 2</th>
                                    <th className="px-4 py-2">Options 3</th>
                                    <th className="px-4 py-2">Options 4</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.map((q, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-100 transition duration-200">
                                        <td className="px-4 py-2">{q.question}</td>
                                        <td className="px-4 py-2">{q.answer}</td>
                                        <td className="px-4 py-2">{q.option1}</td>
                                        <td className="px-4 py-2">{q.option2}</td> 
                                        <td className="px-4 py-2">{q.option3}</td> 
                                        <td className="px-4 py-2">{q.option4}</td> 
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleEdit(q.questionid)}
                                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                title="Edit question"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q.questionid)}
                                                className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                                                title="Delete question"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminNavbar>
    );
};

export default AddQuestionPage;
