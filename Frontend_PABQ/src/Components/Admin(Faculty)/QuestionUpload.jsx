import { useState } from "react";
import {
    Upload,
    AlertCircle,
    CheckCircle,
    ArrowLeft,
    Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function QuestionUpload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("idle");
    const navigate = useNavigate();

    // AI Question Generation Fields
    const [numQuestions, setNumQuestions] = useState(15);
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");

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

        try {
            const response = await axios.post(
                `http://13.232.135.2:8080/auth/admin/uploadquestion/${localStorage.getItem("quizid")}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setMessage(response.data);
            setStatus("success");
        } catch (error) {
            setMessage(`Error uploading file: ${error.response?.data || error.message}`);
            setStatus("error");
        } finally {
            setUploading(false);
        }
    };

    const handleAIGenerate = async () => {
        if (numQuestions < 15 || numQuestions > 30 || description.trim() === "") {
            setMessage("Please provide valid input for AI generation.");
            setStatus("error");
            return;
        }

        setUploading(true);
        setMessage("");

        const params = new URLSearchParams({
            numQuestions,
            description,
            difficulty,
        });

        try {
            const response = await axios.post(
                `http://13.232.135.2:8080/auth/admin/aigenerate/${localStorage.getItem("quizid")}?${params}`
            );
            setMessage(response.data);
            setStatus("success");
        } catch (error) {
            setMessage(`Error generating questions: ${error.response?.data || error.message}`);
            setStatus("error");
        } finally {
            setUploading(false);
        }
    };
    

    return (
        <div className="ml-64 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 space-y-10">
            {/* Box 1 - Manual Upload */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Question Upload</h1>
                    <p className="text-gray-600">Upload question data in Excel format</p>
                </div>

                <div className="space-y-6">
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
                            <div className="mt-2 text-sm text-gray-600 text-center">
                                Selected: {file.name}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md font-semibold bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
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
                </div>
            </div>

            {/* Box 2 - AI Generated Questions */}
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-indigo-700 mb-2">Generate Questions using AI</h1>
                    <p className="text-gray-600">Auto-generate questions based on description</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Number of Questions
                        </label>
                        <input
                            type="number"
                            min="15"
                            max="30"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Description (e.g. Subject, Topic)
                        </label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Difficulty
                        </label>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <button
                        onClick={handleAIGenerate}
                        disabled={uploading}
                        className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Generate Questions
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Back and Message */}
            <div className="w-full max-w-md space-y-4">
                <button
                    onClick={() => navigate(`/admin/addquestion`)}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-gray-300 font-semibold text-gray-700 hover:bg-gray-100"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>

                {message && (
                    <div className={`flex items-center gap-2 p-4 rounded-lg ${status === "success"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                        }`}>
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
    );
}

export default QuestionUpload;
