import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserPlus, Loader2, CheckCircle2 } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    
    // OTP states
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Live validation states
    const [emailError, setEmailError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: 'bg-transparent' });
    
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.authError) {
            const err = location.state.authError;
            if (err.includes('missing')) setServerError("Social signup is currently unavailable. Please use email.");
            else if (err === 'auth_failed') setServerError("Authentication failed. Please try again.");
            else if (err === 'no_email') setServerError("No email address found from the provider.");
            else setServerError("An error occurred during social signup.");
            
            // Clear the router state so the error doesn't persist on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Check email live
    useEffect(() => {
        if (email.length > 0) {
            // Strict regex enforcing a valid 2+ letter TLD (e.g. .com, .org)
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) setEmailError("Please enter a valid email with a proper TLD (e.g., .com)");
            else setEmailError("");
        } else {
            setEmailError("");
        }
    }, [email]);

    // Check password strength live
    useEffect(() => {
        if (password.length === 0) {
            setPasswordStrength({ score: 0, text: '', color: 'bg-transparent' });
            return;
        }
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[@$!%*?&#^]/.test(password)) score += 1;

        if (score <= 1) setPasswordStrength({ score, text: 'Weak', color: 'bg-red-500' });
        else if (score === 2) setPasswordStrength({ score, text: 'Fair', color: 'bg-yellow-500' });
        else if (score >= 3) setPasswordStrength({ score, text: 'Strong', color: 'bg-green-500' });
    }, [password]);

    const isFormValid = name.length > 0 && email.length > 0 && !emailError && passwordStrength.score >= 3;

    const handleSignup = async (e) => {
        e.preventDefault();
        setServerError('');
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // If it's a validation error array from FastAPI, map it
                if (Array.isArray(data.detail)) {
                    setServerError(data.detail[0]?.msg || "Invalid input");
                } else {
                    setServerError(data.detail || "Signup failed");
                }
                return;
            }

            // Show OTP modal instead of auto-login
            setShowOtpModal(true);
        
        } catch (err) {
            setServerError("Server error. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setServerError('');
        setIsVerifying(true);

        try {
            const response = await fetch("http://localhost:8000/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    otp
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setServerError(data.detail || "Verification failed");
                return;
            }

            // Auto-login after verification
            localStorage.setItem("access_token", data.access_token);
            if (data.refresh_token) {
                localStorage.setItem("refresh_token", data.refresh_token);
            }

            // Redirect to home
            navigate("/");
            
        } catch (err) {
            setServerError("Server error. Try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    if (showOtpModal) {
        return (
            <div className="min-h-screen flex flex-col items-center pt-20 p-4">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600/20 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
                        <CheckCircle2 className="w-8 h-8 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Verify your Email</h1>
                    <p className="text-slate-400 text-center max-w-sm">
                        We've sent a 6-digit verification code to <span className="text-white font-semibold">{email}</span>.
                    </p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/5 p-8">
                    {serverError && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">
                            {serverError}
                        </div>
                    )}
                    
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Verification Code</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950/50 transition-colors text-slate-200 placeholder:text-slate-500 text-center tracking-widest font-mono text-lg"
                                placeholder="000000"
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={otp.length < 6 || isVerifying}
                            className={`w-full py-3 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 ${
                                otp.length === 6 && !isVerifying
                                ? "bg-blue-600 hover:bg-blue-500 active:scale-95" 
                                : "bg-blue-900/50 cursor-not-allowed text-blue-200/50"
                            }`}
                        >
                            {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center pt-20 p-4">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="bg-blue-600/20 p-3 rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
                    <UserPlus className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-slate-400">Join Career Navigator today</p>
            </div>

            {/* Signup Card */}
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/5">
                <div className="p-8">
                    {serverError && (
                        <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/20">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950/50 transition-colors text-slate-200 placeholder:text-slate-500"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-slate-200 placeholder:text-slate-500 bg-slate-950/50 ${
                                        emailError ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:ring-blue-500'
                                    }`}
                                    placeholder="Enter your email"
                                    required
                                />
                                {email.length > 0 && !emailError && (
                                    <CheckCircle2 className="w-5 h-5 text-green-400 absolute right-4 top-1/2 transform -translate-y-1/2" />
                                )}
                            </div>
                            {emailError && <p className="text-red-400 text-xs mt-1.5">{emailError}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-950/50 transition-colors text-slate-200 placeholder:text-slate-500"
                                    placeholder="Min 8 chars, 1 digit, 1 symbol"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543-7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {password.length > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex items-center gap-1 flex-1">
                                        {[...Array(4)].map((_, index) => (
                                            <div 
                                                key={index} 
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                    index < passwordStrength.score ? passwordStrength.color : 'bg-slate-800'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs font-semibold w-12 text-right ${
                                        passwordStrength.score >= 3 ? 'text-green-400' : 
                                        passwordStrength.score === 2 ? 'text-yellow-400' : 'text-red-400'
                                    }`}>
                                        {passwordStrength.text}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading}
                            className={`w-full py-3 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 ${
                                isFormValid && !isLoading
                                ? "bg-blue-600 hover:bg-blue-500 active:scale-95" 
                                : "bg-blue-900/50 cursor-not-allowed text-blue-200/50"
                            }`}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                        </button>

                        <div className="relative mt-6 mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-slate-500 backdrop-blur-md" style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>Or sign up with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => window.location.href = "http://localhost:8000/auth/google/login"}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => window.location.href = "http://localhost:8000/auth/github/login"}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-950/50 border border-white/10 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                                </svg>
                                GitHub
                            </button>
                        </div>

                        <div className="text-center mt-6 text-sm text-slate-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
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
