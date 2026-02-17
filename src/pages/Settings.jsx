import React, { useState } from 'react';
import { User, Bell, Shield, ChevronRight } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        jobTitle: 'Software Engineer',
    });

    // Mock state for profile picture
    const [profilePic, setProfilePic] = useState(null);

    React.useEffect(() => {
        const savedData = localStorage.getItem('userProfile');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem('userProfile', JSON.stringify(formData));
        // Update global user name if needed (optional)
        localStorage.setItem('userName', `${formData.firstName} ${formData.lastName}`);
        alert('Profile saved successfully!');
        window.location.reload(); // To update the Navbar user name
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

    const handlePasswordChange = (e) => {
        e.preventDefault();
        alert("Password update simulated. In a real app, this would verify and update your credentials.");
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden h-fit">
                    <nav className="flex flex-col">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center justify-between p-4 text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.label}</span>
                                    </div>
                                    {activeTab === tab.id && <ChevronRight size={16} />}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Information</h2>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden">
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`
                                    )}
                                </div>
                                <div>
                                    <label className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors mr-3 cursor-pointer">
                                        Change Photo
                                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                    </label>
                                    <button onClick={handleRemovePhoto} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                    />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h2>
                            <div className="space-y-4">
                                {['Email Alerts for New Jobs', 'Application Status Updates', 'Weekly Newsletter', 'Direct Messages'].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                                        <span className="font-medium text-slate-700">{item}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked={index < 2} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Security</h2>
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
