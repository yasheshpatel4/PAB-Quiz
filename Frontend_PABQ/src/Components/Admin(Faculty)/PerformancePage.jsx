import { } from "react"
import { useParams, Link } from "react-router-dom"
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
} from "recharts"
import AdminNavbar from "../NavBar/AdminNavbar"

// Modified data structure with multiple quizzes per subject
const studentsData = {
    1: {
        name: "Alice",
        scores: [
            { quiz: "Quiz 1", subject: "Language_Translator", score: 85 },
            { quiz: "Quiz 2", subject: "Operating_System", score: 82 },
            { quiz: "Quiz 3", subject: "Software_Engineering", score: 90 },
            { quiz: "Quiz 4", subject: "Data_Structures", score: 94 },
            { quiz: "Quiz 5", subject: "Algorithms", score: 92 },
            { quiz: "Quiz 6", subject: "Language_Translator", score: 88 },
            { quiz: "Quiz 7", subject: "Operating_System", score: 85 },
            { quiz: "Quiz 8", subject: "Software_Engineering", score: 93 },
            { quiz: "Quiz 9", subject: "Data_Structures", score: 96 },
            { quiz: "Quiz 10", subject: "Algorithms", score: 95 },
            { quiz: "Quiz 11", subject: "Language_Translator", score: 91 },
            { quiz: "Quiz 12", subject: "Operating_System", score: 88 },
            { quiz: "Quiz 13", subject: "Software_Engineering", score: 95 },
            { quiz: "Quiz 14", subject: "Data_Structures", score: 98 },
            { quiz: "Quiz 15", subject: "Algorithms", score: 97 },
        ],
    },
    2: {
        name: "Bob",
        scores: [
            { quiz: "Quiz 1", subject: "Language_Translator", score: 75 },
            { quiz: "Quiz 2", subject: "Operating_System", score: 70 },
            { quiz: "Quiz 3", subject: "Software_Engineering", score: 65 },
            { quiz: "Quiz 4", subject: "Data_Structures", score: 60 },
            { quiz: "Quiz 5", subject: "Algorithms", score: 55 },
            { quiz: "Quiz 6", subject: "Language_Translator", score: 78 },
            { quiz: "Quiz 7", subject: "Operating_System", score: 72 },
            { quiz: "Quiz 8", subject: "Software_Engineering", score: 68 },
            { quiz: "Quiz 9", subject: "Data_Structures", score: 63 },
            { quiz: "Quiz 10", subject: "Algorithms", score: 58 },
            { quiz: "Quiz 11", subject: "Language_Translator", score: 80 },
            { quiz: "Quiz 12", subject: "Operating_System", score: 75 },
            { quiz: "Quiz 13", subject: "Software_Engineering", score: 70 },
            { quiz: "Quiz 14", subject: "Data_Structures", score: 65 },
            { quiz: "Quiz 15", subject: "Algorithms", score: 60 },
        ],
    },
}

const PerformancePage = () => {
    const { id } = useParams()
    const student = studentsData[id]

    if (!student) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-2xl font-bold text-gray-700">Student not found</div>
            </div>
        )
    }

    // Calculate improvement for each subject
    const calculateSubjectImprovements = () => {
        const subjectScores = {}
        student.scores.forEach((quiz) => {
            if (!subjectScores[quiz.subject]) {
                subjectScores[quiz.subject] = []
            }
            subjectScores[quiz.subject].push(quiz.score)
        })

        return Object.entries(subjectScores).map(([subject, scores]) => {
            const improvement = ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
            return { subject, improvement, averageScore }
        })
    }

    const subjectImprovements = calculateSubjectImprovements()
    const averageScore = (student.scores.reduce((sum, quiz) => sum + quiz.score, 0) / student.scores.length).toFixed(2)

    const overallImprovement = (
        ((student.scores[student.scores.length - 1].score - student.scores[0].score) / student.scores[0].score) *
        100
    ).toFixed(2)

    return (
        <AdminNavbar>
    <div className="ml-64 min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">{student.name}'s Performance</h1>
          <Link
            to="/admin/performance"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out"
          >
            ← Back to Student List
          </Link>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <p className="text-sm font-medium text-indigo-600 truncate">Average Score</p>
                <p className="mt-1 text-3xl font-semibold text-indigo-900">{averageScore}%</p>
              </div>
              <div className={`${Number(overallImprovement) >= 0 ? "bg-green-50" : "bg-red-50"} rounded-lg p-4`}>
                <p className="text-sm font-medium text-gray-600 truncate">Overall Improvement</p>
                <p
                  className={`mt-1 text-3xl font-semibold ${Number(overallImprovement) >= 0 ? "text-green-900" : "text-red-900"}`}
                >
                  {overallImprovement}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Progression</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={student.scores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quiz" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

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

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Subject-wise Performance</h2>
            <div className="space-y-4">
              {subjectImprovements.map((subject) => (
                <div key={subject.subject} className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-medium text-gray-900">{subject.subject.replace(/_/g, " ")}</h3>
                  <p className="text-gray-600">Average Score: {subject.averageScore.toFixed(2)}%</p>
                  <p className={`${subject.improvement >= 0 ? "text-green-600" : "text-red-600"}`}>
                    Overall Improvement: {subject.improvement.toFixed(2)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div >
      </div >
    </div >
        </AdminNavbar >
  )
}

export default PerformancePage