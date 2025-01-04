import React, { useState } from "react";

function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen">
            {/* Top Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-gray-800 text-white flex items-center justify-between px-4 py-3 lg:hidden">
                <h1 className="text-lg font-bold">PBAQ(QUIZ_SYS)</h1>
                <button
                    className="text-white"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 bottom-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } w-64 bg-gray-800 text-white transition-transform duration-300 lg:translate-x-0`}
            >
                <div className="flex items-center justify-between px-4 py-4">
                    <h1 className="text-lg font-bold">PBAQ(QUIZ_SYS)</h1>
                    <button
                        className="text-gray-400 hover:text-white lg:hidden"
                        onClick={toggleSidebar}
                        aria-label="Close sidebar"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <nav className="mt-4">
                    {[
                        { label: "Dashboard", icon: "M3 10h11M9 21V3M21 10h-6m0 0v11" },
                        { label: "Category", icon: "M5 5h14M5 12h14m-7 7h7" },
                        { label: "Manage Exam", icon: "M8 16H4a1 1 0 01-1-1V9a1 1 0 011-1h4m12 12h-4a1 1 0 01-1-1V9a1 1 0 011-1h4m-6 0h6m-6 0h-6" },
                        { label: "Students", icon: "M3 10h11M9 21V3M21 10h-6m0 0v11" },
                        { label: "Registered Students", icon: "M3 10h11M9 21V3M21 10h-6m0 0v11" },
                        { label: "Logout", icon: "M6 18L18 6M6 6l12 12" },
                    ].map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className="flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d={item.icon}
                                />
                            </svg>
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}

export default Navbar;
