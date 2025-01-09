import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";  // Outlet for nested routes
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

function AdminDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default
    const [selectedItem, setSelectedItem] = useState("Dashboard"); // Set default selected item

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item); // Set the clicked item as selected
    };

    return (
        <div className="flex h-screen">
            
            {/* Top Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedItem={selectedItem}
        handleItemClick={handleItemClick}
      />

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main content area with Outlet */}
            <div className="flex-1 p-10">
                <Outlet /> {/* Render the matched child route here */}
            </div>
        </div>
    );
}

export default AdminDashboard;
