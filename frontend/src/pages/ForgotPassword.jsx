import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setError('');

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (user) {
            setStep(2);
        } else {
            setError('No account found with this email address.');
        }
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === email);

        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            setStep(3);
        } else {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-20 p-4">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-blue-600/20 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
                    <KeyRound className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
                <p className="text-slate-400">
                    {step === 1 ? 'Enter your email to reset your account' :
                        step === 2 ? 'Create a secure new password' :
                            'Password successfully changed'}
                </p>
            </div>

            {/* Content Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/5">
                <div className="p-8">
                    {error && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950/50 transition-colors text-slate-200 placeholder:text-slate-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/30"
                            >
                                Continue
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handlePasswordReset} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950/50 transition-colors text-slate-200 placeholder:text-slate-500"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-300 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950/50 transition-colors text-slate-200 placeholder:text-slate-500"
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/30"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <CheckCircle2 className="w-16 h-16 text-green-400" />
                            </div>
                            <p className="text-slate-300 font-medium">
                                Your password has been reset successfully. You can now log in with your new credentials.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/30"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {step < 3 && (
                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                            <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
                Career Navigator © 2026. All rights reserved.
            </div>
        </div>
    );
};

export default ForgotPassword;
