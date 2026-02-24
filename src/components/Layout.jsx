import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white">
            <Navbar />
            <main className="flex-1 overflow-auto container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
