import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';

const Results = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const savedResults = localStorage.getItem("careerResults");
        if (savedResults) {
            setRecommendations(JSON.parse(savedResults));
        } else {
            // Default mock results if none found
            setRecommendations(['Frontend Engineer', 'UX Designer', 'Full Stack Developer']);
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
                                    {95 - index * 5}% Match
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
