import React, { useState, useEffect } from 'react';

const ProfileSettings = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        firstName: data.first_name || '',
                        lastName: data.last_name || '',
                        email: data.email || ''
                    });
                    setProfilePic(data.profile_photo);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    profile_photo: profilePic
                })
            });

            if (response.ok) {
                localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
                alert('Profile saved to database successfully!');
                window.location.reload(); 
            } else {
                alert('Failed to save profile.');
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert('An error occurred while saving.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setProfilePic(null);
    };

    if (loading) return <div className="p-6 text-slate-500">Loading your profile...</div>;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-['style:letter-spacing:-0.02em']">Profile Information</h2>
            <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl font-black overflow-hidden shadow-inner border border-blue-200">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        formData.firstName ? (
                            `${formData.firstName.charAt(0)}${formData.lastName?.[0] || ''}`.toUpperCase()
                        ) : (
                            formData.email?.charAt(0).toUpperCase() || 'U'
                        )
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/20 text-sm">
                        Change Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                    <button onClick={handleRemovePhoto} className="px-5 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium">
                        Remove Photo
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="Alex"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 transition-all font-medium"
                            placeholder="Rivera"
                        />
                    </div>
                </div>
                <div className="pt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/25 active:scale-95"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSettings;
