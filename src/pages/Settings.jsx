<<<<<<< HEAD
import React, { useState } from 'react';
import { User, Shield, ChevronRight } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
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
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'security' && <SecuritySettings />}
                </div>
            </div>
        </div>
    );
};

export default Settings;
=======
import React, { useState } from 'react';
import { User, Shield, ChevronRight } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
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
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'security' && <SecuritySettings />}
                </div>
            </div>
        </div>
    );
};

export default Settings;
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
