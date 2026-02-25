<<<<<<< HEAD
import React from 'react';
import { CheckCircle, BarChart2, TrendingUp } from 'lucide-react';

const Results = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Your Assessment Results</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <BarChart2 className="text-blue-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Top Career Matches</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 flex justify-between items-center hover:border-blue-500/30 transition-colors">
                            <span className="font-medium text-slate-200">Frontend Engineer</span>
                            <span className="text-green-400 font-bold"></span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 flex justify-between items-center hover:border-blue-500/30 transition-colors">
                            <span className="font-medium text-slate-200">UX Designer</span>
                            <span className="text-green-400 font-bold"></span>
                        </div>
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 flex justify-between items-center hover:border-blue-500/30 transition-colors">
                            <span className="font-medium text-slate-200">Full Stack Developer</span>
                            <span className="text-green-400 font-bold"></span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <TrendingUp className="text-purple-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Skill Gap Analysis</h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-300">React & Modern JS</span>
                                <span className="text-blue-400">Advanced</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[90%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-300">Backend System Design</span>
                                <span className="text-orange-400">Intermediate</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 w-[60%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-slate-300">DevOps & CI/CD</span>
                                <span className="text-slate-400">Beginner</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-slate-500 w-[30%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
=======
import React from 'react';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { CheckCircle, BarChart2, TrendingUp } from 'lucide-react';

const Results = () => {
    const savedResults = localStorage.getItem("careerResults");

    const [recommendations, setRecommendations] = useState([]);
    useEffect(() => {
        const savedResults = localStorage.getItem("careerResults");
        if (savedResults) {
            setRecommendations(JSON.parse(savedResults));
        }
    }, []);


    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Your Assessment Results</h1>

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <BarChart2 className="text-blue-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Top Career Matches</h2>
                    </div>
                    <div className="space-y-4">
                        {recommendations.map((career, index) => (
                            <div
                                key={index}
                                className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30 flex justify-between items-center hover:border-blue-500/30 transition-colors"
                            >
                                <span className="font-medium text-slate-200">{career}</span>
                                <span className="text-green-400 font-bold">
                                    {90 - index * 5}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
