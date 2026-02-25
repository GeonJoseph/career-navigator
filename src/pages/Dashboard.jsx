import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 pt-10">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="block text-white">Design your career.</span>
                    <span className="block text-blue-500">Don't guess it.</span>
                </h1>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                    AI-powered guidance, real-world outcomes. Build your future with confidence using data-driven insights.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                    >
                        Start with Career Bot
                    </button>
                </div>
            </section>

            {/* Feature Cards Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Discover the next step in your career</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Results Card */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-colors group cursor-pointer" onClick={() => navigate('/results')}>
                        <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                            <CheckCircle className="text-blue-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Results</h3>
                        <p className="text-slate-400 mb-4">View your assessment results and personalized career insights.</p>
                        <button className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                            View your results →
                        </button>
                    </div>

                    {/* Courses Card */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-purple-500/50 transition-colors group cursor-pointer" onClick={() => navigate('/courses')}>
                        <div className="h-12 w-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                            <Clock className="text-purple-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Courses</h3>
                        <p className="text-slate-400 mb-4">Browse recommended courses to build your target skills.</p>
                        <button className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                            Browse courses →
                        </button>
                    </div>

                    {/* Jobs Card */}
                    <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50 hover:border-green-500/50 transition-colors group cursor-pointer" onClick={() => navigate('/applications')}>
                        <div className="h-12 w-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                            <Briefcase className="text-green-400" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Jobs</h3>
                        <p className="text-slate-400 mb-4">Explore job opportunities matched to your profile.</p>
                        <button className="text-green-400 font-medium hover:text-green-300 transition-colors">
                            Explore jobs →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
