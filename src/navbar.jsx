import React from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Import the AuthContext

export default function Navbar() {
  const navigate = useNavigate();
  const { authUser, logout } = useAuth(); // Extract authUser and logout from AuthContext

  const handleLogout = async () => {
    await logout(); // Ensure logout action
    navigate('/'); // Redirect to the home page
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid>
        <MDBNavbarBrand href="/" className="ms-3">
          <img
            src="https://www.con2cus.de/img/c2c.svg"
            style={{ width: '100px', height: 'auto' }}
            alt="Brand Logo"
          />
        </MDBNavbarBrand>

        <MDBCollapse navbar>
          <MDBNavbarNav className="ms-auto d-flex align-items-center">
            {authUser ? ( // Conditionally render based on authUser
              <>
                <MDBNavbarItem>
                  <span className="navbar-text me-3">
                    Welcome, {authUser.name || 'User'}!
                  </span>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={handleLogout} className="btn btn-link nav-link">
                    Logout
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            ) : (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={handleLogin} className="btn btn-link nav-link">
                    Sign In
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={handleRegister} className="btn btn-link nav-link">
                    Register
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
