import { useState, useEffect } from "react";
import StudentNavbar from "../NavBar/StudentNavbar";
import axios from "axios";
import { Search } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function Exam() {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [averageScore, setAverageScore] = useState(0);
  const [overallImprovement, setOverallImprovement] = useState(0);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get("http://13.232.135.2:8080/api/students/completedquiz", {
          params: {
            studentEmail: localStorage.getItem("studentEmail"),
            studentID: localStorage.getItem("studentID"),
          },
        });
        setExams(response.data);
        calculateAverageAndImprovement(response.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, []);

  const calculateAverageAndImprovement = (examData) => {
    const convertToPercentage = (score) => {
      const maxScore = 15;
      return (Number.parseFloat(score) / maxScore) * 100;
    };

    const examDataWithPercentage = examData.map((examString) => {
      const examObject = Object.fromEntries(
        examString.split(", ").map((item) => {
          const [key, value] = item.split(": ");
          return [key, isNaN(value) ? value : Number(value)];
        })
      );
      return {
        ...examObject,
        ScorePercentage: convertToPercentage(examObject.Score),
      };
    });

    // Calculate average score
    const avgScore =
      examDataWithPercentage.length > 0
        ? (examDataWithPercentage.reduce((sum, exam) => sum + exam.ScorePercentage, 0) /
          examDataWithPercentage.length).toFixed(2)
        : 0;

    setAverageScore(avgScore);

    // Calculate overall improvement
    if (examDataWithPercentage.length > 1) {
      const firstTwoQuizzes = examDataWithPercentage.slice(0, 2);
      const avgFirstTwo = firstTwoQuizzes.reduce((sum, exam) => sum + exam.ScorePercentage, 0) / firstTwoQuizzes.length;

      const lastTwoQuizzes = examDataWithPercentage.slice(-2);
      const avgLastTwo = lastTwoQuizzes.reduce((sum, exam) => sum + exam.ScorePercentage, 0) / lastTwoQuizzes.length;

      const improvement = (avgLastTwo - avgFirstTwo).toFixed(2);
      setOverallImprovement(improvement);
    }
  };

  const filteredExams = exams.filter((exam) =>
    exam.toLowerCase().includes(search.toLowerCase())
  );

  // Prepare data for charts
  const chartData = exams.map((examString, index) => {
    const examObject = Object.fromEntries(
      examString.split(", ").map((item) => {
        const [key, value] = item.split(": ");
        return [key, isNaN(value) ? value : Number(value)];
      })
    );
    return {
      ...examObject,
      ScorePercentage: ((examObject.Score / 15) * 100).toFixed(2),
      quiz: `Quiz ${index + 1}`,
    };
  });

  // Calculate subject improvements
  const calculateSubjectImprovements = () => {
    const subjectScores = {};

    chartData.forEach((exam) => {
      if (!subjectScores[exam.Subject]) {
        subjectScores[exam.Subject] = [];
      }
      subjectScores[exam.Subject].push(exam.ScorePercentage);
    });

    return Object.entries(subjectScores).map(([subject, scores]) => {
      const improvement = scores.length > 1 ? scores[scores.length - 1] - scores[0] : scores[0];
      const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      return { subject, improvement, averageScore };
    });
  };

  const subjectImprovements = calculateSubjectImprovements();

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
                  </tr>
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
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExams.length > 0 ? (
                    filteredExams.map((examString, index) => {
                      const examObject = Object.fromEntries(
                        examString.split(", ").map((item) => {
                          const [key, value] = item.split(": ");
                          return [key, isNaN(value) ? value : Number(value)];
                        })
                      );
                      return (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          {Object.values(examObject).map((value, idx) => (
                            <td key={idx} className="px-6 py-4 border border-gray-300">
                              <div className="text-sm font-medium text-gray-900">{value}</div>
                            </td>
                          ))}
                        </tr>
                      );
                    })
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

              {/* Average score and overall improvement */}
              <div className="mt-6 flex justify-between items-center">
                <div className="bg-indigo-50 rounded-lg p-4 w-1/2 mr-4">
                  <p className="text-sm font-medium text-indigo-600">Average Score</p>
                  <p className="mt-1 text-3xl font-semibold text-indigo-900">{averageScore}%</p>
                </div>
                <div
                  className={`${Number(overallImprovement) >= 0 ? "bg-green-50" : "bg-red-50"
                    } rounded-lg p-4 w-1/2`}
                >
                  <p className="text-sm font-medium text-gray-600">Overall Improvement</p>
                  <p
                    className={`mt-1 text-3xl font-semibold ${Number(overallImprovement) >= 0 ? "text-green-900" : "text-red-900"
                      }`}
                  >
                    {overallImprovement}%
                  </p>
                </div>
              </div>

              {/* Graphs Section */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Score Progression */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Progression</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quiz" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="ScorePercentage"
                            name="Score (%)"
                            stroke="#4F46E5"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Subject Improvement */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject Improvement</h2>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectImprovements}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="improvement" fill="#4F46E5" name="Improvement %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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
