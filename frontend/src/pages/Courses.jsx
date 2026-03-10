import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Clock, ExternalLink } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Courses = () => {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('q');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(queryParam || "React");

    const fetchCourses = async (query) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/courses?q=${query}`);
            const data = await response.json();
            setCourses(data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const query = queryParam || "React";
        setSearchTerm(query);
        fetchCourses(query);
    }, [queryParam]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(searchTerm);
    };
>>>>>>> 368b1368cac1415e0ddfdeb1323fc4dafa34dc81

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Recommended Courses</h1>

            <form onSubmit={handleSearch} className="flex gap-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses..."
                    className="flex-1 p-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading courses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all hover:-translate-y-1 group flex flex-col">
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-blue-900/30 text-blue-400 w-fit`}>
                                {course.category || "General"}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 flex-grow">{course.provider}</p>

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

                            <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                Start Learning
                                <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-400">No courses found matching "{searchTerm}".</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Courses;
