import StudentNavbar from "../NavBar/StudentNavbar"

function StudentDashBoard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <StudentNavbar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">All exams</h1>
        </div>

        {/* Knowledge Card */}
        <div className="bg-emerald-500 text-white rounded-lg p-6 max-w-md hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-2">Knowledge</h2>
          <div className="space-y-2">
            <p className="text-sm opacity-90">Exam date: 2023-12-30</p>
            <div className="flex items-center mt-4">
              <svg className="w-6 h-6 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashBoard

