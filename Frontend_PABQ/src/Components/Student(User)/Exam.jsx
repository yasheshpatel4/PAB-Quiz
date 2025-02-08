import { useState, useEffect } from "react";
import StudentNavbar from "../NavBar/StudentNavbar";
import axios from "axios";

function Exam() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    const fetchExams = async () => {
      try {

        const response = await axios.get("http://localhost:8080/api/students/allquiz", {
          params: { studentEmail: localStorage.getItem("studentEmail"), studentID: localStorage.getItem("studentID") }

        });
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  // Filter exams based on search input
  const filteredExams = exams.filter((exam) => 
    // exam.QuizDescription.toLowerCase().includes(search.toLowerCase())
    exam.QuizSubject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <StudentNavbar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">Exams</h1>
              <div className="flex space-x-2">
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Exam Table */}
            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                      <tr key={exam.quizid}>
                        <td className="px-6 py-4 whitespace-nowrap">{exam.QuizSubject}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{exam.QuizDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${exam.status === "Finished" ? "bg-green-100 text-green-800" :
                                exam.status === "Pending" ? "bg-red-100 text-red-800" :
                                  "bg-red-200 text-gray-800"}`}>
                            {exam.status || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-emerald-600 hover:text-emerald-900">View {exam.status === "Finished" ? "Result" : "Details"}</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No exams found</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination (Static for now) */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-gray-700">
                    Showing {filteredExams.length} of {exams.length} entries
                  </p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-sm">Previous</button>
                    <button className="px-3 py-1 border rounded text-sm bg-emerald-500 text-white">1</button>
                    <button className="px-3 py-1 border rounded text-sm">Next</button>
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
