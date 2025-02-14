import StudentNavbar from "../NavBar/StudentNavbar"
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout() {

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/students/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert(response.data);
            localStorage.removeItem('token');
            localStorage.removeItem("studentEmail");
            localStorage.removeItem("studentID")
            navigate('/studentlogin');
        } catch (error) {
            console.error('Logout failed', error);
            alert('Logout failed, please try again.');
        }
    };

  return (
      <>
          <StudentNavbar>
              <button
                  onClick={handleLogout}
                  className="ml-32 mt-20 px-6 py-3 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 active:scale-95"
              >
                  Logout
              </button>
          </StudentNavbar>
      </>
  )
}

export default Logout
