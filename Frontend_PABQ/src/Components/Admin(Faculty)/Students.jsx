import AdminNavbar from "../NavBar/AdminNavbar";
import { useEffect, useState } from "react";
import axios from "axios";

function Students() {
    const [students, setStudents] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://localhost:8080/auth/admin/getallstudents");
                setStudents(response.data);
            } catch (err) {
                console.error("Error fetching students:", err);
                setError("Failed to fetch students. Please try again later.");
            }
        };
        fetchStudents();
    }, []);

    return (
        <>
            <AdminNavbar>
                <div className="container mx-auto p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">#</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Roll Number</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Student ID</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student, index) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800">{student.name}</td>
                                        <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800">{student.rollNumber}</td>
                                        <td className="py-4 px-6 text-sm text-gray-800">{student.studentID}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AdminNavbar>
        </>
    );
}

export default Students;
