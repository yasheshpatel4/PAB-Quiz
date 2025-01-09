import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignup = () => {
    const [isSignup, setIsSignup] = useState(false); 
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            name: name,
            email: email,
            password: password,
        };

        if (isSignup) {
            
            axios
                .post('http://localhost:8080/auth/signup', data)
                .then((response) => {
                    const isConfirmed = window.confirm("Signup successful");
                    if (isConfirmed) {
                        navigate("/admin/dashboard");
                    }
                })
                .catch((error) => {
                    alert('Error: ' + error.response?.data || 'Something went wrong');
                });
        } else {
           
            axios
                .post('http://localhost:8080/auth/login', data)
                .then((response) => {
                    localStorage.setItem("authToken", response.data.token);
                    const isConfirmed = window.confirm("Signup successful");
                    if (isConfirmed) {
                        navigate("/admin/dashboard");
                    }
                })
                .catch((error) => {
                    alert('Error: ' + error.response?.data || 'Login failed');
                });
        }


    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isSignup ? "Faculty Sign Up" : "Faculty Login"}
                </h2>

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>

                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSignup(!isSignup)}
                            className="text-blue-500 hover:underline"
                        >
                            {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginSignup;