import React, { useState, useEffect, useRef } from 'react';
import { Camera, User, Loader2, Save, FileText, CheckCircle2, GraduationCap, Briefcase, ChevronDown } from 'lucide-react';

const ProfileSettings = () => {
    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        name: '',
        profile_photo: '',
        user_type: 'student',
        document_filename: '',
        current_title: '',
        target_title: '',
        experience_level: 'junior',
        skills: '',
        dob: '',
        phone_number: '',
        country_code: '',
        languages: '',
        interests: '',
        linkedin_url: ''
    });
    const [originalData, setOriginalData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const pdfInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const processedData = {
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    name: data.name || '',
                    profile_photo: data.profile_photo || '',
                    user_type: data.user_type || 'student',
                    document_filename: data.document_filename || '',
                    current_title: data.current_title || '',
                    target_title: data.target_title || '',
                    experience_level: data.experience_level || 'junior',
                    skills: data.skills || '',
                    dob: data.dob || '',
                    phone_number: data.phone_number ? 
                        (data.phone_number.startsWith('+') && data.phone_number.includes(' ') 
                            ? data.phone_number.substring(data.phone_number.indexOf(' ') + 1) 
                            : data.phone_number) 
                        : '',
                    country_code: data.phone_number && data.phone_number.startsWith('+') && data.phone_number.includes(' ')
                        ? data.phone_number.split(' ')[0]
                        : '',
                    languages: data.languages || '',
                    interests: data.interests || '',
                    linkedin_url: data.linkedin_url || ''
                };
                setProfileData(processedData);
                setOriginalData(processedData);
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
        const { name, value } = e.target;
        // Strip non-numeric from phone_number
        if (name === 'phone_number') {
            const numericValue = value.replace(/[^\d() -]/g, '');
            setProfileData(prev => ({ ...prev, [name]: numericValue }));
        } else {
            setProfileData(prev => ({ ...prev, [name]: value }));
        }
        setSuccess(false);
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

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                alert("Please upload a PDF file.");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert("Document must be smaller than 10MB");
                return;
            }
            setSelectedFile(file);
            setProfileData(prev => ({ ...prev, document_filename: file.name }));
            setSuccess(false);
        }
    };

    const removePhoto = () => {
        setProfileData(prev => ({ ...prev, profile_photo: '' }));
        setSuccess(false);
    };

    const hasChanges = () => {
        if (!originalData) return false;
        if (selectedFile !== null) return true; // new document to upload
        return JSON.stringify(profileData) !== JSON.stringify(originalData);
    };

    const isFormValid = () => {
        // Must have first name, last name, phone number + country code, and a document
        return profileData.first_name.trim() !== '' && 
               profileData.last_name.trim() !== '' && 
               profileData.country_code.trim() !== '' &&
               profileData.phone_number.trim() !== '' &&
               (selectedFile !== null || profileData.document_filename);
    };

    const handleSave = async () => {
        setLoading(true);
        setSuccess(false);
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            
            formData.append('first_name', profileData.first_name);
            formData.append('last_name', profileData.last_name);
            formData.append('user_type', profileData.user_type);
            formData.append('current_title', profileData.current_title);
            formData.append('target_title', profileData.target_title);
            formData.append('experience_level', profileData.experience_level);
            formData.append('skills', profileData.skills);
            formData.append('dob', profileData.dob);
            
            const fullPhoneNumber = profileData.country_code ? `${profileData.country_code} ${profileData.phone_number.replace(/^\+?\d+\s*/, '')}` : profileData.phone_number;
            formData.append('phone_number', fullPhoneNumber);
            
            formData.append('languages', profileData.languages);
            formData.append('interests', profileData.interests);
            formData.append('linkedin_url', profileData.linkedin_url);
            
            if (profileData.profile_photo !== originalData.profile_photo) {
                formData.append('profile_photo', profileData.profile_photo);
            }
            
            if (selectedFile) {
                formData.append('document', selectedFile);
            }

            const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setOriginalData(profileData);
                setSelectedFile(null);
                setSuccess(true);
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

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-64 bg-[#0A0A0A]/50 rounded-2xl border border-white/5 backdrop-blur-md">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const docLabel = profileData.user_type === 'professional' ? "Upload Resume" : "Upload Marklist";
    const docDesc = profileData.user_type === 'professional' ? "Please upload your latest resume/CV (PDF)." : "Please upload your aggregate academic marklist (PDF).";

    const initials = (profileData.first_name?.[0] || profileData.name?.[0] || '?').toUpperCase();
    const avatarGradient = `linear-gradient(135deg, #3B82F6 0%, #10B981 100%)`;

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-sm font-sans animate-in fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <User className="w-6 h-6 text-blue-500" />
                        Personal Information
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Update your basic details and career documents.</p>
                </div>
            </div>

            {success && (
                <div className="mb-6 bg-green-500/10 text-green-400 p-4 rounded-xl text-sm font-medium border border-green-500/20 flex items-center gap-2 animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Profile updated and document analyzed successfully!
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {profileData.profile_photo ? (
                            <img src={profileData.profile_photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-900 shadow-xl bg-slate-800" />
                        ) : (
                            <div 
                                className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center text-4xl font-bold text-white shadow-blue-500/10"
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

                <div className="lg:col-span-3 space-y-8">
                    {/* Basic Info & AI Context */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h3 className="text-lg font-bold text-white">Basic Profile</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0A0A0A]/40 p-6 rounded-2xl border border-white/5">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">First Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text" name="first_name" value={profileData.first_name} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-200 placeholder:text-slate-500"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Last Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text" name="last_name" value={profileData.last_name} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium text-slate-200 placeholder:text-slate-500"
                                    placeholder="Last Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Date of Birth</label>
                                <input
                                    type="date" name="dob" value={profileData.dob} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-200 text-sm font-medium placeholder:text-slate-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Phone Number <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <div className="relative w-1/3">
                                        <select
                                            name="country_code"
                                            value={profileData.country_code}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-200 text-sm font-medium outline-none appearance-none pr-8"
                                        >
                                            <option value="">+ Ext</option>
                                            <option value="+1">+1 (US/CA)</option>
                                            <option value="+44">+44 (UK)</option>
                                            <option value="+91">+91 (IN)</option>
                                            <option value="+61">+61 (AU)</option>
                                            <option value="+81">+81 (JP)</option>
                                            <option value="+86">+86 (CN)</option>
                                            <option value="+49">+49 (DE)</option>
                                            <option value="+33">+33 (FR)</option>
                                            <option value="+971">+971 (AE)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <input
                                        type="tel" name="phone_number" value={profileData.phone_number} onChange={handleChange}
                                        className="w-2/3 px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-200 text-sm font-medium placeholder:text-slate-500 outline-none"
                                        placeholder="(xxx) xxx-xxxx"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-300">Languages Spoken</label>
                                <input
                                    type="text" name="languages" value={profileData.languages} onChange={handleChange}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-200 text-sm font-medium placeholder:text-slate-500"
                                    placeholder="English, Spanish, etc."
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-semibold text-slate-300">A Personal Bio (Hobbies, Passions)</label>
                                <textarea
                                    name="interests" value={profileData.interests} onChange={handleChange} rows={3}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-200 text-sm font-medium placeholder:text-slate-500 resize-none"
                                    placeholder="I enjoy hiking, reading sci-fi, building side projects..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Career Category */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">User Type</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => setProfileData(prev => ({...prev, user_type: 'student'}))}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                                    profileData.user_type === 'student' ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-[#0A0A0A]/40 hover:border-white/20'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${profileData.user_type === 'student' ? 'text-blue-400 bg-blue-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${profileData.user_type === 'student' ? 'text-blue-400' : 'text-slate-200'}`}>Student</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Currently in  school. Requires uploading your academic marklists for guidance.</p>
                                </div>
                            </div>

                            <div 
                                onClick={() => setProfileData(prev => ({...prev, user_type: 'professional'}))}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                                    profileData.user_type === 'professional' ? 'border-purple-500 bg-purple-500/10' : 'border-white/5 bg-[#0A0A0A]/40 hover:border-white/20'
                                }`}
                            >
                                <div className={`p-2 rounded-lg ${profileData.user_type === 'professional' ? 'text-purple-400 bg-purple-500/20' : 'bg-slate-800 text-slate-400'}`}>
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className={`font-bold ${profileData.user_type === 'professional' ? 'text-purple-400' : 'text-slate-200'}`}>Professional / Graduate</h4>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">Completed UG/PG or currently working. Requires uploading your latest Resume/CV.</p>
                                </div>
                            </div>
                        </div>
                    </div>




                    {/* Mandatory Document Upload */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Career Documents</h3>
                        <div className={`border-2 border-dashed ${profileData.document_filename ? 'border-green-500/50 bg-green-500/10' : 'border-white/20 bg-[#0A0A0A]/40'} rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm ${profileData.document_filename ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
                                <FileText className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-white mb-1">{docLabel} <span className="text-red-500">*</span></h4>
                            <p className="text-xs text-slate-400 mb-6 max-w-sm">{docDesc} This is mandatory to use the  chatbot feature.</p>
                            
                            <input type="file" ref={pdfInputRef} onChange={handlePdfUpload} accept=".pdf,application/pdf" className="hidden" />
                            
                            <button onClick={() => pdfInputRef.current?.click()} className="px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-700 transition-colors border border-white/10 shadow-lg shadow-slate-900/50 active:scale-95">
                                {profileData.document_filename ? "Replace File" : "Select PDF File"}
                            </button>

                            {profileData.document_filename && (
                                <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-white/10 rounded-md text-xs font-semibold text-slate-300">
                                    {profileData.document_filename}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex justify-end">
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
                            {loading ? 'Analyzing & Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
