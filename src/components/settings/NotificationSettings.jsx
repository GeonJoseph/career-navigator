<<<<<<< HEAD
import React from 'react';

const NotificationSettings = () => {
    return (
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
    );
};

export default NotificationSettings;
=======
import React from 'react';

const NotificationSettings = () => {
    return (
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
    );
};

export default NotificationSettings;
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
