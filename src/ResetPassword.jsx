import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBSpinner,
} from 'mdb-react-ui-kit';
import './login.css';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token and email from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');
  
  const [formData, setFormData] = useState({
    email: email || '',
    password: '',
    password_confirmation: '',
    token: token || '',
  });
  
  const [isReset, setIsReset] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(true);

  // Verify that we have both token and email parameters
  useEffect(() => {
    if (!token || !email) {
      setValidToken(false);
      setError(t('resetPassword.invalidToken'));
    }
  }, [token, email, t]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setError(t('resetPassword.passwordMismatch'));
      setLoading(false);
      return;
    }

    try {
      // Call the backend API to reset password
      const response = await axios.post(
        '/reset-password', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withXSRFToken: true
        }
      );

      console.log('Password reset response:', response.data);
      setIsReset(true);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(
        err.response?.data?.message || 
        t('resetPassword.errorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  // Show success message after password reset
  if (isReset) {
    return (
      <div className="reset-password-page">
        <MDBContainer fluid className="h-custom">
          <MDBRow className="align-items-center justify-content-center">
            <MDBCol col="10" md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle className="text-success">
                    {t('common.success')}
                  </MDBCardTitle>
                  <MDBCardText>
                    {t('resetPassword.successMessage')}
                  </MDBCardText>
                  <MDBBtn onClick={() => navigate('/login')}>
                    {t('resetPassword.backToLogin')}
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }

  // Show error message if token is invalid
  if (!validToken) {
    return (
      <div className="reset-password-page">
        <MDBContainer fluid className="h-custom">
          <MDBRow className="align-items-center justify-content-center">
            <MDBCol col="10" md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle className="text-danger">
                    {t('common.error')}
                  </MDBCardTitle>
                  <MDBCardText>
                    {t('resetPassword.invalidToken')}
                  </MDBCardText>
                  <MDBBtn onClick={() => navigate('/forgot-password')}>
                    {t('forgotPassword.title')}
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="reset-password-page">
      <MDBContainer fluid className="h-custom">
        <MDBRow className="align-items-center justify-content-center">
          <MDBCol col="10" md="6">
            <h2 className="text-center mb-4">{t('resetPassword.title')}</h2>
            <MDBCard>
              <MDBCardBody>
                <MDBCardText>
                  {t('resetPassword.description')}
                </MDBCardText>
                
                <form onSubmit={handleSubmit}>
                  {/* Hidden email field */}
                  <input type="hidden" name="email" value={formData.email} />
                  <input type="hidden" name="token" value={formData.token} />
                  
                  <MDBInput
                    wrapperClass="mb-4"
                    label={t('resetPassword.newPassword')}
                    id="password"
                    name="password"
                    type="password"
                    size="lg"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('resetPassword.newPasswordPlaceholder')}
                    required
                  />
                  
                  <MDBInput
                    wrapperClass="mb-4"
                    label={t('resetPassword.confirmPassword')}
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    size="lg"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                    required
                  />

                  {error && <p className="text-danger mb-3">{error}</p>}

                  <div className="d-grid gap-2">
                    <MDBBtn type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                          {t('resetPassword.resetting')}
                        </>
                      ) : (
                        t('resetPassword.submit')
                      )}
                    </MDBBtn>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <Link to="/login">{t('resetPassword.backToLogin')}</Link>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ResetPassword; 