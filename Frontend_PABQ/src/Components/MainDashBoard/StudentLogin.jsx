import { } from 'react'
import EnterNavbar from '../NavBar/EnterNavbar'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const StudentLogin = () => {
  return (
      <>
          <EnterNavbar>
              <Login/>
          </EnterNavbar>
      </>
  )
}

export default StudentLogin

const Login = () => {
    const [email, setEmail] = useState("");
    const [studentId, setStudentId] = useState("");
    const [message, setMessage] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@ddu\.ac\.in$/;
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email");
            return;
        }

        const data = {
            email: email,
            studentID: studentId,
        };

        setMessage("");

        // Login logic
        axios
            .post("http://localhost:8080/auth/student/login", data)
            .then((response) => {
                alert(response.data);
                localStorage.setItem("studentEmail", email);
                localStorage.setItem("studentID", studentId);
                navigate("/student"); // Redirect to student dashboard
                setEmail("");
                setStudentId("");
            })
            .catch((error) => {
                setMessage("Error: " + (error.response?.data || "Login failed"));
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    Student Login
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-300"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="studentId"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Student ID
                        </label>
                        <input
                            type="text"
                            id="studentId"
                            name="studentId"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-300"
                        />
                    </div>

                    {message && (
                        <div className="mb-4 text-center text-red-600 font-medium">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};
