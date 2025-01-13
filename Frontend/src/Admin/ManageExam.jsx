import  { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/Navbar';

function ManageExam() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState("Category");

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <div className="flex h-screen">
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                selectedItem={selectedItem}
                handleItemClick={handleItemClick}
            />
            <div className="flex-1 p-10">
                <h1 className="text-2xl font-bold">Mange Page</h1>
                <p className="mt-4">This is the content for the Category page.</p>
            </div>
        </div>
    );
}

export default ManageExam;
