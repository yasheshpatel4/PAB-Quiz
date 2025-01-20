import AdminNavbar from "../NavBar/AdminNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import StudentUpload from "./StudentUpload";

function Students() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/auth/admin/getallstudents");
        setStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to fetch students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleUpdate = (id) => {
    alert(`Update functionality for student ID: ${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/auth/admin/deletestudent/${id}`);
      setStudents(students.filter((student) => student.studentID !== id));
      alert("Student deleted successfully.");
    } catch (err) {
      console.error("Error deleting student:", err.response?.data || err.message);
      setError(err.response?.data || "Failed to delete student. Please try again.");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearchQuery =
      (student.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (student.rollNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesSemesterFilter = semesterFilter 
    ? student.sem === semesterFilter 
    : true;

    return matchesSearchQuery && matchesSemesterFilter;
  });

  const toggleUpload = () => {
    setShowUpload(!showUpload)
  }

  return (
    <>
      <AdminNavbar>
        <div className="container mx-auto p-14">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Student List</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
              {error}
              <button
                onClick={() => setError("")}
                className="ml-4 text-sm text-red-500 hover:underline focus:outline-none"
              >
                Dismiss
              </button>
            </div>
          )}

          {!showUpload && (
            <>
              <div className="mb-4 flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Search by name, email, roll number"
                  className="px-4 py-2 border rounded-lg w-full max-w-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select
                  className="px-4 py-2 border rounded-lg ml-4"
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                >
                  <option value="">All Semesters</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>



              {loading ? (
                <p className="text-gray-600 text-center">Loading...</p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-gray-600 text-center">No students found.</p>
              ) : (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Roll Number
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Semester
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Student ID
                        </th>
                        <th
                          scope="col"
                          className="py-3 px-6 text-left text-sm font-medium text-gray-600 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => (
                        <tr key={student.studentID} className="hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900 text-center">{index + 1}</td>
                          <td className="py-4 px-6 text-sm text-gray-800">{student.name}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{student.email}</td>
                          <td className="py-4 px-6 text-sm text-gray-800">{student.rollNumber}</td>
                          <td className="py-4 px-6 text-sm text-gray-800">{student.sem}</td>
                          <td className="py-4 px-6 text-sm text-gray-800">{student.studentID}</td>
                          <td className="py-4 px-6 text-sm flex items-center space-x-4">
                            <button
                              onClick={() => handleUpdate(student.studentID)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => handleDelete(student.studentID)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={toggleUpload}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {showUpload ? "Back to Student List" : "Upload Students"}
            </button>
          </div>

          {showUpload && <StudentUpload />}
        </div>
      </AdminNavbar>
    </>
  );
}

export default Students;
