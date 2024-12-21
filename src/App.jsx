import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router components
import './App.css';
import Navbar from './navbar';
import Footer from './footer';
import Login from './login';
import Register from './register';
import CRMApp from './crmMainPart';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        {/* Define Routes */}
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/crm" element={<CRMApp />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
