// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Bell, Search } from "lucide-react";

// const Navbar2 = () => {
//     const [searchQuery, setSearchQuery] = useState("");

//     return (
//         <nav className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center shadow-md">
//             {/* Search Bar */}
//             <div className="relative w-1/3">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
//             </div>

//             {/* Notification Icon */}
//             <div className="relative">
//                 <button className="p-2 bg-gray-700 rounded-full hover:bg-gray-600">
//                     <Bell size={20} />
//                 </button>
//                 {/* Notification Badge (Example: 3 notifications) */}
//                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">3</span>
//             </div>

//             {/* Profile Section */}
//             <div className="flex items-center space-x-3">
//                 <img
//                     src="https://via.placeholder.com/40"
//                     alt="Profile"
//                     className="w-10 h-10 rounded-full border-2 border-gray-500"
//                 />
//                 <span className="font-semibold">John Doe</span>
//             </div>
//         </nav>
//     );
// };

// export default Navbar2;