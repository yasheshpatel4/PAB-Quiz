import  { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [quizResults, setQuizResults] = useState([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    studentID: '',
  });
  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    duration: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const studentsResponse = await axios.get('http://localhost:8080/auth/admin/noofstudents');
      console.log('Fetched Total Students:', studentsResponse.data); 
      setTotalStudents(studentsResponse.data); 
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/admin/addstudent', studentForm);
      setIsStudentModalOpen(false);
      setStudentForm({ name: '', email: '', rollNumber: '', studentID: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/auth/admin/createquiz', quizForm);
      setIsQuizModalOpen(false);
      setQuizForm({ title: '', description: '', duration: '' });
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-20">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Total Students" value={totalStudents} />
        <DashboardCard title="Total Quizzes" value={totalQuizzes} />
        <DashboardCard title="Add Student" action={() => setIsStudentModalOpen(true)} />
        <DashboardCard title="Create Quiz" action={() => setIsQuizModalOpen(true)} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quiz Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizResults.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{result.quizName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.averageScore.toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.participants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isStudentModalOpen && (
        <Modal title="Add Student" onClose={() => setIsStudentModalOpen(false)}>
          <form onSubmit={handleStudentSubmit}>
            <Input
              label="Name"
              name="name"
              value={studentForm.name}
              onChange={(e) => handleInputChange(e, setStudentForm)}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={studentForm.email}
              onChange={(e) => handleInputChange(e, setStudentForm)}
            />
            <Input
              label="Roll Number"
              name="rollNumber"
              value={studentForm.rollNumber}
              onChange={(e) => handleInputChange(e, setStudentForm)}
            />
            <Input
              label="Student ID"
              name="studentID"
              value={studentForm.studentID}
              onChange={(e) => handleInputChange(e, setStudentForm)}
            />
            <Button type="submit">Add Student</Button>
          </form>
        </Modal>
      )}

      {isQuizModalOpen && (
        <Modal title="Create Quiz" onClose={() => setIsQuizModalOpen(false)}>
          <form onSubmit={handleQuizSubmit}>
            <Input
              label="Quiz Title"
              name="title"
              value={quizForm.title}
              onChange={(e) => handleInputChange(e, setQuizForm)}
            />
            <Input
              label="Description"
              name="description"
              value={quizForm.description}
              onChange={(e) => handleInputChange(e, setQuizForm)}
            />
            <Input
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={quizForm.duration}
              onChange={(e) => handleInputChange(e, setQuizForm)}
            />
            <Button type="submit">Create Quiz</Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const DashboardCard = ({ title, value, action }) => (
  <div className="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={action}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {value !== undefined && <p className="text-3xl font-bold text-blue-600">{value}</p>}
    {action && <p className="text-sm text-gray-500 mt-2">Click to {title.toLowerCase()}</p>}
  </div>
);

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, name, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required
    />
  </div>
);

const Button = ({ children, type = "button", onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
  >
    {children}
  </button>
);

export default Dashboard;

