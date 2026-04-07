import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({ name: "U", photo: null });
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        console.log("Loaded token from storage:", token);
        setAccessToken(token);
}, []);
    const isAuthenticated = !!accessToken;

    let userRole = null;

    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            userRole = decoded.role;
        } catch (err) {
            console.error("Invalid token");
        }
    }

    useEffect(() => {
        if (!accessToken) return;   // ✅ IMPORTANT FIX

        const fetchProfile = async () => {
            try {
                console.log("TOKEN USED IN NAVBAR:", accessToken);

                const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    setProfile({
                        name: (data.first_name
                            ? data.first_name.charAt(0)
                            : (data.name ? data.name.charAt(0) : "U")
                        ).toUpperCase(),
                        photo: data.profile_photo
                    });

                } else if (response.status === 401) {
                    console.log("401 ERROR - TOKEN ISSUE");
                }

            } catch (e) {
                console.error(e);
            }
        };

        fetchProfile();

    }, [accessToken]);

    useEffect(() => {
        if (userRole === "Admin" && location.pathname !== "/admin") {
            navigate("/admin", { replace: true });
        }
    }, [userRole, location.pathname, navigate]);



    const navItems =
        userRole !== "Admin"
            ? [
                { label: "Home", path: "/" },
                { label: "Profile", path: "/settings" },
                { label: "Bot", path: "/chat" },
                { label: "Results", path: "/results" },
                { label: "Courses", path: "/courses" },
                { label: "Internships", path: "/internships" },
                { label: "Jobs", path: "/applications" },
                { label: "Resume Analyzer", path: "/resume-analyzer" },
            ]
            : [];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="glass-navbar px-8 py-4 flex items-center justify-between">

            <div className="flex items-center gap-12">
                <Link
                    to={userRole === "Admin" ? "/admin" : "/"}
                    className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                >
                    Career Navigator
                </Link>

                {userRole !== "Admin" && (
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive
                                            ? "bg-slate-800 text-blue-400 border border-slate-700"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link
                            to="/settings"
                            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white hover:bg-blue-700 transition-all cursor-pointer overflow-hidden border border-white/10 shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                            {profile.photo ? (
                                <img src={profile.photo} alt="P" className="w-full h-full object-cover" />
                            ) : (
                                profile.name
                            )}
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/signup")}
                            className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-6 py-2 rounded-full font-medium transition-colors"
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;