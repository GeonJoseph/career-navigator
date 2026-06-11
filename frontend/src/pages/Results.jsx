import React, { useState, useEffect } from 'react';
import { BarChart2, Briefcase, GraduationCap, Clock, ArrowRight, User, MessageCircle, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const Results = () => {
    const [topCareer, setTopCareer] = useState(null);
    const [profileCompleted, setProfileCompleted] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const savedResults = localStorage.getItem("careerResults");
        const profileDone = localStorage.getItem("profile_completed");

        setProfileCompleted(profileDone === 'true');

        if (savedResults) {
            const parsed = JSON.parse(savedResults);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setTopCareer(parsed[0]);
            }
        } else {
            setTopCareer(null);
        }
    }, [location]);

    // ── EMPTY STATE: No results yet ──────────────────────────────────────
    if (!topCareer) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-white">Your Assessment Results</h1>
                    <p className="text-slate-400 mt-2">Complete the steps below to unlock your personalised career match.</p>
                </div>

                {/* Hero empty-state banner */}
                <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-blue-900/20 p-10 md:p-14 text-center">
                    {/* Ambient glows */}
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse" />
                                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full border border-white/10 relative z-10 backdrop-blur-sm">
                                    <Sparkles className="text-blue-300" size={44} />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                            Discover Your Ideal Career
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                            You're just <span className="text-blue-400 font-semibold">2 steps away</span> from a personalised career recommendation powered by AI.
                        </p>

                        {/* Step cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">

                            {/* Step 1 – Profile */}
                            <div className={`relative rounded-2xl border p-6 text-left transition-all duration-300 ${
                                profileCompleted
                                    ? 'border-green-500/40 bg-green-500/8'
                                    : 'border-blue-500/40 bg-blue-500/8 hover:border-blue-400/60 hover:bg-blue-500/12'
                            }`}>
                                {profileCompleted && (
                                    <div className="absolute top-4 right-4">
                                        <CheckCircle2 className="text-green-400" size={20} />
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-black text-lg ${
                                    profileCompleted ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                                }`}>
                                    {profileCompleted ? '✓' : '1'}
                                </div>
                                <h3 className="font-bold text-white text-lg mb-1">Complete Your Profile</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Add your name, skills, and interests so our AI can understand you better.
                                </p>
                                {!profileCompleted ? (
                                    <Link
                                        to="/settings"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors group"
                                    >
                                        Go to Profile <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-sm font-bold text-green-400">
                                        <CheckCircle2 size={14} /> Done
                                    </span>
                                )}
                            </div>

                            {/* Step 2 – Chat Assessment */}
                            <div className={`relative rounded-2xl border p-6 text-left transition-all duration-300 ${
                                profileCompleted
                                    ? 'border-purple-500/40 bg-purple-500/8 hover:border-purple-400/60 hover:bg-purple-500/12'
                                    : 'border-white/8 bg-white/3 opacity-60'
                            }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 font-black text-lg ${
                                    profileCompleted ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-500'
                                }`}>
                                    2
                                </div>
                                <h3 className={`font-bold text-lg mb-1 ${profileCompleted ? 'text-white' : 'text-slate-500'}`}>
                                    Take the Career Assessment
                                </h3>
                                <p className={`text-sm leading-relaxed mb-4 ${profileCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Chat with our AI career bot. It asks a few questions and pinpoints your perfect career.
                                </p>
                                {profileCompleted ? (
                                    <Link
                                        to="/chat"
                                        className="inline-flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors group"
                                    >
                                        Start Chat Bot <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                                    </Link>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                                        Complete step 1 first
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Primary CTA */}
                        {!profileCompleted ? (
                            <button
                                onClick={() => navigate('/settings')}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/30"
                            >
                                <User size={20} />
                                Complete Your Profile
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/chat')}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/30"
                            >
                                <MessageCircle size={20} />
                                Start Career Bot
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── RESULTS STATE: Career found ──────────────────────────────────────
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Your Assessment Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-1 max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 relative group">
                
                {/* Background ambient gradient glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
                
                <div className="bg-slate-900/80 backdrop-blur-xl p-10 md:p-14 border border-slate-700/50 text-center relative z-10">
                    <div className="flex justify-center mb-8 relative">
                        <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                        <div className="p-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full shadow-lg border border-white/10 relative z-10 backdrop-blur-sm">
                            <BarChart2 className="text-blue-300 transform transition-transform hover:scale-110 hover:text-white" size={48} />
                        </div>
                    </div>
                    
                    <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-slate-400 mb-4 flex items-center justify-center gap-2">
                        <span className="w-12 h-[1px] bg-slate-600"></span>
                        Top Career Match
                        <span className="w-12 h-[1px] bg-slate-600"></span>
                    </h2>
                    
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h3 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-200 to-purple-400 mb-6 drop-shadow-sm pb-2">
                            {topCareer}
                        </h3>
                        <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
                            Based on your profile and interactions, we strongly recommend exploring opportunities as a <span className="font-semibold text-blue-300">{topCareer}</span>. Here are your personalized next steps:
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                            {/* Internships Button */}
                            <Link 
                                to={`/internships?q=${encodeURIComponent(topCareer)}`}
                                className="w-full md:w-auto px-8 py-4 bg-slate-800/80 hover:bg-amber-600/20 border border-slate-700 hover:border-amber-500/50 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-amber-500/30"
                            >
                                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                                    <GraduationCap className="text-slate-400 group-hover:text-amber-400 transition-colors" size={24} />
                                </div>
                                <span className="font-bold text-slate-200 group-hover:text-amber-50 transition-colors text-lg">Internships</span>
                                <ArrowRight className="text-amber-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" size={20} />
                            </Link>

                            {/* Courses Button */}
                            <Link 
                                to={`/courses?q=${encodeURIComponent(topCareer)}`}
                                className="w-full md:w-auto px-8 py-4 bg-slate-800/80 hover:bg-purple-600/20 border border-slate-700 hover:border-purple-500/50 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-purple-500/30"
                            >
                                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                                    <Clock className="text-slate-400 group-hover:text-purple-400 transition-colors" size={24} />
                                </div>
                                <span className="font-bold text-slate-200 group-hover:text-purple-50 transition-colors text-lg">Courses</span>
                                <ArrowRight className="text-purple-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" size={20} />
                            </Link>

                            {/* Jobs Button */}
                            <Link 
                                to={`/applications?q=${encodeURIComponent(topCareer)}`}
                                className="w-full md:w-auto px-8 py-4 bg-slate-800/80 hover:bg-green-600/20 border border-slate-700 hover:border-green-500/50 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_0_30px_-5px_var(--tw-shadow-color)] shadow-green-500/30"
                            >
                                <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-green-500/20 transition-colors">
                                    <Briefcase className="text-slate-400 group-hover:text-green-400 transition-colors" size={24} />
                                </div>
                                <span className="font-bold text-slate-200 group-hover:text-green-50 transition-colors text-lg">Jobs</span>
                                <ArrowRight className="text-green-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
