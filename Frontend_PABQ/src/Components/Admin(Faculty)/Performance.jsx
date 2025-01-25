import AdminNavbar from "../NavBar/AdminNavbar";
import { Link } from "react-router-dom";
function Performance() {
    const students = [
        { id: 1, name: "Alice", averageScore: 86.6 },
        { id: 2, name: "Bob", averageScore: 80 },
        { id: 3, name: "Charlie", averageScore: 91.6 },
        { id: 4, name: "Diana", averageScore: 72.6 },
        { id: 5, name: "Ethan", averageScore: 88.4 },
    ]
    return (
        <>
            <AdminNavbar>
                <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Student List</h1>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <ul className="divide-y divide-gray-200">
                                {students.map((student) => (
                                    <li key={student.id} className="hover:bg-gray-50">
                                        <Link to={`/admin/performance/${student.id}`} className="block">
                                            <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                                                        <span className="text-xl font-medium text-gray-700">{student.name[0]}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <p className="text-sm font-medium text-indigo-600">{student.name}</p>
                                                        <p className="text-sm text-gray-500">Average Score: {student.averageScore.toFixed(1)}%</p>
                                                    </div>
                                                </div>
                                                <div className="ml-2 flex-shrink-0">
                                                    <svg
                                                        className="h-5 w-5 text-gray-400"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </AdminNavbar>
        </>
    )
}

export default Performance;