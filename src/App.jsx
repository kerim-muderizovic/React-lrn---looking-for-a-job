import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './navbar';
import Footer from './footer';
import Login from './login';
import Register from './register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import CRMApp from './crmMainPart';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import UserProfile from './user-profile';
import AdminPage from './Admin/AdminPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ClipLoader } from 'react-spinners';
import TwoFactorAuth from './TwoFactor';
import { AuthProvider, useAuth } from './AuthContext';
import RequireAuth from './RequireAuth';
import { I18nextProvider } from 'react-i18next';
import './i18';
import i18n from './i18';
import axios from './axiosConfig';

// Component to handle the password reset redirection
function PasswordResetRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract token from the URL
    const pathSegments = location.pathname.split('/');
    if (pathSegments.length >= 3) {
      const token = pathSegments[2];
      // Extract email from query params
      const searchParams = new URLSearchParams(location.search);
      const email = searchParams.get('email');
      
      if (token && email) {
        // Redirect to the reset-password route with token and email as query parameters
        navigate(`/reset-password?token=${token}&email=${email}`);
      } else {
        // If token or email is missing, redirect to forgot password
        navigate('/forgot-password');
      }
    }
  }, [location, navigate]);
  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { authUser, isLoading } = useAuth();
  console.log(authUser,"testttt");
  const isAdmin = authUser?.user?.role === "admin";
  
  // Fetch CSRF token when the app initializes
  useEffect(() => {
    const initializeCsrf = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie');
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    
    initializeCsrf();
  }, []);

  // Show a loading spinner if user information is still being fetched
  if (isLoading) {
    return (
    
      <div class="three-body">
      <div class="three-body__dot"></div>
      <div class="three-body__dot"></div>
      <div class="three-body__dot"></div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Navbar />
    <div style={{ flex: 1, overflow: "auto" }}>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route path="/" element={authUser?.isLoggedIn ? <Navigate to="/crm" replace /> : <Navigate to="/register" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/2fa" element={<TwoFactorAuth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-reset/:token" element={<PasswordResetRedirect />} />
  
          <Route element={<RequireAuth />}>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/crm/*" element={<CRMApp style={{ flex: 1, minHeight: "100%" }} />} />
            <Route path="/AdminPage/*" element={<AdminPage />} />
          </Route>
        </Routes>
      </DndProvider>
    </div>
    {!isAdmin  && <Footer />}
  </div>
  


  
  
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  </I18nextProvider>
  );
}

export default App;
