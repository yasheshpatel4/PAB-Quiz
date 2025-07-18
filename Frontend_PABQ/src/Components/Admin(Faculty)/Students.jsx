"use client"

import AdminNavbar from "../NavBar/AdminNavbar"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import StudentUpload from "./StudentUpload"
import * as XLSX from "xlsx"
import { Search, Upload, Trash2, Edit2, AlertCircle, LoaderCircle, Download, X, Save } from 'lucide-react'

function Students() {
  const [students, setStudents] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [semesterFilter, setSemesterFilter] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadSemester, setDownloadSemester] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [updatingStudent, setUpdatingStudent] = useState(false)

  // Add these state variables after other state declarations
  const [selectedColumns, setSelectedColumns] = useState({
    name: true,
    email: true,
    rollNumber: true,
    sem: true,
    studentID: true,
    scores: true,
  })

  // Add this constant for available columns
  const availableColumns = {
    name: "Name",
    email: "Email",
    rollNumber: "Roll Number",
    sem: "Semester",
    studentID: "Student ID",
    scores: "Subject Scores",
  }

  const navigate = useNavigate()

  const handleStudentClick = (id, email) => {
    navigate(`/admin/studentscore/${id}/${email}`)
  }

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://13.232.135.2:8080/auth/admin/getallstudents", {
          params: { email: localStorage.getItem("adminEmail") }
        })
        const studentsData = Array.isArray(response.data) ? response.data : []
        setStudents(studentsData)
      } catch (err) {
        console.error("Error fetching students:", err)
        setError("Failed to fetch students. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const handleUpdate = (student) => {
    setEditingStudent({...student})
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditingStudent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveEdit = async () => {
    if (!editingStudent) return
    
    setUpdatingStudent(true)
    try {
      const adminEmail = localStorage.getItem("adminEmail")
      if (!adminEmail) {
        throw new Error("Admin email not found. Please log in again.")
      }
      
      const response = await axios.patch(
        `http://13.232.135.2:8080/auth/admin/updatestudent/${editingStudent.studentID}`,
        editingStudent,
      )
      
      // Update the students list with the edited student
      setStudents(students.map(student => 
        student.studentID === editingStudent.studentID ? editingStudent : student
      ))
      
      setShowEditModal(false)
      setEditingStudent(null)
      alert(response.data)
    } catch (err) {
      console.error("Error updating student:", err.response?.data || err.message)
      setError(err.response?.data || "Failed to update student. Please try again.")
    } finally {
      setUpdatingStudent(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?")
    if (!confirmed) return

    try {
      const response = await axios.delete(`http://13.232.135.2:8080/auth/admin/deletestudent/${id}`, {
        params: { email: localStorage.getItem("adminEmail") }
      })
      setStudents(students.filter((student) => student.studentID !== id))
      alert(response.data)
    } catch (err) {
      console.error("Error deleting student:", err.response?.data || err.message)
      setError(err.response?.data || "Failed to delete student. Please try again.")
    }
  }

  const handleDownloadClick = () => {
    setShowDownloadModal(true)
  }

  // Replace the existing handleDownload function with this updated version
  const handleDownload = async () => {
    try {
      if (!downloadSemester) {
        setError("Please select a semester to download.")
        return
      }

      // Check if at least one column is selected
      if (!Object.values(selectedColumns).some((value) => value)) {
        setError("Please select at least one column to download.")
        return
      }

      // Fetch basic student data
      const studentsResponse = await axios.get("http://13.232.135.2:8080/auth/admin/getallstudents", {
        params: { email: localStorage.getItem("adminEmail") }
      })
      const studentsData = studentsResponse.data

      if (!Array.isArray(studentsData) || studentsData.length === 0) {
        setError("No student data available for download.")
        return
      }

      // Filter students by selected semester
      const semesterStudents = studentsData.filter((student) => student.sem === downloadSemester)

      if (semesterStudents.length === 0) {
        setError(`No students found in semester ${downloadSemester}`)
        return
      }

      // Fetch and process student data based on selected columns
      const studentsWithSelectedData = await Promise.all(
        semesterStudents.map(async (student) => {
          const filteredStudent = {}

          // Add basic information based on selected columns
          if (selectedColumns.name) filteredStudent.Name = student.name
          if (selectedColumns.email) filteredStudent.Email = student.email
          if (selectedColumns.rollNumber) filteredStudent["Roll Number"] = student.rollNumber
          if (selectedColumns.sem) filteredStudent.Semester = student.sem
          if (selectedColumns.studentID) filteredStudent["Student ID"] = student.studentID

          // Fetch and add scores if selected
          if (selectedColumns.scores) {
            try {
              const scoresResponse = await axios.get("http://13.232.135.2:8080/api/students/completedquiz", {
                params: {
                  studentEmail: student.email,
                  studentID: student.studentID,
                },
              })

              const scores = scoresResponse.data.map((examString) => {
                const examObject = Object.fromEntries(
                  examString.split(", ").map((item) => {
                    const [key, value] = item.split(": ")
                    return [key, isNaN(value) ? value : Number(value)]
                  }),
                )
                return examObject
              })

              // Calculate average scores per subject
              const subjectScores = {}
              scores.forEach((exam) => {
                if (!subjectScores[exam.Subject]) {
                  subjectScores[exam.Subject] = {
                    total: 0,
                    count: 0,
                  }
                }
                subjectScores[exam.Subject].total += (exam.Score / 15) * 100
                subjectScores[exam.Subject].count++
              })

              // Add average scores to student data
              Object.entries(subjectScores).forEach(([subject, data]) => {
                filteredStudent[`${subject}(%)`] = (data.total / data.count).toFixed(2)
              })
            } catch (error) {
              console.error(`Error fetching scores for student ${student.email}:`, error)
            }
          }

          return filteredStudent
        }),
      )

      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(studentsWithSelectedData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, `Semester ${downloadSemester} Students`)

      // Generate Excel file and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `semester_${downloadSemester}_students.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      // Close modal and reset states
      setShowDownloadModal(false)
      setDownloadSemester("")
    } catch (error) {
      console.error("Error downloading student data:", error)
      setError("Failed to download student data. Please try again.")
    }
  }

  const filteredStudents = Array.isArray(students)
    ? students.filter((student) => {
        const matchesSearchQuery =
          (student.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (student.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (student.rollNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase())

        const matchesSemesterFilter = semesterFilter ? student.sem === semesterFilter : true

        return matchesSearchQuery && matchesSemesterFilter
      })
    : []

  const toggleUpload = () => {
    setShowUpload(!showUpload)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading students...</p>
        </div>
      </div>
    )
  }
   const handleDownloadTemplate = () => {
      // Create a template Excel file
      const template = [
        {
          "NAME": "xyz",
          "EMAIL": "22itxxxxx@ddu.ac.in",
          "ROLL NUMBER": "ITXXX",
          "SEMESTER": "[1-6]",
          "STUDNET ID" : "22ITXXXXX"
        }
      ]

      const worksheet = XLSX.utils.json_to_sheet(template)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Student Template")
      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, "studentaddtemplate.xlsx")
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
    )
  }

  return (
    <AdminNavbar>
      <div className="ml-64 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 sm:p-8 md:p-10">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Student Management</h1>
              <div>

                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 mr-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Template
                </button>
                
                <button
                  onClick={toggleUpload}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 mr-2"
                >
                  {showUpload ? (
                    <>Back to List</>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Students
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadClick}
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download(RESULT)
                </button>
              </div>
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
                        {["#", "Name", "Email", "Roll Number", "Semester", "Student ID", "Actions"].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student, index) => (
                        <tr
                          key={student.studentID}
                          onClick={() => handleStudentClick(student.studentID, student.email)}
                          className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.rollNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.sem}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentID}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpdate(student)
                                }}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                title="Edit student"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(student.studentID)
                                  }}
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

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[480px] max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Student</h2>
              <button 
                onClick={() => {
                  setShowEditModal(false)
                  setEditingStudent(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  name="studentID"
                  value={editingStudent.studentID}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Student ID cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingStudent.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingStudent.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={editingStudent.rollNumber}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  name="sem"
                  value={editingStudent.sem}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Semester {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingStudent(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={updatingStudent}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center"
              >
                {updatingStudent ? (
                  <>
                    <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[480px]">
            <h2 className="text-xl font-semibold mb-4">Download Students Result</h2>

            {/* Semester Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Semester</label>
              <select
                value={downloadSemester}
                onChange={(e) => setDownloadSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a semester</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Semester {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Column Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Columns to Include</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(availableColumns).map(([key, label]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`column-${key}`}
                      checked={selectedColumns[key]}
                      onChange={(e) =>
                        setSelectedColumns((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`column-${key}`} className="ml-2 text-sm text-gray-700">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDownloadModal(false)
                  setDownloadSemester("")
                  setError("")
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminNavbar>
  )
}

export default Students
