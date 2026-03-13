import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle, Clock, GraduationCap } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="space-y-12 relative">
            {/* Ambient Background Blur */}
            <div className="ambient-glow -top-20 -left-20 animate-pulse-slow"></div>
            <div className="ambient-glow top-40 -right-20 bg-purple-600/10 animate-pulse-slow font-['style:animation-delay:2s']"></div>

            {/* Hero Section */}
            <section className="text-center space-y-6 pt-16 relative z-10">
                <div className="animate-float">
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4">
                        <span className="block text-white drop-shadow-2xl">Design your career.</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 text-glow">Don't guess it.</span>
                    </h1>
                </div>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                    AI-powered guidance, real-world outcomes. Build your future with confidence using data-driven insights.
                </p>
                <div className="flex justify-center gap-4 pt-6">
                    <button
                        onClick={() => navigate('/chat')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/40 border border-blue-400/20"
                    >
                        Start with Career Bot
                    </button>
                </div>
            </section>


            {/* Feature Cards Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Discover the next step in your career</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Results Card */}
                    <div className="glass-card p-8 rounded-3xl group cursor-pointer hover:-translate-y-2" onClick={() => navigate('/results')}>
                        <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all group-hover:scale-110 shadow-inner">
                            <CheckCircle className="text-blue-400" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Results</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">View your assessment results and personalized career insights.</p>
                        <button className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2">
                            View results <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    {/* Courses Card */}
                    <div className="glass-card p-8 rounded-3xl group cursor-pointer hover:-translate-y-2" onClick={() => navigate('/courses')}>
                        <div className="h-14 w-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all group-hover:scale-110 shadow-inner">
                            <Clock className="text-purple-400" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Courses</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">Browse recommended courses to build your target skills.</p>
                        <button className="text-purple-400 font-bold hover:text-purple-300 transition-colors flex items-center gap-2">
                            Browse courses <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    {/* Internships Card */}
                    <div className="glass-card p-8 rounded-3xl group cursor-pointer hover:-translate-y-2" onClick={() => navigate('/internships')}>
                        <div className="h-14 w-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-all group-hover:scale-110 shadow-inner">
                            <GraduationCap className="text-amber-400" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Internships</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">Find real-time internship opportunities matched to you.</p>
                        <button className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-2">
                            Explore internships <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                    {/* Jobs Card */}
                    <div className="glass-card p-8 rounded-3xl group cursor-pointer hover:-translate-y-2" onClick={() => navigate('/applications')}>
                        <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-all group-hover:scale-110 shadow-inner">
                            <Briefcase className="text-emerald-400" size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Jobs</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">Explore real-time job opportunities matched to your profile.</p>
                        <button className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2">
                            Explore jobs <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Application Trend removed */}
        </div>
    );
};

export default Dashboard;
