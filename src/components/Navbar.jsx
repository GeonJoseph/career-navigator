import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const userRole = localStorage.getItem('userRole');

    // 👉 Auto redirect admin to admin dashboard
    useEffect(() => {
        if (userRole === 'Admin' && location.pathname !== '/admin') {
            navigate('/admin', { replace: true });
        }
    }, [userRole, location.pathname, navigate]);

    let navItems = [];

    // 👉 Only normal users get navbar pages
    if (userRole !== 'Admin') {
        navItems = [
            { label: 'Home', path: '/' },
            { label: 'Profile', path: '/settings' },
            { label: 'Bot', path: '/chat' },
            { label: 'Results', path: '/results' },
            { label: 'Courses', path: '/courses' },
            { label: 'Jobs', path: '/applications' },
        ];
    }

    return (
        <nav className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-12">
                <Link
                    to={userRole === 'Admin' ? '/admin' : '/'}
                    className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
                >
                    Career Navigator
                </Link>

                {/* 👉 Admin sees NO page options */}
                {userRole !== 'Admin' && (
                    <div className="hidden md:flex items-center gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-slate-800 text-blue-400 border border-slate-700'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
                {localStorage.getItem('isAuthenticated') === 'true' ? (
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                            {localStorage.getItem('userName')
                                ? localStorage.getItem('userName').charAt(0).toUpperCase()
                                : 'U'}
                        </div>

                        <button
                            onClick={() => {
                                localStorage.removeItem('isAuthenticated');
                                localStorage.removeItem('userEmail');
                                localStorage.removeItem('userName');
                                localStorage.removeItem('userRole');
                                navigate('/login');
                            }}
                            className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-300 hover:text-white font-medium px-4 py-2 transition-colors"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate('/signup')}
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