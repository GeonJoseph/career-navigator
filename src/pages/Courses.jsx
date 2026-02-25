<<<<<<< HEAD
import React from 'react';
import { BookOpen, Star, Clock } from 'lucide-react';

const Courses = () => {
    const courses = [
        {
            title: "Advanced React Patterns",
            provider: "Frontend Masters",
            duration: "6h 30m",
            rating: 4.8,
            category: "Frontend",
            color: "blue"
        },

        {
            title: "Figma for Developers",
            provider: "DesignCourse",
            duration: "4h 45m",
            rating: 4.9,
            category: "Design",
            color: "pink"
        }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Recommended Courses</h1>
            <p className="text-slate-400 text-lg">Curated learning paths to bridge your skill gaps.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <div key={index} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-${course.color}-900/30 text-${course.color}-400`}>
                            {course.category}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                        <p className="text-slate-400 text-sm mb-6">{course.provider}</p>

                        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} />
                                <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-yellow-500">
                                <Star size={16} fill="currentColor" />
                                <span>{course.rating}</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-medium transition-colors">
                            Start Learning
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
=======
import React from 'react';
import { BookOpen, Star, Clock } from 'lucide-react';

const Courses = () => {
    const courses = [
        {
            title: "Advanced React Patterns",
            provider: "Frontend Masters",
            duration: "6h 30m",
            rating: 4.8,
            category: "Frontend",
            color: "blue"
        },

        {
            title: "Figma for Developers",
            provider: "DesignCourse",
            duration: "4h 45m",
            rating: 4.9,
            category: "Design",
            color: "pink"
        }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Recommended Courses</h1>
            <p className="text-slate-400 text-lg">Curated learning paths to bridge your skill gaps.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <div key={index} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-${course.color}-900/30 text-${course.color}-400`}>
                            {course.category}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                        <p className="text-slate-400 text-sm mb-6">{course.provider}</p>

                        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-700/50">
                            <div className="flex items-center gap-1.5">
                                <Clock size={16} />
                                <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-yellow-500">
                                <Star size={16} fill="currentColor" />
                                <span>{course.rating}</span>
                            </div>
                        </div>

                        <button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-xl font-medium transition-colors">
                            Start Learning
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
