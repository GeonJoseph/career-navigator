import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Search, Filter, X, Save } from 'lucide-react';

const AdminDashboard = () => {
    // Lazy initialization of users state
    const [users, setUsers] = useState(() => {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }

        const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'Student', status: 'Active', joined: '2025-10-15' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'Job Seeker', status: 'Active', joined: '2025-11-20' },
            { id: 3, name: 'Admin User', email: 'admin@careernavigator.io', password: 'admin123', role: 'Admin', status: 'Active', joined: '2025-09-01' },
            { id: 4, name: 'Mike Brown', email: 'mike@example.com', password: 'password123', role: 'Student', status: 'Inactive', joined: '2026-01-10' },
        ];

        localStorage.setItem('users', JSON.stringify(mockUsers));
        return mockUsers;
    });

    // Real-time synchronization
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'users') {
                setUsers(JSON.parse(e.newValue || '[]'));
            }
        };

        // Listen for storage events (updates from other tabs)
        window.addEventListener('storage', handleStorageChange);

        // Periodic refresh (updates within the same tab)
        const interval = setInterval(() => {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                const parsedUsers = JSON.parse(storedUsers);
                // Simple comparison to avoid unnecessary state updates
                if (JSON.stringify(parsedUsers) !== JSON.stringify(users)) {
                    setUsers(parsedUsers);
                }
            }
        }, 3000); // Check every 3 seconds

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [users]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('All');
    const [editingUser, setEditingUser] = useState(null);

    const handleEditClick = (user) => {
        setEditingUser({ ...user });
    };

    const handleSaveEdit = () => {
        const updatedUsers = users.map(u => u.id === editingUser.id ? editingUser : u);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setEditingUser(null);
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Monitor Status System</h1>
                        <p className="text-slate-400">Monitor system status and manage user roles</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Total Users</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                                <UserCheck size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Active Now</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.status === 'Active').length}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="text-slate-400" size={20} />
                        <select
                            className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                        >
                            <option value="All">All Roles</option>
                            <option value="Student">Student</option>
                            <option value="Job Seeker">Job Seeker</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{user.name}</p>
                                                    <p className="text-sm text-slate-400">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                user.role === 'Student' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-2 text-sm ${user.status === 'Active' ? 'text-green-400' : 'text-slate-400'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-slate-400'
                                                    }`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {user.joined}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-slate-400 hover:text-white transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                        No users found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-md p-6 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Edit User</h2>
                            <button onClick={handleCancelEdit} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    disabled
                                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-500 px-4 py-2 rounded-lg cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Job Seeker">Job Seeker</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                                <select
                                    value={editingUser.status}
                                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={handleCancelEdit}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
