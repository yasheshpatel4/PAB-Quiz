import AdminNavbar from "../NavBar/AdminNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import StudentUpload from "./StudentUpload";
import { Search, Upload, Trash2, Edit2, AlertCircle, LoaderCircle } from "lucide-react";

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
        const studentsData = Array.isArray(response.data) ? response.data : [];
        setStudents(studentsData);
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

  const filteredStudents = Array.isArray(students)
    ? students.filter((student) => {
      const matchesSearchQuery =
        (student.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (student.rollNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase());

      const matchesSemesterFilter = semesterFilter
        ? student.sem === semesterFilter
        : true;

      return matchesSearchQuery && matchesSemesterFilter;
    })
    : [];

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => setError("")}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(students) || students.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600 font-medium">No students found.</p>
      </div>
    );
  }

  return (
    <AdminNavbar>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-10">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Student Management
              </h1>
              <button
                onClick={toggleUpload}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
              >
                {showUpload ? (
                  <>Back to List</>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Students
                  </>
                )}
              </button>
            </div>

            {!showUpload && (
              <>
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, email, roll number..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[200px]"
                    value={semesterFilter}
                    onChange={(e) => setSemesterFilter(e.target.value)}
                  >
                    <option value="">All Semesters</option>
                    {[...Array(8)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{`Semester ${i + 1}`}</option>
                    ))}
                  </select>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["#", "Name", "Email", "Roll Number", "Semester", "Student ID", "Actions"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={student.studentID}
                          className="hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.sem}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.studentID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(student.studentID)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                title="Edit student"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(student.studentID)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                                title="Delete student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {showUpload && <StudentUpload />}
          </div>
        </div>
      </div>
    </AdminNavbar>
  );
}

export default Students;