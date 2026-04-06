import React, { useState, useEffect } from 'react';
import { BarChart2, Briefcase, GraduationCap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";

const Results = () => {
    const [topCareer, setTopCareer] = useState(null);

    const location = useLocation();

    useEffect(() => {
        const savedResults = localStorage.getItem("careerResults");

        console.log("RESULT PAGE READ:", savedResults);

        if (savedResults) {
            const parsed = JSON.parse(savedResults);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setTopCareer(parsed[0]);
            }
        } else {
            setTopCareer(null);
        }
    }, [location]); // 🔥 critical

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
                    
                    {topCareer ? (
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
                    ) : (
                        <div className="py-12 border border-dashed border-slate-700 rounded-2xl bg-slate-800/20">
                            <p className="text-slate-400 text-lg">
                                Take the assessment with the Career Bot to see your personalized recommendations.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
