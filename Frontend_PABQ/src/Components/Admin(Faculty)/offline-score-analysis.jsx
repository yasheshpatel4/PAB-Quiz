"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useLocation, useNavigate } from "react-router-dom"
import AdminNavbar from "../NavBar/AdminNavbar"
import { AlertCircle, LoaderCircle, ArrowLeft, BookOpen, Award, TrendingUp, TrendingDown } from 'lucide-react'
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

function OfflineScoreAnalysis() {
  const { studentId, quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [quizData, setQuizData] = useState(null)
  const [studentHistory, setStudentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if we have data from navigation state
    if (location.state?.studentData && location.state?.allQuizData) {
      const { studentData, allQuizData } = location.state
      setQuizData(studentData)
      
      // Filter all quiz data to get student's history for the same subject
      const history = allQuizData.filter(quiz => 
        quiz.studentId === studentData.studentId && 
        quiz.subject === studentData.subject
      )
      
      setStudentHistory(history)
      setLoading(false)
    } else {
      // If no data in navigation state, try to get from localStorage
      const storedData = localStorage.getItem("offlineQuizData")
      if (storedData) {
        try {
          const allQuizData = JSON.parse(storedData)
          
          // Find the specific quiz
          const quiz = allQuizData.find(q => q.quizId === quizId)
          
          if (quiz) {
            setQuizData(quiz)
            
            // Filter for student history
            const history = allQuizData.filter(q => 
              q.studentId === studentId && 
              q.subject === quiz.subject
            )
            
            setStudentHistory(history)
          } else {
            setError("Quiz data not found")
          }
        } catch (err) {
          console.error("Error parsing stored data:", err)
          setError("Failed to load quiz data")
        }
      } else {
        setError("No quiz data available")
      }
      
      setLoading(false)
    }
  }, [location.state, studentId, quizId])

  // Calculate performance metrics
  const calculatePerformanceMetrics = () => {
    if (!quizData || !studentHistory.length) return null

    // Calculate average score
    const averageScore = studentHistory.reduce((sum, quiz) => 
      sum + (quiz.score / quiz.totalQuestions) * 100, 0) / studentHistory.length

    // Calculate improvement (current score vs average of previous attempts)
    const currentScore = (quizData.score / quizData.totalQuestions) * 100
    const previousScores = studentHistory
      .filter(quiz => quiz.quizId !== quizId)
      .map(quiz => (quiz.score / quiz.totalQuestions) * 100)
    
    const averagePreviousScore = previousScores.length 
      ? previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length
      : currentScore

    const improvement = currentScore - averagePreviousScore

    // Calculate strengths and weaknesses based on topic performance
    const topicPerformance = {}
    studentHistory.forEach(quiz => {
      if (!topicPerformance[quiz.topic]) {
        topicPerformance[quiz.topic] = {
          total: 0,
          count: 0
        }
      }
      topicPerformance[quiz.topic].total += (quiz.score / quiz.totalQuestions) * 100
      topicPerformance[quiz.topic].count++
    })

    const topicAverages = Object.entries(topicPerformance).map(([topic, data]) => ({
      topic,
      average: data.total / data.count
    }))

    // Sort topics by average score
    topicAverages.sort((a, b) => b.average - a.average)

    return {
      averageScore,
      currentScore,
      improvement,
      topicAverages,
      // Get top 2 and bottom 2 topics if available
      strengths: topicAverages.slice(0, Math.min(2, topicAverages.length)),
      weaknesses: topicAverages.slice(-Math.min(2, topicAverages.length)).reverse()
    }
  }

  const metrics = calculatePerformanceMetrics()

  // Prepare data for charts
  const prepareProgressionData = () => {
    if (!studentHistory.length) return []

    return studentHistory
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((quiz, index) => ({
        name: `Quiz ${index + 1}`,
        date: quiz.date,
        score: (quiz.score / quiz.totalQuestions) * 100,
        topic: quiz.topic,
        isCurrent: quiz.quizId === quizId
      }))
  }

  const progressionData = prepareProgressionData()

  // Prepare data for pie chart
  const preparePieData = () => {
    if (!quizData) return []

    const correct = quizData.score
    const incorrect = quizData.totalQuestions - quizData.score

    return [
      { name: "Correct", value: correct },
      { name: "Incorrect", value: incorrect }
    ]
  }

  const pieData = preparePieData()
  const COLORS = ["#4F46E5", "#EF4444"]

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminNavbar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading quiz analysis...</p>
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
            <button
              onClick={() => navigate("/admin/offline-score")}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Offline Scores
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminNavbar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-700">Quiz data not found</h2>
            <Link
              to="/admin/offline-score"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Offline Scores
            </Link>
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
              Quiz Analysis
            </h1>
            <Link
              to="/admin/offline-score"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150 ease-in-out flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Offline Scores
            </Link>
          </div>

          {/* Student Info Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-indigo-600" />
                Student Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold">{quizData.studentName}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Student ID</p>
                  <p className="text-lg font-semibold">{quizData.studentId}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold">{quizData.studentEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Info Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
                Quiz Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="text-lg font-semibold">{quizData.subject}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Topic</p>
                  <p className="text-lg font-semibold">{quizData.topic}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg font-semibold">{quizData.date}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">Score</p>
                  <p className="text-lg font-semibold">
                    {quizData.score}/{quizData.totalQuestions} ({((quizData.score / quizData.totalQuestions) * 100).toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {metrics && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  {metrics.improvement >= 0 ? (
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 mr-2 text-red-600" />
                  )}
                  Performance Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <p className="text-sm font-medium text-indigo-600 truncate">Current Score</p>
                    <p className="mt-1 text-3xl font-semibold text-indigo-900">{metrics.currentScore.toFixed(2)}%</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                    <p className="text-sm font-medium text-indigo-600 truncate">Average Score</p>
                    <p className="mt-1 text-3xl font-semibold text-indigo-900">{metrics.averageScore.toFixed(2)}%</p>
                  </div>
                  <div className={`${metrics.improvement >= 0 ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"} rounded-lg p-4 border`}>
                    <p className="text-sm font-medium text-gray-600 truncate">Improvement</p>
                    <p className={`mt-1 text-3xl font-semibold ${metrics.improvement >= 0 ? "text-green-900" : "text-red-900"}`}>
                      {metrics.improvement.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Score Progression Chart */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Progression</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value, name) => [`${value.toFixed(2)}%`, 'Score']}
                        labelFormatter={(value, payload) => {
                          if (payload && payload.length) {
                            return `${payload[0].payload.topic} (${payload[0].payload.date})`
                          }
                          return value
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="score"
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

            {/* Score Distribution Pie Chart */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Score Distribution</h2>
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
          </div>

          {/* Topic Performance */}
          {metrics && metrics.topicAverages.length > 0 && (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
              <div className="px-6 py-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Topic Performance</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.topicAverages}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="topic" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Average Score']} />
                      <Legend />
                      <Bar dataKey="average" name="Average Score (%)" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Strengths and Weaknesses */}
          {metrics && (metrics.strengths.length > 0 || metrics.weaknesses.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Strengths */}
              <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-5">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Strengths</h2>
                  {metrics.strengths.length > 0 ? (
                    <ul className="space-y-4">
                      {metrics.strengths.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">{topic.topic}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${topic.average}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{topic.average.toFixed(2)}% average score</p>
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
                  {metrics.weaknesses.length > 0 ? (
                    <ul className="space-y-4">
                      {metrics.weaknesses.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <div className="flex-1">
                            <p className="font-medium">{topic.topic}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                              <div 
                                className="bg-red-500 h-2.5 rounded-full" 
                                style={{ width: `${topic.average}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{topic.average.toFixed(2)}% average score</p>
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

          {/* Recommendations */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
              {metrics && metrics.weaknesses.length > 0 ? (
                <div>
                  <p className="mb-4">Based on the student's performance, here are some recommendations:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    {metrics.weaknesses.map((topic, index) => (
                      <li key={index}>
                        Focus on improving understanding of <strong>{topic.topic}</strong> concepts through additional practice exercises.
                      </li>
                    ))}
                    {metrics.improvement < 0 && (
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
        </div>
      </div>
    </div>
  )
}

export default OfflineScoreAnalysis
