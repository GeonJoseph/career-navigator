import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Shield, ChevronRight, Briefcase } from 'lucide-react';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';

const Settings = () => {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const tabs = [
        { id: 'profile', label: 'Personal & Career', icon: User },
        { id: 'security', label: 'Security & Login', icon: Shield },
    ];

    return (
        <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-black text-white tracking-tight">Account Settings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1 h-fit">
                        <nav className="flex flex-col gap-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-between p-4 rounded-xl text-left transition-all border ${
                                            isActive
                                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 shadow-md shadow-blue-900/20'
                                            : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                                            <span className="font-semibold text-sm">{tab.label}</span>
                                        </div>
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
        </div>
    );
};

export default Settings;
