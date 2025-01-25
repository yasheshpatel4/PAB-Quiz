import { } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from "../NavBar/AdminNavbar";
import axios from 'axios'; 

function LogOut() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Correct API endpoint for logout
            const response = await axios.post('http://localhost:8080/auth/admin/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert(response.data);
            // Clear localStorage after successful logout
            localStorage.removeItem('token');
            localStorage.removeItem("adminEmail");

            // Redirect to login page after successful logout
            navigate('/adminlogin');
        } catch (error) {
            console.error('Logout failed', error);
            alert('Logout failed, please try again.');
        }
    };


    return (
        <>
            <AdminNavbar>
                <button
                    onClick={handleLogout}
                    className="ml-32 mt-20 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 active:scale-95"
                >
                    Logout
                </button>
            </AdminNavbar>
        </>
    );
}

export default LogOut;