import React, { useState } from 'react';
const Applications = () => {
    const [applications] = useState([
        { id: 1, company: 'Google', role: 'Frontend Engineer', status: 'Applied', date: '2023-10-15', color: 'bg-blue-100 text-blue-700' },
        { id: 2, company: 'Microsoft', role: 'Full Stack Dev', status: 'Interview', date: '2023-10-12', color: 'bg-purple-100 text-purple-700' },
        { id: 3, company: 'Netflix', role: 'UI Engineer', status: 'Rejected', date: '2023-10-10', color: 'bg-red-100 text-red-700' },
        { id: 4, company: 'Amazon', role: 'SDE II', status: 'Offer', date: '2023-10-05', color: 'bg-green-100 text-green-700' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800">Jobs</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-slate-500">Company</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Role</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Date Applied</th>
                            <th className="px-6 py-4 font-medium text-slate-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.filter(app => app.role === 'Frontend Engineer').map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-800">{app.company}</td>
                                <td className="px-6 py-4 text-slate-600">{app.role}</td>
                                <td className="px-6 py-4 text-slate-500">{app.date}</td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 hover:underline">Apply</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Applications;
