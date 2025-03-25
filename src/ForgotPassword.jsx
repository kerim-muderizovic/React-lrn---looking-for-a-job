import React, { useState } from 'react';
import axios from './axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBIcon,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from 'mdb-react-ui-kit';
import './login.css';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call the backend API to send password reset email
      const response = await axios.post(
        '/forgot-password', 
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withXSRFToken: true
        }
      );

      console.log('Password reset response:', response.data);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error requesting password reset:', err);
      setError(
        err.response?.data?.message || 
        t('forgotPassword.errorMessage')
      );
    } finally {
      setLoading(false);
    }
  };

  // If the form was submitted successfully, show a success message
  if (isSubmitted) {
    return (
      <div className="forgot-password-page">
        <MDBContainer fluid className="h-custom">
          <MDBRow className="align-items-center justify-content-center">
            <MDBCol col="10" md="6">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle>{t('forgotPassword.title')}</MDBCardTitle>
                  <MDBCardText>
                    {t('forgotPassword.successMessage')}
                  </MDBCardText>
                  <MDBBtn onClick={() => navigate('/login')}>
                    {t('forgotPassword.backToLogin')}
                  </MDBBtn>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }

  // Initial forgot password form
  return (
    <div className="forgot-password-page">
      <MDBContainer fluid className="h-custom">
        <MDBRow className="align-items-center justify-content-center">
          <MDBCol col="10" md="6">
            <h2 className="text-center mb-4">{t('forgotPassword.title')}</h2>
            <MDBCard>
              <MDBCardBody>
                <MDBCardText>
                  {t('forgotPassword.description')}
                </MDBCardText>
                
                <form onSubmit={handleSubmit}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label={t('forgotPassword.email')}
                    id="email"
                    type="email"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    required
                  />

                  {error && <p className="text-danger mb-3">{error}</p>}

                  <div className="d-grid gap-2">
                    <MDBBtn type="submit" disabled={loading}>
                      {loading ? t('forgotPassword.sending') : t('forgotPassword.submit')}
                    </MDBBtn>
                  </div>
                </form>

                <div className="text-center mt-3">
                  <Link to="/login">{t('forgotPassword.backToLogin')}</Link>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ForgotPassword; 