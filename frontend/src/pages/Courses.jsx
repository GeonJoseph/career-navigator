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
            const token = localStorage.getItem("access_token");
            const response = await fetch(`http://127.0.0.1:8000/api/courses?query=${query}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return;
            }
            if (response.ok) {
                setCourses(Array.isArray(data) ? data : (data.results || []));
            } else {
                console.error("API Error:", data);
                setCourses([]);
            }
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

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">Recommended Courses</h1>

            <form onSubmit={handleSearch} className="flex gap-4 glass-card p-4 rounded-2xl border-white/10 shadow-xl">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses..."
                    className="flex-1 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-light"
                />
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                    Search
                </button>
            </form>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading courses...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <div key={index} className="glass-card p-6 rounded-3xl group flex flex-col hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                            <div className="inline-block px-3 py-1 rounded-full text-xs font-black mb-4 bg-blue-500/10 text-blue-400 w-fit tracking-wider uppercase">
                                {course.category || "General"}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">{course.title}</h3>
                            <p className="text-slate-400 text-sm mb-6 flex-grow font-light">{course.provider}</p>

                            <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={16} className="text-slate-400" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-amber-400">
                                    <Star size={16} fill="currentColor" />
                                    <span className="font-bold">{course.rating}</span>
                                </div>
                            </div>

                            <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-6 bg-slate-800 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn border border-white/5"
                            >
                                Start Learning
                                <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
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
