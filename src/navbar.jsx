import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRef } from 'react';
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
import { Link } from 'react-router-dom';
import { useUser } from './userContext';

export default function Navbar({ setView }) {
  const { authenticatedUser, fetchAuthenticatedUser,isLoading,setIsLoading } = useUser();
  const isMounted = useRef(false);
  // Fetch the user once when the component mounts
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true); // Set loading to true before the fetch
        await fetchAuthenticatedUser(); // Fetch user data
      } catch (error) {
        console.error('Error fetching authenticated user:', error);
      } finally {
        if (isMounted.current) {
        setIsLoading(false); // Ensure loading is false once fetch is done
        console.log('gotovo'); // Log when the finally block is executed
        }
      }
    };
    isMounted.current = true;
    loadUser();
  }, [ setIsLoading]); // Dependency only on the fetch function (should not change)

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
      window.location.href = '/'; // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleScrollToContact = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <div className="d-flex w-100 justify-content-between align-items-center">
          <MDBNavbarBrand href='/' className='ms-3'>
            <img src="https://www.con2cus.de/img/c2c.svg" style={{ width: '100px', height: 'auto' }} alt="Brand Logo" />
          </MDBNavbarBrand>

          <MDBNavbarToggler
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </MDBNavbarToggler>
        </div>

        <MDBCollapse navbar>
          <MDBNavbarNav className='ms-auto d-flex align-items-center'>
            <MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' as={Link} to='/'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink onClick={handleScrollToContact}>Contact</MDBNavbarLink>
            </MDBNavbarItem>

            <div className='d-flex gap-2 ms-3'>
              {isLoading ? (
                <div>Loading...</div>
              ) : authenticatedUser ? (
                <button
                  className='btn btn-link nav-link'
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to='/register' className='btn btn-link nav-link'>
                    Register
                  </Link>
                  <Link to='/login' className='btn btn-link nav-link'>
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
