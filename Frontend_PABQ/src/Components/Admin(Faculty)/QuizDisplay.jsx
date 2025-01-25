import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../NavBar/AdminNavbar';
import { AlertCircle, LoaderCircle, Trash2, Edit2 } from 'lucide-react';

const QuizDisplay = () => {
  const [quiz, setQuiz] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/admin/getallquiz');
        const quizdata = Array.isArray(response.data) ? response.data : [];
        setQuiz(quizdata);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to fetch quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, []);

  const handleUpdate = (id) => {
    alert(`Update functionality for quiz ID: ${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/auth/admin/deletequiz/${id}`);
      setQuiz(quiz.filter((quiz) => quiz.Quizid !== id));
      alert('Quiz deleted successfully.');
    } catch (err) {
      console.error('Error deleting quiz:', err.response?.data || err.message);
      setError(err.response?.data || 'Failed to delete quiz. Please try again.');
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
            onClick={() => setError('')}
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
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Quiz ID', 'Subject', 'Semester', 'Duration', 'Description', 'Actions'].map((header) => (
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
              <tr
                key={item.Quizid} // Ensures each child in the list has a unique key
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.Quizid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizSubject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizSem}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizDuration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.QuizDescription}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(item.Quizid)}
                      className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      title="Edit quiz"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.Quizid)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                      title="Delete quiz"
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
