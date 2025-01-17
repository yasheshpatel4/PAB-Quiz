import { useState , useEffect} from "react";
import axios from "axios";
import AdminNavbar from "../NavBar/AdminNavbar";
import { } from "./Students";

function AdminDashBoard() {
    const [student, setStudent] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentData, setStudentData] = useState([]);
    const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
    const [numberOfStudents, setNumberOfStudents] = useState(1);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTotalStudents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/auth/admin/noofstudents");
                setStudent(response.data); 
            } catch (err) {
                console.error("Error fetching total students:", err);
            } finally {
                setIsLoading(false); // Stop loading state
            }
        };

        fetchTotalStudents();
    }, [])

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setStudentData(Array.from({ length: numberOfStudents }, () => ({
            name: "",
            email: "",
            rollNumber: "",
            studentID: ""
        })));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setError("");
        setStudentData([]);
        setCurrentStudentIndex(0);
    };

    const handleStudentChange = (e) => {
        const { name, value } = e.target;
        setStudentData((prevData) => {
            const updatedData = [...prevData];
            if (!updatedData[currentStudentIndex]) {
                updatedData[currentStudentIndex] = { name: "", email: "", rollNumber: "", studentID: "" };
            }
            updatedData[currentStudentIndex][name] = value;
            return updatedData;
        });
    };

    const handleNumberChange = (e) => {
        const newNumber = Number(e.target.value);
        setNumberOfStudents(newNumber);
        setStudentData((prevData) => {
            const newData = Array.from({ length: newNumber }, (_, index) => {
                return prevData[index] || { name: "", email: "", rollNumber: "", studentID: "" };
            });
            return newData;
        });
    };

    const handleNext = async () => {
        const currentData = studentData[currentStudentIndex];
        const emailRegex = /^[a-zA-Z0-9._%+-]+@ddu.ac\.in$/;

        if (!currentData.name || !currentData.rollNumber || !emailRegex.test(currentData.email)) {
            setError("Please fill all fields correctly before proceeding.");
            return;
        }

        setError("");
        if (currentStudentIndex < numberOfStudents - 1) {
            setCurrentStudentIndex(currentStudentIndex + 1);
        } else {
            try {
                const response = await axios.post("http://localhost:8080/auth/admin/addstudentdata", studentData);
                console.log("Students added:", response.data);
                setStudent((prev) => prev + numberOfStudents);
                handleCloseModal();
            } catch (err) {
                console.error("Error adding students:", err);
                setError("Error adding students. Please try again.");
            }
        }
    };

    return (
        <AdminNavbar>
            <div className="container mx-auto p-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className="bg-white rounded-lg shadow-lg p-6 transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl cursor-pointer"
                        onClick={handleOpenModal}
                    >
                        <h3 className="font-semibold text-xl">Total Students :  {isLoading ? "" : student}</h3>
                        <p className="mt-2 text-gray-600">Add and manage student details</p>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                            <h3 className="font-semibold text-lg mb-4">Add Students</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Number of Students
                                </label>
                                <select
                                    value={numberOfStudents}
                                    onChange={handleNumberChange}
                                    className="w-full border rounded-lg p-2"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <form>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Student Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={studentData[currentStudentIndex]?.name || ""}
                                        onChange={handleStudentChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Student ID
                                    </label>
                                    <input
                                        type="text"
                                        name="studentID"
                                        value={studentData[currentStudentIndex]?.studentID || ""}
                                        onChange={handleStudentChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Roll Number
                                    </label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={studentData[currentStudentIndex]?.rollNumber || ""}
                                        onChange={handleStudentChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={studentData[currentStudentIndex]?.email || ""}
                                        onChange={handleStudentChange}
                                        className="w-full border rounded-lg p-2"
                                        required
                                    />
                                    {error && (
                                        <p className="text-red-500 text-sm mt-1">{error}</p>
                                    )}
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        {currentStudentIndex < numberOfStudents - 1
                                            ? "Next"
                                            : "Finish"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminNavbar>
    );
}

export default AdminDashBoard;
