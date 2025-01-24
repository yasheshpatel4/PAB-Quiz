import StudentNavbar from "../NavBar/StudentNavbar"

function Exam() {
  return (
    <div className="flex h-screen bg-gray-100">
      <StudentNavbar />
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold text-gray-800">Exams</h1>
              <div className="flex space-x-2">
                <input
                  type="search"
                  placeholder="Search..."
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Exam Table */}
            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Knowledge</td>
                    <td className="px-6 py-4 whitespace-nowrap">2023-12-30</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Finished
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-emerald-600 hover:text-emerald-900">View Result</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <div className="flex-1 flex justify-between items-center">
                  <p className="text-sm text-gray-700">Showing 1 to 1 of 1 entries</p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border rounded text-sm">Previous</button>
                    <button className="px-3 py-1 border rounded text-sm bg-emerald-500 text-white">1</button>
                    <button className="px-3 py-1 border rounded text-sm">Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exam

