import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
    Briefcase,
    GraduationCap,
    BookOpen,
    ArrowLeft,
    ExternalLink,
    Star,
    Clock,
    MapPin,
    TrendingUp
} from 'lucide-react';

const CareerDetail = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || 'Software Engineer';

    const [jobs, setJobs] = useState([]);
    const [internships, setInternships] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [jobsRes, internshipsRes, coursesRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/jobs?q=${encodeURIComponent(query)}`),
                    fetch(`http://localhost:8000/api/internships?q=${encodeURIComponent(query)}`),
                    fetch(`http://localhost:8000/api/courses?q=${encodeURIComponent(query)}`)
                ]);

                const [jobsData, internshipsData, coursesData] = await Promise.all([
                    jobsRes.json(),
                    internshipsRes.json(),
                    coursesRes.json()
                ]);

                setJobs(jobsData.slice(0, 3));
                setInternships(internshipsData.slice(0, 3));
                setCourses(coursesData.slice(0, 3));
            } catch (error) {
                console.error("Error fetching career data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-lg font-medium">Curating your career dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Header */}
            <div className="space-y-4">
                <Link to="/results" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Results
                </Link>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                            <TrendingUp size={14} />
                            High Match Career
                        </div>
                        <h1 className="text-5xl font-bold text-white tracking-tight">{query}</h1>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Everything you need to succeed as a {query}. Explore the latest opportunities and skill-up with curated courses.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Jobs Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Briefcase size={22} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Top Job Openings</h2>
                        </div>
                        <Link to={`/applications?q=${encodeURIComponent(query)}`} className="text-sm font-bold text-blue-400 hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job, idx) => (
                            <div key={idx} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/40 hover:border-blue-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                                    <p className="text-slate-400 text-sm">{job.company} • {job.location}</p>
                                </div>
                                <a
                                    href={job.redirect_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2"
                                >
                                    Apply
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Internships Section */}
                    <div className="flex items-center justify-between pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                <GraduationCap size={22} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Internship Leads</h2>
                        </div>
                        <Link to={`/internships?q=${encodeURIComponent(query)}`} className="text-sm font-bold text-purple-400 hover:underline">
                            View All
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {internships.map((intern, idx) => (
                            <div key={idx} className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/40 hover:border-purple-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-white">{intern.title}</h3>
                                    <p className="text-slate-400 text-sm">{intern.company} • {intern.location}</p>
                                </div>
                                <a
                                    href={intern.redirect_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-bold text-white transition-colors flex items-center gap-2"
                                >
                                    Details
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Courses Sidebar */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                                <BookOpen size={22} />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Top Courses</h2>
                        </div>
                        <Link to={`/courses?q=${encodeURIComponent(query)}`} className="text-sm font-bold text-green-400 hover:underline">
                            Full List
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {courses.map((course, idx) => (
                            <div key={idx} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/40 hover:border-green-500/30 transition-all space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-start gap-4">
                                        <h3 className="font-bold text-white leading-tight">{course.title}</h3>
                                        <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                            <Star size={12} fill="currentColor" />
                                            {course.rating}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{course.provider}</p>
                                </div>
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-slate-400">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                                    <a href={course.url} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors">
                                        Enroll Now <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerDetail;
