import { BookOpen, CheckCircle, Users, Brain, Clock, ArrowRight } from 'lucide-react'

// DashboardCard component
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

const Defaultquiz = () => {
  const dashboardData = [
    {
      title: "Total Quizzes",
      value: "25",
      color: "blue",
      icon: <BookOpen size={32} />
    },
    {
      title: "Completed Quizzes",
      value: "18",
      color: "green",
      icon: <CheckCircle size={32} />
    },
    {
      title: "Active Students",
      value: "156",
      color: "yellow",
      icon: <Users size={32} />
    },
    {
      title: "Average Score",
      value: "85%",
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
      icon: "🗄️"
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
      icon: "☁️"
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IT Engineering Quiz Portal</h1>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Start New Quiz
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Quiz Topics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">IT Engineering Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { title: "Web Development Quiz", score: "92%", time: "2 hours ago", topic: "React.js" },
              { title: "Database Systems Quiz", score: "88%", time: "1 day ago", topic: "SQL" },
              { title: "Programming Quiz", score: "85%", time: "2 days ago", topic: "Data Structures" }
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

export default Defaultquiz

