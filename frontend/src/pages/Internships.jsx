import React, { useState, useEffect } from 'react';
import { Search, MapPin, ExternalLink, GraduationCap } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';


function getCareerFromStorage() {
    try {
        const saved = JSON.parse(localStorage.getItem("careerResults"));
        return saved?.[0] || "";
    } catch {
        return "";
    }
}

const Internships = () => {
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('q');

    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(
    queryParam || getCareerFromStorage() || "Software Engineer"
    );
    const [location, setLocation] = useState("");

    const fetchInternships = async (query, loc) => {
        setLoading(true);
        try {
            const url = `http://127.0.0.1:8000/api/internships?query=${query}` + (loc ? `&location=${loc}` : '');
            const token = localStorage.getItem("access_token");
            const response = await fetch(url, {
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
                setInternships(Array.isArray(data) ? data : (data.results || []));
            } else {
                console.error("API Error:", data);
                setInternships([]);
            }
        } catch (error) {
            console.error("Error fetching internships:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const query = queryParam || getCareerFromStorage() || "Software Engineer";
        setSearchTerm(query);
        fetchInternships(query, location);
    }, [queryParam]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchInternships(searchTerm, location);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white mb-2">Internship Opportunities</h1>
            <p className="text-slate-400">Launch your career with real-world experience. Global search powered by JSearch.</p>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 glass-card p-6 rounded-3xl border-white/10 shadow-2xl">
                <div className="md:col-span-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Role, field of study..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="md:col-span-4 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location (city, country)..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20">
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-20 text-slate-400 space-y-4">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p>Finding the perfect internship...</p>
                    </div>
                ) : (
                    <>
                        {internships.map((intern, index) => (
                            <div key={index} className="glass-card p-6 rounded-3xl group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 active:scale-[0.99] transition-all">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <GraduationCap size={20} className="text-purple-400" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{intern.company}</h3>
                                    </div>
                                    <h4 className="text-lg text-slate-200 font-medium">{intern.title}</h4>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {intern.location}</span>
                                    </div>
                                </div>

                                    <a
                                        href={intern.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap active:scale-95 shadow-lg shadow-amber-500/20 group-hover:scale-105"
                                    >
                                        Apply
                                        <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </a>
                            </div>
                        ))}
                        {internships.length === 0 && (
                            <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
                                <p className="text-slate-500">No internships found. Try searching for "Frontend" or "Marketing" in different locations.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Internships;
