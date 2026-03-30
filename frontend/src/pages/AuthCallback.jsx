import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const error = searchParams.get("error");
        
        if (error) {
            // Redirect to login and pass the error using React Router state
            navigate('/login', { state: { authError: error } });
            return;
        }

        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");
        const profileCompleted = searchParams.get("profile_completed");

        if (accessToken) {
            localStorage.setItem("access_token", accessToken);
            if (refreshToken) localStorage.setItem("refresh_token", refreshToken);
            if (profileCompleted !== null) localStorage.setItem("profile_completed", profileCompleted === "true");
            
            navigate('/');
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/5 flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-slate-300 font-medium tracking-wide">Authenticating securely...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
