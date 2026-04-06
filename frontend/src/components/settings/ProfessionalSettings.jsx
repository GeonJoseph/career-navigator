import React, { useState, useEffect } from 'react';

const ProfessionalSettings = () => {
    const [formData, setFormData] = useState({
        currentTitle: '',
        targetTitle: '',
        experienceLevel: 'Entry-level',
        location: '',
        linkedinUrl: '',
        portfolioUrl: ''
    });
    const [skills, setSkills] = useState([]);
    const [skillInput, setSkillInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        currentTitle: data.current_title || '',
                        targetTitle: data.target_title || '',
                        experienceLevel: data.experience_level || 'Entry-level',
                        location: data.location || '',
                        linkedinUrl: data.linkedin_url || '',
                        portfolioUrl: data.portfolio_url || ''
                    });
                    setSkills(data.skills ? data.skills.split(',').filter(s => s) : []);
                }
            } catch (error) {
                console.error("Error fetching professional profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            e.preventDefault();
            if (!skills.includes(skillInput.trim())) {
                setSkills([...skills, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_title: formData.currentTitle,
                    target_title: formData.targetTitle,
                    experience_level: formData.experienceLevel,
                    location: formData.location,
                    linkedin_url: formData.linkedinUrl,
                    portfolio_url: formData.portfolioUrl,
                    skills: skills.join(',')
                })
            });

            if (response.ok) {
                alert('Professional info saved successfully!');
                // Auto-redirect or show next step
                if (window.confirm("Profile saved! Would you like to start your Career Assessment now?")) {
                    window.location.href = "/chat";
                }
            } else {
                alert('Failed to save professional info.');
            }
        } catch (error) {
            console.error("Error saving professional profile:", error);
            alert('An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-slate-500">Loading career details...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-['style:letter-spacing:-0.02em']">Career & Expertise</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Current Job Title</label>
                        <input
                            type="text"
                            name="currentTitle"
                            value={formData.currentTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="e.g. Computer Science Student"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Target Career Goal</label>
                        <input
                            type="text"
                            name="targetTitle"
                            value={formData.targetTitle}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="e.g. AI Engineer"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Experience Level</label>
                        <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                        >
                            <option value="Student">Student</option>
                            <option value="Entry-level">Entry-level</option>
                            <option value="Mid-career">Mid-career</option>
                            <option value="Senior">Senior</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Preferred Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="e.g. Bengaluru, India"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 ml-1">Skills & Industry Expertise</label>
                    <div className="min-h-[100px] p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {skills.map((skill, index) => (
                                <span key={index} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold border border-blue-200">
                                    {skill}
                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleAddSkill}
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-900 px-2 py-1"
                            placeholder="Type a skill and press Enter"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 ml-1 uppercase font-bold tracking-widest">Added skills help our Bot give better advice</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Portfolio URL</label>
                        <input
                            type="url"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/25 active:scale-95"
                    >
                        {saving ? 'Saving...' : 'Save Career Details'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfessionalSettings;
