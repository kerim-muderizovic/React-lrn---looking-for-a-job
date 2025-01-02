import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
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
import { UserProvider, useUser } from './userContext'; // Import the UserProvider and useUser
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ClipLoader } from 'react-spinners';
function AppContent() {
  const { authenticatedUser } = useUser(); // Access the user context

  // Show a loading spinner if the user context is still fetching the data
  if (authenticatedUser === null) {
    return <ClipLoader color="#36d7b7" size={150} />;
  }

  return (
    <div>
      <Navbar isLoggedIn={!!authenticatedUser} />

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
          <Route path="/AdminPage*" element={<AdminPage />} />
        </Routes>
      </DndProvider>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}

export default App;
