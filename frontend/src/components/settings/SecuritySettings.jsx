import React, { useState } from 'react';
import { Loader2, Shield, KeyRound, CheckCircle2 } from 'lucide-react';

const SecuritySettings = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setError('');
        setSuccess(false);
    };

    const isFormValid = passwords.currentPassword && passwords.newPassword && passwords.confirmPassword;

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (passwords.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch('http://127.0.0.1:8000/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    current_password: passwords.currentPassword,
                    new_password: passwords.newPassword
                })
            });

            if (response.ok) {
                setSuccess(true);
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setSuccess(false), 4000);
            } else {
                const data = await response.json();
                setError(data.detail || 'Failed to update password');
            }
        } catch (err) {
            console.error("Error changing password:", err);
            setError('Network error or API not implemented yet.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-2xl shadow-sm font-sans animate-in fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-500" />
                        Security Settings
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Manage your password and account security.</p>
                </div>
            </div>

            <form onSubmit={handlePasswordChange} className="max-w-xl space-y-6">
                
                {error && (
                    <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm border border-red-500/20 animate-in fade-in">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-500/10 text-green-400 p-4 rounded-xl text-sm border border-green-500/20 flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="w-5 h-5" />
                        Password updated successfully!
                    </div>
                )}

                <div className="space-y-6 p-6 bg-[#0A0A0A]/40 border border-white/5 rounded-2xl">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-300">Current Password</label>
                        <div className="relative">
                            <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 transition-all text-sm font-medium placeholder:text-slate-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                        <div className="space-y-2 mb-4">
                            <label className="block text-sm font-semibold text-slate-300">New Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 transition-all text-sm font-medium placeholder:text-slate-500"
                                    placeholder="Min. 8 characters"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-slate-300">Confirm New Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200 transition-all text-sm font-medium placeholder:text-slate-500"
                                    placeholder="Repeat new password"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit" 
                        disabled={!isFormValid || loading}
                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                            !isFormValid 
                            ? 'bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/50 active:scale-95'
                        }`}
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SecuritySettings;
