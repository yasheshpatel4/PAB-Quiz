import { useState, useEffect } from "react";
import { Upload, AlertCircle, CheckCircle } from "lucide-react";

function StudentUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [adminEmail, setAdminEmail] = useState("");

  // Fetch adminEmail from localStorage when the component mounts
  useEffect(() => {
    const storedEmail = localStorage.getItem("adminEmail");
    if (storedEmail) {
      setAdminEmail(storedEmail);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file");
      setStatus("error");
      return;
    }

    if (!adminEmail) {
      setMessage("Admin email is missing. Please log in again.");
      setStatus("error");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("adminEmail", adminEmail);

    try {
      const response = await fetch("http://localhost:8080/api/students/upload", {
        method: "POST",
        body: formData, // No need to set `Content-Type`
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
        setStatus("success");
      } else {
        const errorText = await response.text();
        setMessage(`Error uploading file: ${errorText}`);
        setStatus("error");
      }
    } catch (error) {
      setMessage("Error uploading file. Please check your connection.");
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Upload</h1>
          <p className="text-gray-600">Upload student registration data in Excel format</p>
        </div>

        <div className="space-y-6">
          {/* File Upload Input */}
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".xlsx,.xls"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
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

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || !file || !adminEmail}
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload File
              </>
            )}
          </button>

          {/* Status Message */}
          {message && (
            <div
              className={`flex items-center gap-2 p-4 rounded-lg ${status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}
            >
              {status === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentUpload;
