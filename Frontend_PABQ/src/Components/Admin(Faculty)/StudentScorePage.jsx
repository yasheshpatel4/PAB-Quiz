"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import AdminNavbar from "../NavBar/AdminNavbar"
import axios from "axios"
import { Search, AlertCircle, LoaderCircle, ArrowLeft, Award, BookOpen, TrendingUp, TrendingDown, PieChartIcon } from 'lucide-react'
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
  PieChart,
  Pie,
  Cell,
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
    isCurrent: index === examData.length - 1
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

  // Prepare data for pie chart
  const preparePieData = () => {
    if (examData.length === 0) return []

    // Get the latest exam
    const latestExam = examData[examData.length - 1]
    
    const correct = latestExam.Score
    const incorrect = 15 - latestExam.Score // Assuming max score is 15

    return [
      { name: "Correct", value: correct },
      { name: "Incorrect", value: incorrect }
    ]
  }

  const pieData = preparePieData()
  const COLORS = ["#4F46E5", "#EF4444"]

  // Calculate strengths and weaknesses
  const calculateStrengthsAndWeaknesses = () => {
    if (subjectImprovements.length === 0) return { strengths: [], weaknesses: [] }

    // Sort by average score
    const sortedSubjects = [...subjectImprovements].sort((a, b) => b.averageScore - a.averageScore)
    
    return {
      strengths: sortedSubjects.slice(0, Math.min(2, sortedSubjects.length)),
      weaknesses: sortedSubjects.slice(-Math.min(2, sortedSubjects.length)).reverse()
    }
  }

  const { strengths, weaknesses } = calculateStrengthsAndWeaknesses()

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
              Student's Performance
            </h1>
            <Link
              to="/admin/students"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Student List
            </Link>
          </div>

          {/* Student Info Card */}
          {examData.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-indigo-600" />
                  Student Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg font-semibold">{email}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Student ID</p>
                    <p className="text-lg font-semibold">{id}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-500">Total Quizzes</p>
                    <p className="text-lg font-semibold">{examData.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Overview Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                {Number(overallImprovement) >= 0 ? (
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                )}
                Performance Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-sm font-medium text-indigo-600 truncate">Average Score</p>
                  <p className="mt-1 text-3xl font-semibold text-indigo-900">{averageScore}%</p>
                </div>
                <div className={`${Number(overallImprovement) >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"} rounded-lg p-4 border`}>
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Score Progression Chart */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Progression</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quiz" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(2)}%`, 'Score']}
                        labelFormatter={(value, payload) => {
                          if (payload && payload.length) {
                            return `${payload[0].payload.Subject}: ${payload[0].payload.Topic}`
                          }
                          return value
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ScorePercentage"
                        name="Score (%)"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props
                          return payload.isCurrent ? (
                            <circle cx={cx} cy={cy} r={6} fill="#4F46E5" stroke="white" strokeWidth={2} />
                          ) : (
                            <circle cx={cx} cy={cy} r={4} fill="#4F46E5" />
                          )
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Latest Quiz Score Distribution */}
            {pieData.length > 0 && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChartIcon className="w-5 h-5 mr-2 text-indigo-600" />
                    Latest Quiz Score
                  </h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} questions`, null]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subject Improvement Chart */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Subject Performance
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectImprovements}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === "improvement") {
                          return [`${value.toFixed(2)}%`, 'Improvement']
                        }
                        return [`${value.toFixed(2)}%`, 'Average Score']
                      }}
                    />
                    <Legend />
                    <Bar dataKey="improvement" fill="#4F46E5" name="Improvement %" />
                    <Bar dataKey="averageScore" fill="#10B981" name="Average Score %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          {(strengths.length > 0 || weaknesses.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Strengths */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Strengths</h2>
                  {strengths.length > 0 ? (
                    <ul className="space-y-4">
                      {strengths.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">{topic.subject}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${topic.averageScore}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{topic.averageScore.toFixed(2)}% average score</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Not enough data to determine strengths.</p>
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Areas for Improvement</h2>
                  {weaknesses.length > 0 ? (
                    <ul className="space-y-4">
                      {weaknesses.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">{topic.subject}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-red-500 h-2.5 rounded-full" 
                                style={{ width: `${topic.averageScore}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{topic.averageScore.toFixed(2)}% average score</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">Not enough data to determine areas for improvement.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Exam Scores Table */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Scores</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full text-sm mb-4"
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
                          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
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

          {/* Recommendations */}
          {examData.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
                {weaknesses.length > 0 ? (
                  <div>
                    <p className="mb-4">Based on the student's performance, here are some recommendations:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      {weaknesses.map((topic, index) => (
                        <li key={index}>
                          Focus on improving understanding of <strong>{topic.subject}</strong> concepts through additional practice exercises.
                        </li>
                      ))}
                      {Number(overallImprovement) < 0 && (
                        <li>
                          Review recent study materials as there has been a decline in performance compared to previous assessments.
                        </li>
                      )}
                      <li>
                        Provide targeted resources for topics with scores below 70%.
                      </li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Not enough data to provide personalized recommendations. Continue monitoring the student's performance across multiple quizzes.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentScorePage
