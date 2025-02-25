import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const EnterNavbar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const links = [
        { path: "/adminlogin", label: "Faculty" },
        { path: "/studentlogin", label: "Student" },
    ];

    return (
        <div className="flex h-screen">
            <div
                className={`fixed inset-y-0 left-0 bg-gray-800 text-white transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 transition-transform duration-300 w-64 z-50`}
            >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-900 md:block">
                    <h1 className="text-lg font-bold">PAB-QUIZ</h1>
                    <button
                        className="text-white text-2xl md:hidden"
                        onClick={toggleNavbar}
                    >
                        ✕
                    </button>
                </div>
                <nav className="mt-6 space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-2 transition ${location.pathname === link.path
                                    ? "bg-gray-700 text-white"
                                    : "hover:bg-gray-700 hover:text-white"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            <button
                className="text-2xl p-3 text-gray-800 md:hidden fixed top-4 left-4 z-50"
                onClick={toggleNavbar}
            >
                ☰
            </button>
            <div className="flex-1 md:ml-2 w-full">
                {children}
            </div>
        </div>
    );
};

export default EnterNavbar;

