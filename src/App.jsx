import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './navbar';
import Footer from './footer';
import Login from './login';
import Register from './register';
import CRMApp from './crmMainPart';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import UserProfile from './user-profile';
import AdminPage from './AdminPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ClipLoader } from 'react-spinners';
import TwoFactorAuth from './TwoFactor';
import { AuthProvider, useAuth } from './AuthContext';
import RequireAuth from './RequireAuth';
import { I18nextProvider } from 'react-i18next';import './i18';
import i18n from './i18';
function AppContent() {
  const { authUser, isLoading } = useAuth();

  // Show a loading spinner if user information is still being fetched
  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#36d7b7" size={150} />
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
  
          <Route element={<RequireAuth />}>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/crm/*" element={<CRMApp style={{ flex: 1, minHeight: "100%" }} />} />
            <Route path="/AdminPage/*" element={<AdminPage />} />
          </Route>
        </Routes>
      </DndProvider>
    </div>
    <Footer />
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
