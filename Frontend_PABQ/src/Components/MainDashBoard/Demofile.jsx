import { BookOpen, CheckCircle, Users, Brain, Clock, ArrowRight } from 'lucide-react'

const colorVariants = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
}

function DashboardCard({ title, value, icon, color }) {
    return (
        <div className={`p-6 rounded-xl border ${colorVariants[color]} transition-all hover:shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${colorVariants[color]}`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-medium mb-2">{title}</h3>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    )
}

const Demofile = () => {
    const dashboardData = [
        {
            title: "Total Quizzes",
            value: "0",
            color: "blue",
            icon: <BookOpen size={32} />
        },
        {
            title: "Completed Quizzes",
            value: "0",
            color: "green",
            icon: <CheckCircle size={32} />
        },
        {
            title: "Active Students",
            value: "0",
            color: "yellow",
            icon: <Users size={32} />
        },
        {
            title: "Average Score",
            value: "0%",
            color: "red",
            icon: <Brain size={32} />
        }
    ]

    const quizTopics = [
        {
            title: "Web Development",
            description: "HTML, CSS, JavaScript, React, Node.js",
            totalQuizzes: 15,
            icon: "🌐"
        },
        {
            title: "Programming",
            description: "Java, Python, C++, Data Structures",
            totalQuizzes: 12,
            icon: "💻"
        },
        {
            title: "Database Systems",
            description: "SQL, MongoDB, Database Design",
            totalQuizzes: 8,
            icon: "🗄"
        },
        {
            title: "Networking",
            description: "TCP/IP, Security, Protocols",
            totalQuizzes: 10,
            icon: "🔌"
        },
        {
            title: "Cloud Computing",
            description: "AWS, Azure, Docker, Kubernetes",
            totalQuizzes: 7,
            icon: "☁"
        },
        {
            title: "Cybersecurity",
            description: "Security, Encryption, Ethical Hacking",
            totalQuizzes: 9,
            icon: "🔒"
        },
        {
            title: "Software Engineering",
            description: "Design Patterns, Architecture, Testing",
            totalQuizzes: 11,
            icon: "🔧"
        },
        {
            title: "Mobile Development",
            description: "Android, iOS, React Native",
            totalQuizzes: 6,
            icon: "📱"
        }
    ]

    return (
        <div className="ml-32 bg-gray-50 min-h-full">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6"> {/* Update 1 */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Quiz Portal</h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6"> {/* Update 2 */}
                    {dashboardData.map((card, index) => (
                        <DashboardCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            color={card.color}
                            icon={card.icon}
                        />
                    ))}
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Topics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"> {/* Update 3 */}
                        {quizTopics.map((topic, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all">
                                <div className="text-4xl mb-4">{topic.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{topic.title}</h3>
                                <p className="text-gray-600 mb-4">{topic.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">{topic.totalQuizzes} Quizzes</span>
                                    <button className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                        Start <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[
                            { title: "Web Development Quiz", score: "0%", time: ".....", topic: "....." },
                            { title: "Database Systems Quiz", score: "0%", time: ".....", topic: "....." },
                            { title: "Programming Quiz", score: "0%", time: ".....", topic: "....." }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <Clock className="text-indigo-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{activity.title}</h3>
                                        <p className="text-sm text-gray-600">Topic: {activity.topic}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium text-gray-800">{activity.score}</div>
                                    <div className="text-sm text-gray-500">{activity.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Demofile

