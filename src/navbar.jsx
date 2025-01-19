import React, { useEffect, useState } from 'react';
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
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { logout, authUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Local state to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(authUser?.isLoggedIn || false);

  useEffect(() => {
    // Update local state whenever authUser changes
    setIsLoggedIn(authUser?.isLoggedIn || false);
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Navigate to the home page
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
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
            <MDBNavbarItem>
              <button onClick={() => changeLanguage('en')} className="btn btn-link">
                EN
              </button>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <button onClick={() => changeLanguage('de')} className="btn btn-link">
                DE
              </button>
            </MDBNavbarItem>

            {isLoggedIn ? (
              <MDBNavbarItem>
                <MDBNavbarLink onClick={handleLogout} className="btn btn-link nav-link">
                  {t('navbar.logout')}
                </MDBNavbarLink>
              </MDBNavbarItem>
            ) : (
              <>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={handleLogin} className="btn btn-link nav-link">
                    {t('navbar.signIn')}
                  </MDBNavbarLink>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink onClick={handleRegister} className="btn btn-link nav-link">
                    {t('navbar.register')}
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
