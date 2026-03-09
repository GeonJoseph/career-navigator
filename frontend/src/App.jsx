import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Applications from './pages/Applications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Results from './pages/Results';
import Courses from './pages/Courses';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import Internships from './pages/Internships';

function App() {

  const role = localStorage.getItem("userRole");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
        </Route>
      </Route>
    </Routes>
  );
}

export default App;