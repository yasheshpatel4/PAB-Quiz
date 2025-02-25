import { ArrowRight, BarChart2, Brain, CheckCircle } from "lucide-react"
import { useNavigate } from 'react-router-dom';
const Demofile = () => {
    const navigate = useNavigate();
    return (
        <div className="ml-32 min-h-screen bg-gradient-to-b from-blue-50 to-white">

            <main>
                <section className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-5xl font-bold mb-6 text-gray-800">Elevate Your Learning with PAB-QUIZ</h1>
                    <p className="text-xl mb-8 text-gray-600">Conduct quizzes and analyze performance like never before</p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
                        onClick={() => navigate('/studentlogin')}>
                        Get Started
                    </button>
                </section>

                <section className="bg-white py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose PAB-QUIZ?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Brain className="w-12 h-12 text-blue-600" />}
                                title="Smart Quizzes"
                                description="Create engaging quizzes that adapt to the user's skill level"
                            />
                            <FeatureCard
                                icon={<BarChart2 className="w-12 h-12 text-blue-600" />}
                                title="In-depth Analysis"
                                description="Get detailed performance insights and progress tracking"
                            />
                            <FeatureCard
                                icon={<CheckCircle className="w-12 h-12 text-blue-600" />}
                                title="Easy to Use"
                                description="Intuitive interface for both quiz creators and participants"
                            />
                        </div>
                    </div>
                </section>

                <section className="bg-blue-600 text-white py-10">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">"Knowledge is power, but understanding is everything."</h2>
                        <p className="text-xl mb-8">- PAB-QUIZ helps you not just test, but truly understand your progress</p>
                    </div>
                </section>

                <section className="py-20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-8 text-gray-800">Ready to transform your quizzing experience?</h2>
                        <button onClick={() => navigate('/studentlogin')} className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center">
                            Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="text-2xl font-bold">PAB-QUIZ</div>
                    <div className="text-sm">© 2025 PAB-QUIZ. All rights reserved.</div>
                </div>
            </footer>
        </div>
    )
}

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-lg transition duration-300">
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    )
}

export default Demofile

