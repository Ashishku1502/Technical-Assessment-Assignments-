import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LeadForm from './components/LeadForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          } else {
            setIsAuthenticated(true);
          }
        } catch {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LeadForm />} />
          <Route
            path="/admin/login"
            element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin setAuth={setIsAuthenticated} />}
          />
          <Route
            path="/admin/dashboard"
            element={isAuthenticated ? <AdminDashboard setAuth={setIsAuthenticated} /> : <Navigate to="/admin/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
