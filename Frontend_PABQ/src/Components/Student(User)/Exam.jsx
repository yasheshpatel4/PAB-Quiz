import { useState, useEffect } from "react";
import StudentNavbar from "../NavBar/StudentNavbar";
import axios from "axios";
import { Search } from "lucide-react";

function Exam() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/students/completedquiz", {
          params: {
            studentEmail: localStorage.getItem("studentEmail"),
            studentID: localStorage.getItem("studentID")
          }
        });
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) =>
    exam.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentNavbar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Exams</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64 text-sm"
                />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Exam Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {exam}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-emerald-600 hover:text-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                            View {exam.includes("Finished") ? "Result" : "Details"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                        No exams found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="bg-white px-4 py-3 border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{filteredExams.length}</span> of{" "}
                    <span className="font-medium">{exams.length}</span> entries
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-emerald-500 rounded-md text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600">
                      1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;