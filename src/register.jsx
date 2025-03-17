import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBIcon, MDBCheckbox } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './register.css';

export default function Register() {
  const { t, i18n } = useTranslation(); // Add translation hook
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Axios global settings
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:8000';
    axios.defaults.withCredentials = true; // Ensure cookies are sent with the request

    // Fetch CSRF token
    const fetchCsrfToken = async () => {
      try {
        await axios.get('/sanctum/csrf-cookie', {
          withCredentials: true, // Required to send cookies with requests
        });
        console.log('CSRF token set successfully');
      } catch (err) {
        console.error('Failed to fetch CSRF cookie:', err);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength when password field changes
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 1;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'var(--error)';
    if (passwordStrength <= 3) return 'var(--warning)';
    return 'var(--success)';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return t('register.passwordStrength.weak');
    if (passwordStrength <= 3) return t('register.passwordStrength.medium');
    return t('register.passwordStrength.strong');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await axios.post('/register', formData, {
        withXSRFToken: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess(t('register.successMessage'));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        setError(err.response.data.message || t('register.errorMessage'));
      } else {
        setError(t('register.generalError'));
      }
    }
  };

  return (
    <div className="login-bg">
      <MDBContainer fluid className="d-flex justify-content-center align-items-center">
        <MDBCard className='custom-card text-black' style={{ border: 'none', boxShadow: 'none' }}>
          <MDBCardBody style={{ border: 'none' }}>
            <MDBRow className="no-gutters g-0"> 
              {/* Form Section */}
              <MDBCol md='6' className='d-flex justify-content-center flex-column'>
                <p className="text-center h1 fw-bold mb-4 mx-1 mx-md-4 mt-4">{t('register.title')}</p>
                <p className="text-center text-muted mb-4">{t('register.subtitle')}</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <label htmlFor="name" className="form-label">{t('register.name')}</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MDBIcon fas icon="user" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('register.namePlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label htmlFor="email" className="form-label">{t('register.email')}</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MDBIcon fas icon="envelope" />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('register.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-2">
                    <label htmlFor="password" className="form-label">{t('register.password')}</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MDBIcon fas icon="lock" />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder={t('register.passwordPlaceholder')}
                      />
                    </div>
                  </div>

                  {formData.password && (
                    <div className="password-strength mb-4">
                      <div className="strength-bar">
                        <div 
                          className="strength-progress" 
                          style={{ 
                            width: `${(passwordStrength / 5) * 100}%`,
                            backgroundColor: getPasswordStrengthColor()
                          }}
                        ></div>
                      </div>
                      <div className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthText()} {t('register.password')}
                      </div>
                    </div>
                  )}

                  <div className="form-group mb-4">
                    <label htmlFor="password_confirmation" className="form-label">{t('register.confirmPassword')}</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MDBIcon fas icon="key" />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                        placeholder={t('register.confirmPasswordPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className='mb-4'>
                    <MDBCheckbox 
                      name='flexCheck' 
                      value='' 
                      id='flexCheckDefault' 
                      label={t('register.agreeTerms')}
                    />
                  </div>

                  {error && <div className="alert alert-danger mb-4">{error}</div>}
                  {success && <div className="alert alert-success mb-4">{success}</div>}

                  <MDBBtn 
                    className='mb-4 w-100' 
                    size='lg' 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">{t('register.loading')}</span>
                      </div>
                    ) : null}
                    {isLoading ? t('register.registering') : t('register.registerButton')}
                  </MDBBtn>

                  <div className="text-center">
                    <p>{t('register.haveAccount')} <Link to="/login" className="login-link">{t('register.loginLink')}</Link></p>
                  </div>
                </form>
              </MDBCol>

              {/* Image Section */}
              <MDBCol md='6' className="d-flex justify-content-center align-items-center">
                <div className="image-container">
                  <MDBCardImage
                    className='imgC'
                    src='https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg'
                    alt={t('register.imageAlt')}
                    fluid
                  />
                  <div className="image-overlay">
                    <h3>{t('register.welcomeTitle')}</h3>
                    <p>{t('register.welcomeMessage')}</p>
                  </div>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}
