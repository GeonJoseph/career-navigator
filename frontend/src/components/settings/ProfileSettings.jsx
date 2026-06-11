import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, Loader2, Save, CheckCircle2, GraduationCap, Briefcase, Lock, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../../utils/api';


const ProfileSettings = () => {

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        name: '',
        profile_photo: '',
        user_type: 'student',
        skills: '',
        dob: '',
        interests: '',
        marks: []
    });
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const [isLocked, setIsLocked] = useState(false);   // 🔒 profile already complete
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await apiFetch('/api/user/profile');
            if (response.ok) {
                const data = await response.json();
                const processedData = {
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    name: data.name || '',
                    profile_photo: data.profile_photo || '',
                    user_type: data.user_type || 'student',
                    skills: data.skills || '',
                    dob: data.dob || '',
                    interests: data.interests || '',
                    marks: data.marks || []
                };
                setProfileData(processedData);

                if (!data.marks || data.marks.length === 0) {
                    setProfileData(prev => ({
                        ...prev,
                        marks: [{ subject: "", score: "", total: "" }]
                    }));
                }

                setOriginalData(processedData);

                // 🔒 Lock if profile is already complete
                if (data.is_profile_complete) {
                    setIsLocked(true);
                    localStorage.setItem('profile_completed', 'true');
                }

            } else if (response.status === 401) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("userRole");
                window.location.href = "/login";
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        if (isLocked) return;
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        setSuccess(false);
    };

    const addMarkField = () => {
        if (isLocked) return;
        setProfileData(prev => ({
            ...prev,
            marks: [...(prev.marks || []), { subject: "", score: "", total: "" }]
        }));
    };

    const handleMarksChange = (index, field, value) => {
        if (isLocked) return;
        const updated = Array.isArray(profileData.marks)
            ? [...profileData.marks]
            : [];
        updated[index][field] = value;
        setProfileData(prev => ({
            ...prev,
            marks: updated
        }));
    };

    const removeMarkField = (index) => {
        if (isLocked) return;
        const updated = profileData.marks.filter((_, i) => i !== index);
        setProfileData(prev => ({
            ...prev,
            marks: updated
        }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be smaller than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({ ...prev, profile_photo: reader.result }));
                setSuccess(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setProfileData(prev => ({ ...prev, profile_photo: '' }));
        setSuccess(false);
    };

    const hasChanges = () => {
        if (!originalData) return true;
        return JSON.stringify(profileData) !== JSON.stringify(originalData);
    };

    const isFormValid = () => {
        return (
            profileData.first_name.trim() !== '' &&
            profileData.last_name.trim() !== '' &&
            profileData.skills.trim() !== ''
        );
    };

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            const token = localStorage.getItem('access_token');

            // Photo-only update when profile is locked
            if (isLocked) {
                if (profileData.profile_photo === originalData?.profile_photo) {
                    setLoading(false);
                    return;
                }
                const photoForm = new FormData();
                photoForm.append('profile_photo', profileData.profile_photo);
                const photoRes = await apiFetch('/api/user/profile', {
                    method: 'PUT',
                    body: photoForm
                });
                if (photoRes.ok) {
                    setOriginalData(prev => ({ ...prev, profile_photo: profileData.profile_photo }));
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                } else {
                    const err = await photoRes.json();
                    alert(err.detail || 'Failed to update photo');
                }
                setLoading(false);
                return;
            }

            const formData = new FormData();

            formData.append('first_name', profileData.first_name);
            formData.append('last_name', profileData.last_name);
            formData.append('user_type', profileData.user_type);
            formData.append('skills', profileData.skills);
            formData.append('dob', profileData.dob);
            formData.append('interests', profileData.interests);
            const cleanedMarks = profileData.marks.filter(
                m => m.subject && m.score && m.total
            );
            formData.append('marks', JSON.stringify(cleanedMarks));

            if (profileData.profile_photo !== originalData.profile_photo) {
                formData.append('profile_photo', profileData.profile_photo);
            }

            const response = await apiFetch('/api/user/profile', {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                setOriginalData(profileData);
                setSuccess(true);
                setIsLocked(true);              // 🔒 lock immediately after first save
                localStorage.setItem('profile_completed', 'true');
                setTimeout(() => setSuccess(false), 4000);
            } else {
                const errorData = await response.json();
                alert(errorData.detail || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    // ── Loading spinner ──────────────────────────────────────────────────
    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64 bg-[#0A0A0A]/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const initials = (profileData.first_name?.[0] || profileData.name?.[0] || '?').toUpperCase();
    const avatarGradient = `linear-gradient(135deg, #3B82F6 0%, #10B981 100%)`;

    // ── Shared input class helpers ────────────────────────────────────────
    const inputClass = (extra = '') =>
        `w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-sm font-medium ${
            isLocked
                ? 'bg-slate-800/40 border-white/5 text-slate-400 cursor-not-allowed select-none'
                : 'bg-slate-950/50 border-white/10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder:text-slate-500'
        } ${extra}`;

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-sm font-sans animate-in fade-in">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-500" />
                        Personal Information
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        {isLocked ? 'Your profile is saved and locked.' : 'Fill in your details and save once to lock your profile.'}
                    </p>
                </div>
                {isLocked && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                        <ShieldCheck className="w-4 h-4" />
                        Profile Locked
                    </div>
                )}
            </div>

            {/* ── Locked banner ── */}
            {isLocked && (
                <div className="mb-6 bg-amber-500/10 text-amber-300 p-4 rounded-xl text-sm font-medium border border-amber-500/20 flex items-center gap-3">
                    <Lock className="w-5 h-5 flex-shrink-0" />
                    <span>
                        Your profile has been created.
                    </span>
                </div>
            )}

            {/* ── Success banner ── */}
            {success && (
                <div className="mb-6 bg-green-500/10 text-green-400 p-4 rounded-xl text-sm font-medium border border-green-500/20 flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Profile saved and locked successfully!
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

                {/* ── Avatar column ── */}
                <div className="lg:col-span-1 flex flex-col items-center gap-4">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {profileData.profile_photo ? (
                            <img src={profileData.profile_photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-900 shadow-xl bg-slate-800" />
                        ) : (
                            <div
                                className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center text-4xl font-bold text-white"
                                style={{ background: avatarGradient }}
                            >
                                {initials}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full">
                        <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-4 py-2 rounded-lg transition-colors w-full">
                            Change Photo
                        </button>
                        {profileData.profile_photo && (
                            <button onClick={removePhoto} className="text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors w-full">
                                Remove
                            </button>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                </div>

                {/* ── Form column ── */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="text-lg font-bold text-white">Basic Profile</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0A0A]/40 p-6 rounded-2xl border border-white/5">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">First Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text" name="first_name" value={profileData.first_name} onChange={handleChange}
                                    readOnly={isLocked}
                                    className={inputClass()}
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Last Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text" name="last_name" value={profileData.last_name} onChange={handleChange}
                                    readOnly={isLocked}
                                    className={inputClass()}
                                    placeholder="Last Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Date of Birth</label>
                                <input
                                    type="date" name="dob" value={profileData.dob} onChange={handleChange}
                                    readOnly={isLocked}
                                    className={inputClass()}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300">
                                    Skills <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={profileData.skills}
                                    onChange={handleChange}
                                    readOnly={isLocked}
                                    className={inputClass()}
                                    placeholder="Python, React, SQL..."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300">A Personal Bio (Hobbies, Passions) <span className="text-slate-500 font-normal text-xs">(optional)</span></label>
                                <textarea
                                    name="interests" value={profileData.interests} onChange={handleChange} rows={3}
                                    readOnly={isLocked}
                                    className={inputClass('resize-none')}
                                    placeholder="I enjoy hiking, reading sci-fi, building side projects..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Type */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">User Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => !isLocked && setProfileData(prev => ({...prev, user_type: 'student'}))}
                                className={`p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                                    isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                } ${
                                    profileData.user_type === 'student' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-[#0A0A0A]/40 hover:border-white/20'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${profileData.user_type === 'student' ? 'text-blue-400 bg-blue-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${profileData.user_type === 'student' ? 'text-blue-400' : 'text-slate-200'}`}>Student</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Currently in school. You can enter your subject-wise marks to improve recommendations</p>
                                </div>
                            </div>

                            <div
                                onClick={() => !isLocked && setProfileData(prev => ({...prev, user_type: 'professional'}))}
                                className={`p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                                    isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                                } ${
                                    profileData.user_type === 'professional' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-[#0A0A0A]/40 hover:border-white/20'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${profileData.user_type === 'professional' ? 'text-purple-400 bg-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${profileData.user_type === 'professional' ? 'text-purple-400' : 'text-slate-200'}`}>Professional / Graduate</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Completed UG/PG or currently working. You can upload your resume/CV to get job recommendation</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Student → Marks */}
                    {profileData.user_type === "student" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Academic Performance</h3>
                            {(profileData.marks || []).map((item, index) => (
                                <div key={index} className="grid grid-cols-4 gap-3 items-center">
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={item.subject}
                                        readOnly={isLocked}
                                        onChange={(e) => handleMarksChange(index, "subject", e.target.value)}
                                        className={`p-2 rounded-lg border text-white ${isLocked ? 'bg-slate-800/40 border-white/5 text-slate-400 cursor-not-allowed' : 'bg-slate-900 border-white/10'}`}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Marks"
                                        value={item.score}
                                        readOnly={isLocked}
                                        onChange={(e) => handleMarksChange(index, "score", e.target.value)}
                                        className={`p-2 rounded-lg border text-white ${isLocked ? 'bg-slate-800/40 border-white/5 text-slate-400 cursor-not-allowed' : 'bg-slate-900 border-white/10'}`}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Out of"
                                        value={item.total}
                                        readOnly={isLocked}
                                        onChange={(e) => handleMarksChange(index, "total", e.target.value)}
                                        className={`p-2 rounded-lg border text-white ${isLocked ? 'bg-slate-800/40 border-white/5 text-slate-400 cursor-not-allowed' : 'bg-slate-900 border-white/10'}`}
                                    />
                                    {!isLocked && (
                                        <button type="button" onClick={() => removeMarkField(index)} className="text-red-400 hover:text-red-300 font-bold text-lg">✕</button>
                                    )}
                                    {isLocked && <span />}
                                </div>
                            ))}
                            {!isLocked && (
                                <button onClick={addMarkField} className="text-blue-400 text-sm hover:text-blue-300">+ Add Subject</button>
                            )}
                        </div>
                    )}

                    {/* Professional → Resume */}
                    {profileData.user_type === "professional" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Resume Analysis</h3>
                            <button
                                onClick={() => window.location.href = "/resume-analyzer"}
                                className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-500"
                            >
                                Go to Resume Analyzer
                            </button>
                        </div>
                    )}

                    {/* Save / Locked footer */}
                    <div className="pt-8 border-t border-white/10 flex justify-end">
                    {isLocked ? (
                        <div className="flex items-center gap-3">
                            {profileData.profile_photo !== originalData?.profile_photo && (
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-3 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/50 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                                    {loading ? 'Saving...' : 'Save Photo'}
                                </button>
                            )}
                            <div className="flex items-center gap-2 px-8 py-3 rounded-xl bg-slate-800/60 border border-white/5 text-slate-500 font-semibold text-sm cursor-not-allowed select-none">
                                <Lock className="w-4 h-4" />
                                Profile Locked — Cannot Edit
                            </div>
                        </div>
                        ) : (
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges() || !isFormValid() || loading}
                                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                    !hasChanges() || !isFormValid()
                                    ? 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/50 active:scale-95'
                                }`}
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {loading ? 'Saving...' : 'Save Profile'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
