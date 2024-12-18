import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBCollapse
} from 'mdb-react-ui-kit';
import './navbar.css';

export default function Navbar({ setView }) {
  // const [showNav, setShowNav] = useState(false);

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
            {/* Buttons */}
            <div className='d-flex gap-2 ms-3'>
            <button onClick={() => setView('register')}>Register</button>
            <button onClick={() => setView('login')}>Sign In</button>
            </div>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
