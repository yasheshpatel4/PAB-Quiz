import EnterNavbar from "../NavBar/EnterNavbar";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLoginAndSignup() {
    return (
        <>
            <EnterNavbar>
                <LoginSignup />
            </EnterNavbar>
        </>
    );
}

export default AdminLoginAndSignup;

const LoginSignup = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+\.it@ddu\.ac\.in$/;
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email");
            return;
        }

        const data = {
            name: name,
            email: email,
            password: password,
        };

        setMessage("");

        if (isSignup) {
            // Sign up logic
            axios
                .post("http://localhost:8080/auth/admin/signup", data)
                .then((response) => {
                    alert(response.data);
                    setName("");
                    setEmail("");
                    setPassword("");
                })
                .catch((error) => {
                    setMessage("Error: " + (error.response?.data || "Something went wrong"));
                });
        } else {
            // Login logic
            axios
                .post("http://localhost:8080/auth/admin/login", data)
                .then((response) => {
                    alert(response.data);
                    // Save admin email in localStorage
                    localStorage.setItem("adminEmail", email);
                    navigate("/admin"); // Redirect to admin dashboard
                    setName("");
                    setEmail("");
                    setPassword("");
                })
                .catch((error) => {
                    setMessage("Error: " + (error.response?.data || "Login failed"));
                });
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">
                <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                    {isSignup ? "Faculty Sign Up" : "Faculty Login"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold text-gray-700"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-300"
                            />
                        </div>
                    )}

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

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>

                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            {isSignup
                                ? "Already have an account? Log In"
                                : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
