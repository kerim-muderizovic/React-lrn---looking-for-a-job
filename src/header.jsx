import React, { useEffect, useState } from "react";
import axios from "./axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';

export function Header() {
  const { authUser, logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Update login status when authUser changes
    setIsLoggedIn(!!authUser?.isLoggedIn);
  }, [authUser]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "/logout",
        {},
        { withXSRFToken: true }
      );
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="/">
            MyApp
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/support">
                  Support
                </a>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/register">
                      Register
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">
                      Login
                    </a>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
