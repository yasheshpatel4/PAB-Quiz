import  { useState } from 'react';
import { Lock, Mail, School, User } from 'lucide-react';
import EnterNavbar from '../NavBar/EnterNavbar';

const StudentLogin = () => {
    const [activeTab, setActiveTab] = useState('student');
    const [userMode, setUserMode] = useState('login');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        collegeId: '',
        name: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeTab === 'user' && userMode === 'signup' &&
            formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log(formData);
    };

    return (
        <>
        <EnterNavbar>
        <div className="min-h-screen  flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="flex">
                    <button
                        onClick={() => {
                            setActiveTab('student');
                            setUserMode('login');
                        }}
                        className={`w-1/2 py-4 text-lg font-semibold transition-colors ${activeTab === 'student'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        Student
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('user');
                            setUserMode('login');
                        }}
                        className={`w-1/2 py-4 text-lg font-semibold transition-colors ${activeTab === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                    >
                        User
                    </button>
                </div>

                {activeTab === 'user' && (
                    <div className="flex">
                        <button
                            onClick={() => setUserMode('login')}
                            className={`w-1/2 py-3 text-md transition-colors ${userMode === 'login'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setUserMode('signup')}
                            className={`w-1/2 py-3 text-md transition-colors ${userMode === 'signup'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            Signup
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {activeTab === 'user' && userMode === 'signup' && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {activeTab === 'student' && (
                        <div className="relative">
                            <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="collegeId"
                                placeholder="College ID"
                                value={formData.collegeId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {activeTab === 'user' && userMode === 'signup' && (
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                        {activeTab === 'student' ? 'Student Login' :
                            userMode === 'login' ? 'User Login' :
                                'Sign Up'}
                    </button>

                </form>
            </div>
            </div>
            </EnterNavbar>
        </>
    );
};

export default StudentLogin;