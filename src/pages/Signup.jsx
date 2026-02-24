import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        // Store registered user data (Mock Database)
        const userData = {
            name,
            email,
            password
        };
        localStorage.setItem('registeredUser', JSON.stringify(userData));

        // Auto-login after signup
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);

        // Redirect to dashboard
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-20 p-4">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-blue-600 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-600/20">
                    <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                <p className="text-slate-500">Join Career Navigator today</p>
            </div>

            {/* Signup Card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
                <div className="p-8">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-900 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-colors"
                                    placeholder="Enter the password"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-700/30"
                        >
                            Sign Up
                        </button>

                        <div className="text-center mt-4 text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 text-center text-slate-500 text-sm">
                Career Navigator © 2026. All rights reserved.
            </div>
        </div>
    );
};

export default Signup;
