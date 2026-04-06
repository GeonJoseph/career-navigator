import React, { useEffect, useRef, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Results from './pages/Results';
import Courses from './pages/Courses';
import Internships from './pages/Internships';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

function App() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  // Inactivity Auto-Logout Logic (15 minutes = 900000 ms)
  const timeoutRef = useRef(null);

  const handleLogout = useCallback(() => {
    if (localStorage.getItem('access_token')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('profile_completed');
      navigate('/login');
    }
  }, [navigate]);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(handleLogout, 900000);
  }, [handleLogout]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    resetTimeout();
    events.forEach(event => window.addEventListener(event, resetTimeout));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [resetTimeout]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="chat" element={<Chat />} />
          {/* 🔐 BLOCK job / profile job page for admin */}
          <Route
            path="applications"
            element={
              role?.toLowerCase() === "admin"
                ? <Navigate to="/admin" replace />
                : <Applications />
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="results" element={<Results />} />
          <Route path="courses" element={<Courses />} />
          <Route path="internships" element={<Internships />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;