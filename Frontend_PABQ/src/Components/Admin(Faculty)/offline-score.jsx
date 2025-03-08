"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminNavbar from "../NavBar/AdminNavbar"
import * as XLSX from "xlsx"
import { Search, Upload, Download, AlertCircle, LoaderCircle, Eye, FileSpreadsheet, Info } from 'lucide-react'

function OfflineScore() {
  const [quizData, setQuizData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")
  const [subjects, setSubjects] = useState([])

  const navigate = useNavigate()

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem("offlineQuizData")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setQuizData(parsedData)
        
        // Extract unique subjects for filtering
        const uniqueSubjects = [...new Set(parsedData.map(item => item.subject))]
        setSubjects(uniqueSubjects)
      } catch (err) {
        console.error("Error parsing stored data:", err)
      }
    }
  }, [])

  const handleViewAnalysis = (studentData) => {
    // Navigate to analysis page with the student data
    navigate(`/admin/offline-score/analysis/${studentData.studentId}/${studentData.quizId}`, { 
      state: { studentData, allQuizData: quizData } 
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
      setUploadStatus("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file")
      return
    }

    setUploading(true)
    
    try {
      // Read the Excel file
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          // Process and validate the data
          const processedData = jsonData.map((row, index) => {
            // Generate unique IDs for each quiz entry
            const quizId = `quiz_${Date.now()}_${index}`
            
            return {
              quizId,
              studentId: row["Student ID"] || row["StudentID"] || row["studentId"] || "",
              studentName: row["Student Name"] || row["Name"] || row["name"] || "",
              studentEmail: row["Student Email"] || row["Email"] || row["email"] || "",
              subject: row["Subject"] || row["subject"] || "",
              topic: row["Topic"] || row["topic"] || "",
              totalQuestions: parseInt(row["Total Questions"] || row["totalQuestions"] || "0"),
              score: parseInt(row["Score"] || row["score"] || "0"),
              date: row["Date"] || row["date"] || new Date().toISOString().split('T')[0]
            }
          })
          
          // Combine with existing data
          const combinedData = [...quizData, ...processedData]
          
          // Save to state and localStorage
          setQuizData(combinedData)
          localStorage.setItem("offlineQuizData", JSON.stringify(combinedData))
          
          // Extract unique subjects for filtering
          const uniqueSubjects = [...new Set(combinedData.map(item => item.subject))]
          setSubjects(uniqueSubjects)
          
          setUploadStatus("success")
          setFile(null)
          
          setTimeout(() => {
            setShowUploadModal(false)
            setUploadStatus("")
          }, 2000)
        } catch (err) {
          console.error("Error processing Excel file:", err)
          setUploadStatus("Error: Invalid Excel file format")
        } finally {
          setUploading(false)
        }
      }
      
      reader.onerror = () => {
        setUploadStatus("Error: Failed to read file")
        setUploading(false)
      }
      
      reader.readAsArrayBuffer(file)
      
    } catch (err) {
      console.error("Error uploading file:", err)
      setUploadStatus("Error: Failed to process file")
      setUploading(false)
    }
  }

  const handleDownloadTemplate = () => {
    // Create a template Excel file
    const template = [
      {
        "Student ID": "12345",
        "Student Name": "John Doe",
        "Student Email": "student@example.com",
        "Subject": "Mathematics",
        "Topic": "Algebra",
        "Total Questions": 15,
        "Score": 12,
        "Date": "2023-05-15"
      },
      {
        "Student ID": "12345",
        "Student Name": "John Doe",
        "Student Email": "student@example.com",
        "Subject": "Mathematics",
        "Topic": "Calculus",
        "Total Questions": 15,
        "Score": 10,
        "Date": "2023-05-20"
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(template)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Template")
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "offline_quiz_template.xlsx")
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all quiz data? This action cannot be undone.")) {
      setQuizData([])
      setSubjects([])
      localStorage.removeItem("offlineQuizData")
    }
  }

  const filteredData = quizData.filter(item => {
    const matchesSearch = 
      (item.studentName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.studentEmail?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.studentId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (item.topic?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    
    const matchesSubject = subjectFilter ? item.subject === subjectFilter : true

    return matchesSearch && matchesSubject
  })

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminNavbar />
        <div className="ml-64 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600 font-medium">Loading quiz data...</p>
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
              Offline Quiz Scores
            </h1>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadTemplate}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Template
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Quiz Data
              </button>
              {quizData.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Data
                </button>
              )}
            </div>
          </div>

          {/* Info box */}
          {/* <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Upload an Excel file with student quiz data. The data will be stored in your browser and will persist between sessions.
                  No data is sent to any server.
                </p>
              </div>
            </div>
          </div> */}

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name, email, ID or topic..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white min-w-[200px]"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {quizData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Quiz Data Available</h2>
              <p className="text-gray-500 mb-6">Upload an Excel file with student quiz data to get started.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Quiz Data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {item.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.studentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.topic}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.score}/{item.totalQuestions} ({((item.score / item.totalQuestions) * 100).toFixed(2)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleViewAnalysis(item)}
                          className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Analysis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[480px] max-w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Upload Offline Quiz Data</h2>
            
            <div className="mb-6">
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".xlsx,.xls"
                  id="quiz-file-upload"
                />
                <label
                  htmlFor="quiz-file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">.XLSX or .XLS files only</p>
                  </div>
                </label>
                {file && (
                  <div className="mt-2 text-sm text-gray-600 flex items-center justify-center">
                    Selected: {file.name}
                  </div>
                )}
              </div>
            </div>

            {uploadStatus && (
              <div className={`p-3 rounded-md mb-4 ${uploadStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {uploadStatus === "success" ? "File uploaded successfully!" : uploadStatus}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setFile(null)
                  setUploadStatus("")
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OfflineScore
