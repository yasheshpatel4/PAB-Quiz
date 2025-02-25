"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import AdminNavbar from "../NavBar/AdminNavbar"
import axios from "axios"
import { Search, AlertCircle, LoaderCircle } from "lucide-react"
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

function StudentScorePage() {
    const { id, email } = useParams()
    const [exams, setExams] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchStudentExams = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/students/completedquiz", {
                    params: {
                        studentEmail: email,
                        studentID: id,
                    },
                })
                setExams(response.data)
                setLoading(false)
            } catch (error) {
                console.error("Error fetching student exams:", error)
                setError("Failed to fetch student exams. Please try again later.")
                setLoading(false)
            }
        }

        fetchStudentExams()
    }, [id, email])

    const filteredExams = exams.filter((exam) => exam.toLowerCase().includes(search.toLowerCase()))

    // Convert score to percentage and calculate average
    const convertToPercentage = (score) => {
        // Assuming the maximum score is 100. Adjust this if your maximum score is different.
        const maxScore = 15
        return (Number.parseFloat(score) / maxScore) * 100
    }

    const examData = exams.map((examString) => {
        const examObject = Object.fromEntries(
            examString.split(", ").map((item) => {
                const [key, value] = item.split(": ")
                return [key, isNaN(value) ? value : Number(value)]
            }),
        )
        return {
            ...examObject,
            ScorePercentage: convertToPercentage(examObject.Score),
        }
    })

    // Calculate average score
    const averageScore =
        examData.length > 0
            ? (examData.reduce((sum, exam) => sum + exam.ScorePercentage, 0) / examData.length).toFixed(2)
            : 0

    // Calculate overall improvement
    const overallImprovement =
        examData.length > 1
            ? (() => {
                // Calculate average score of the first two quizzes
                const firstTwoQuizzes = examData.slice(0, 2)
                const avgFirstTwo = firstTwoQuizzes.reduce((sum, exam) => sum + exam.ScorePercentage, 0) / firstTwoQuizzes.length

                // Calculate average score of the last two quizzes
                const lastTwoQuizzes = examData.slice(-2)
                const avgLastTwo = lastTwoQuizzes.reduce((sum, exam) => sum + exam.ScorePercentage, 0) / lastTwoQuizzes.length

                // Improvement is the difference between the average score of the last two quizzes and the first two quizzes
                return (avgLastTwo - avgFirstTwo).toFixed(2)
            })()
            : 0



    // Prepare data for charts
    const chartData = examData.map((exam, index) => ({
        ...exam,
        quiz: `Quiz ${index + 1}`,
    }))

    // Calculate subject improvements
    const calculateSubjectImprovements = () => {
        const subjectScores = {}

        // Group quiz scores by subject
        examData.forEach((exam) => {
            if (!subjectScores[exam.Subject]) {
                subjectScores[exam.Subject] = []
            }
            subjectScores[exam.Subject].push(exam.ScorePercentage)
        })

        // Calculate improvement and average score for each subject
        return Object.entries(subjectScores).map(([subject, scores]) => {
            const improvement = scores.length > 1
                ? scores[scores.length - 1] - scores[0]  // Difference between the last and first score
                : scores[0]  // If there's only one score, use that as the improvement
            const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

            return { subject, improvement, averageScore }
        })
    }



    const subjectImprovements = calculateSubjectImprovements()

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNavbar />
                <div className="ml-64 flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
                        <p className="text-gray-600 font-medium">Loading student exams...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-100">
                <AdminNavbar />
                <div className="ml-64 flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <AlertCircle className="w-6 h-6" />
                            <h2 className="text-lg font-semibold">Error</h2>
                        </div>
                        <p className="text-gray-600 mb-4">{error}</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminNavbar />
            <div className="ml-64 flex-1 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Student's Performance:
                        </h1>
                        <Link
                            to="/admin/students"
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

                    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                        <div className="px-4 py-5 sm:p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Scores</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full text-sm mb-4"
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score (%)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredExams.length > 0 ? (
                                            filteredExams.map((examString, index) => {
                                                const examObject = Object.fromEntries(
                                                    examString.split(", ").map((item) => {
                                                        const [key, value] = item.split(": ")
                                                        return [key, isNaN(value) ? value : Number(value)]
                                                    }),
                                                )
                                                const scorePercentage = convertToPercentage(examObject.Score).toFixed(2)
                                                return (
                                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                        {Object.entries(examObject).map(([key, value], idx) => (
                                                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {value}
                                                            </td>
                                                        ))}
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{scorePercentage}%</td>
                                                    </tr>
                                                )
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    No exams found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentScorePage

