import React, { useEffect, useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBNavbarToggler,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import './navbar.css';

export default function Navbar() {
  const { logout, authUser } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showNav, setShowNav] = useState(false);

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

  const currentLang = i18n.language;

  return (
    <MDBNavbar expand="lg" light className='mdb-navbar'>
      <MDBContainer fluid className="navbar-container">
        <MDBNavbarBrand href="/" className="navbar-brand">
          <img
            src="https://www.con2cus.de/img/c2c.svg"
            style={{ width: '100px', height: 'auto' }}
            alt="Brand Logo"
          />
        </MDBNavbarBrand>

        <MDBNavbarToggler
          type='button'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowNav(!showNav)}
        />

        <MDBCollapse navbar show={showNav}>
          <MDBNavbarNav className="ms-auto">
            <MDBNavbarItem className="d-flex align-items-center">
              <button 
                onClick={() => changeLanguage('en')} 
                className={`language-btn ${currentLang === 'en' ? 'active' : ''}`}
              >
                EN
              </button>
              <button 
                onClick={() => changeLanguage('de')} 
                className={`language-btn ${currentLang === 'de' ? 'active' : ''}`}
              >
                DE
              </button>
            </MDBNavbarItem>

            {isLoggedIn ? (
              <MDBNavbarItem>
                <button onClick={handleLogout} className="auth-btn logout-btn">
                  {t('navbar.logout')}
                </button>
              </MDBNavbarItem>
            ) : (
              <>
                <MDBNavbarItem>
                  <button onClick={handleLogin} className="auth-btn">
                    {t('navbar.signIn')}
                  </button>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <button onClick={handleRegister} className="auth-btn">
                    {t('navbar.register')}
                  </button>
                </MDBNavbarItem>
              </>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
