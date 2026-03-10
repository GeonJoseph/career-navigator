import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("access_token");
    const isAuthenticated = !!accessToken;

    let userRole = null;
    let userName = "U";

    if (accessToken) {
        try {
            const decoded = jwtDecode(accessToken);
            userRole = decoded.role;
            userName = decoded.sub?.charAt(0).toUpperCase() || "U";
        } catch (err) {
            console.error("Invalid token");
        }
    }

    useEffect(() => {
        if (userRole === "Admin" && location.pathname !== "/admin") {
            navigate("/admin", { replace: true });
        }
    }, [userRole, location.pathname, navigate]);

    const navItems =
        userRole !== "Admin"
            ? [
<<<<<<< HEAD
                  { label: "Home", path: "/" },
                  { label: "Profile", path: "/settings" },
                  { label: "Bot", path: "/chat" },
                  { label: "Results", path: "/results" },
                  { label: "Courses", path: "/courses" },
                  { label: "Jobs", path: "/applications" },
              ]
=======
                { label: "Home", path: "/" },
                { label: "Profile", path: "/settings" },
                { label: "Bot", path: "/chat" },
                { label: "Results", path: "/results" },
                { label: "Courses", path: "/courses" },
                { label: "Internships", path: "/internships" },
                { label: "Jobs", path: "/applications" },
            ]
>>>>>>> 368b1368cac1415e0ddfdeb1323fc4dafa34dc81
            : [];

    const handleLogout = async () => {
        await logout();
    };

    return (
        <nav className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
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
<<<<<<< HEAD
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? "bg-slate-800 text-blue-400 border border-slate-700"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                    }`}
=======
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive
                                            ? "bg-slate-800 text-blue-400 border border-slate-700"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                                        }`}
>>>>>>> 368b1368cac1415e0ddfdeb1323fc4dafa34dc81
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
                            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold hover:bg-blue-600 transition-colors cursor-pointer"
                        >
                            {userName}
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