import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import './App.css';
import Navbar from './navbar';
import Footer from './footer';
import Login from './login';
import Register from './register';
import CRMApp from './crmMainPart';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import  UserProfile  from './user-profile';
import AddTaskModal from "./taskModal";
import { UserProvider } from './userContext'; // Import the UserProvider
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <UserProvider>
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />


        <Routes>
        <Route path="/user-profile" element={<UserProfile/>} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crm/*" element={<CRMApp />} />
          <Route path="/userProfile" element={<UserProfile />} />
        </Routes>

        <Footer />
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
