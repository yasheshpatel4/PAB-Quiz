import { useState } from "react";
import { Upload, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router
import axios from "axios";

function QuestionUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate(); // For navigation

    const handleFileChange = (e) => {
        if (e.target.files) {
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

        setUploading(true);
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("quizId", localStorage.getItem("quizid"));

        try {
            const response = await axios.post(`http://localhost:8080/auth/admin/uploadquestion/${quizId}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMessage("File uploaded successfully");
                setStatus("success");
            } else {
                const errorText = await response.text();
                setMessage(`Error uploading file: ${errorText}`);
                setStatus("error");
            }
        } catch (error) {
            setMessage("Error uploading file");
            setStatus("error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Question Upload</h1>
                    <p className="text-gray-600">Upload question data in Excel format</p>
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
                        disabled={uploading || !file}
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Question
                            </>
                        )}
                    </button>

                    {/* Back to List Button */}
                    <button
                        onClick={() => navigate(`/admin/addquestion`)} // Adjust the path as needed
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to List
                    </button>

                    {/* Status Message */}
                    {message && (
                        <div
                            className={`flex items-center gap-2 p-4 rounded-lg ${status === "success"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
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

export default QuestionUpload;
