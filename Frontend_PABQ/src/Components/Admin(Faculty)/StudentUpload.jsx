import React, { useState } from "react"

function StudentUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file")
      return
    }

    setUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8080/api/students/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setMessage("File uploaded successfully")
      } else {
        setMessage("Error uploading file")
      }
    } catch (error) {
      setMessage("Error uploading file")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Student Registration Upload</h1>
        <input type="file" onChange={handleFileChange} className="mb-4 p-2 w-full border rounded" accept=".xlsx,.xls" />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  )
}

export default StudentUpload

