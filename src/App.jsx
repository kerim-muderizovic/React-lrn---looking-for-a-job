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
import AddTaskModal from './taskModal';
import { UserProvider, useUser } from './userContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ClipLoader } from 'react-spinners';
import TwoFactorAuth from './TwoFactor';
import { AuthProvider } from './AuthContext';

function AppContent() {
  const { authenticatedUser } = useUser(); 
  // Access the user context

  // Show a loading spinner if the user context is still fetching the data
  // if (authenticatedUser === null) {
  //   return <ClipLoader color="#36d7b7" size={150} />;
  // }

  return (
    <div>
      <Navbar/>

      <DndProvider backend={HTML5Backend}>
        <Routes>
          {/* Redirect to the appropriate route based on login status */}
          <Route
            path="/"
            element={
              authenticatedUser ? <Navigate to="/crm" replace /> : <Navigate to="/register" replace />
            }
          />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crm/*" element={<CRMApp />} />
          <Route path="/AdminPage/*" element={<AdminPage />} />
          <Route path="/2fa" element={<TwoFactorAuth />} /> {/* Add 2FA route */}
        </Routes>
      </DndProvider>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
    </AuthProvider>

  );
}

export default App;
