import React from 'react';

const Navbar = ({ toggleSidebar }) => {
    return (
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
    );
};

export default Navbar;
