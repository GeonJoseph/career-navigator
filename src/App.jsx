import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="applications" element={<Applications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="results" element={<Results />} />
            <Route path="courses" element={<Courses />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
