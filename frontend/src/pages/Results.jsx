import React, { useState, useEffect } from 'react';
import { Trophy, Briefcase, GraduationCap, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
    const [bestMatch, setBestMatch] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedResults = localStorage.getItem("careerResults");
        if (savedResults) {
            const results = JSON.parse(savedResults);
            // Pick only the top/best career match
            setBestMatch(Array.isArray(results) ? results[0] : results);
        } else {
            setBestMatch('Full Stack Developer');
        }
    }, []);

    if (!bestMatch) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-slate-400 text-lg">No assessment results found. Please take the assessment first.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            {/* Celebration Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full mb-2">
                    <Trophy className="text-yellow-400" size={40} />
                </div>
                <h1 className="text-4xl font-bold text-white">Your Best Career Match</h1>
                <p className="text-slate-400 text-lg">Based on your assessment, here's the career that suits you the most.</p>
            </div>

            {/* Best Match Card */}
            <div className="w-full max-w-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 rounded-3xl border border-blue-500/30 shadow-2xl shadow-blue-500/5">
                <div className="text-center space-y-4 mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 rounded-full">
                        <Sparkles size={14} className="text-blue-400" />
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Best Match</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">{bestMatch}</h2>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate(`/applications?q=${encodeURIComponent(bestMatch)}`)}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-800/60 hover:bg-blue-600/20 border border-slate-700/50 hover:border-blue-500/50 transition-all text-slate-300 hover:text-blue-400 group"
                    >
                        <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                            <Briefcase size={24} />
                        </div>
                        <span className="text-sm font-bold">Find Jobs</span>
                    </button>
                    <button
                        onClick={() => navigate(`/internships?q=${encodeURIComponent(bestMatch)}`)}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-800/60 hover:bg-purple-600/20 border border-slate-700/50 hover:border-purple-500/50 transition-all text-slate-300 hover:text-purple-400 group"
                    >
                        <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-sm font-bold">Find Internships</span>
                    </button>
                    <button
                        onClick={() => navigate(`/courses?q=${encodeURIComponent(bestMatch)}`)}
                        className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-800/60 hover:bg-green-600/20 border border-slate-700/50 hover:border-green-500/50 transition-all text-slate-300 hover:text-green-400 group"
                    >
                        <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                            <BookOpen size={24} />
                        </div>
                        <span className="text-sm font-bold">Find Courses</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
