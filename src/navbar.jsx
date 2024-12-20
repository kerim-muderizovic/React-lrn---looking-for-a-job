import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse
} from 'mdb-react-ui-kit';
import './navbar.css';

export default function Navbar({ isLoggedIn,setIsLoggedIn,setView }) {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        // Fetch CSRF token
        await axios.get('http://localhost:8000/sanctum/csrf-cookie');

        // Check login status
        const response = await axios.get('http://localhost:8000/auth/check', {
          withCredentials: true,
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    fetchAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/logout',
        {},
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      setIsLoggedIn(false);
      window.location.href = '/'; // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        {/* Navbar Wrapper for Alignment */}
        <div className="d-flex w-100 justify-content-between align-items-center">
          {/* Brand Name */}
          <MDBNavbarBrand href='#' className='ms-3'>
            MyApp
          </MDBNavbarBrand>

          {/* Navbar Toggler */}
          <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </MDBNavbarToggler>
        </div>

        {/* Collapsible Navbar Links */}
        <MDBCollapse navbar>
          <MDBNavbarNav className='ms-auto d-flex align-items-center'>
            {/* Links */}
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>About</MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink href='#'>Contact</MDBNavbarLink>
            </MDBNavbarItem>
            {/* Conditional Buttons */}
            <div className='d-flex gap-2 ms-3'>
              {isLoggedIn ? (
                <button
                  className='btn btn-link nav-link'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <button
                    className='btn btn-link nav-link'
                    onClick={() => setView('register')}
                  >
                    Register
                  </button>
                  <button
                    className='btn btn-link nav-link'
                    onClick={() => setView('login')}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
