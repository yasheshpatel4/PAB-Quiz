import React, { useState } from "react";
import { Link } from "react-router-dom";
import Defaultquiz from "./Defaultquiz";

function Home() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState("Dashboard");

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
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
                        {[{ label: "Dashboard", icon: "M3 10h11M9 21V3M21 10h-6m0 0v11"  },
                        { label: "Admin", icon: "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM19 12l1.5-2.5-2.5-1.5L17 7l-1.5 2.5-2.5-1.5L12 7l-1.5 2.5-2.5-1.5L7 7l-1.5 2.5-2.5-1.5L5 12l-1.5 2.5 2.5 1.5L7 17l1.5-2.5 2.5 1.5L12 17l1.5-2.5 2.5 1.5L17 17l1.5-2.5L19 12z" },
                        { label: "Student", icon: "M8 16H4a1 1 0 01-1-1V9a1 1 0 011-1h4m12 12h-4a1 1 0 01-1-1V9a1 1 0 011-1h4m-6 0h6m-6 0h-6" }].map((item, index) => (
                            <Link
                                key={index}
                                to={`/${item.label.toLowerCase()}`} 
                                className={`flex items-center px-4 py-2 text-gray-200 hover:bg-gray-700 ${selectedItem === item.label ? "bg-gray-700" : ""}`}
                                onClick={() => handleItemClick(item.label)} 
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
                            </Link>
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

                {/* Main content area where components will be rendered */}

                <div className="flex-1 p-1 ml-28 mt-10 ">
                    <Defaultquiz />
                </div>
            
            </div>

    );
}

export default Home;
