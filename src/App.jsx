<<<<<<< HEAD
import { Routes, Route, Navigate } from 'react-router-dom';
=======
import { Routes, Route } from 'react-router-dom'; // REMOVED BrowserRouter/Router
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
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
<<<<<<< HEAD
import ForgotPassword from './pages/ForgotPassword';

function App() {

  const role = localStorage.getItem("userRole");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
=======

function App() {
  return (
    // REMOVED <Router> tag
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="chat" element={<Chat />} />
<<<<<<< HEAD

          {/* 🔐 BLOCK job / profile job page for admin */}
          <Route
            path="applications"
            element={
              role?.toLowerCase() === "admin"
                ? <Navigate to="/admin" replace />
                : <Applications />
            }
          />

=======
          <Route path="applications" element={<Applications />} />
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
          <Route path="settings" element={<Settings />} />
          <Route path="results" element={<Results />} />
          <Route path="courses" element={<Courses />} />
        </Route>
      </Route>
    </Routes>
<<<<<<< HEAD
=======
    // REMOVED </Router> tag
>>>>>>> 5bec2fed32f19fb75ca9b6a13f4852e0419f2997
  );
}

export default App;