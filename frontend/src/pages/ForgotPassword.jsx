import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (response.ok) {
                setStep(2);
            } else {
                setError(data.detail || 'Failed to send reset email.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
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
                    {step === 1 ? 'Enter your email to receive a reset link' : 'Reset link sent!'}
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
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Continue'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <CheckCircle2 className="w-16 h-16 text-green-400" />
                            </div>
                            <p className="text-slate-300 font-medium">
                                If an account exists with that email, a secure reset link has been sent to your inbox.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 active:scale-95 transition-all shadow-lg shadow-blue-900/30"
                            >
                                Back to Login
                            </button>
                        </div>
                    )}

                    {step < 2 && (
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
