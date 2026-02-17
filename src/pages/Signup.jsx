import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <UserPlus className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Create Account</h2>
                    <p className="text-center text-slate-500 mb-8">Join Path Pilot and start your journey</p>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
                <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                    <p className="text-sm text-slate-600">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
