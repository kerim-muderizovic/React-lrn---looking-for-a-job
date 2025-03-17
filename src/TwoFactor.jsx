import React, { useState } from 'react';
import axios from 'axios';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import './twoFcator.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

export default function TwoFactorAuth({ setView }) {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuthUser, logout, fetchAuthenticatedUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8000/verify-2fa', { two_factor_key: code }, {
        withCredentials: true,
        withXSRFToken: true,
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('2FA verification successful:', response.data);
      
      // Update auth state with the response data
      setAuthUser(response.data);
      
      // Double-check authentication state by fetching from server
      await fetchAuthenticatedUser();
      
      const { user } = response.data;

      if (user.role === 'admin') {
        navigate('/AdminPage'); // Navigate to admin dashboard (note the capital P)
      } else {
        navigate('/crm'); // Navigate to CRM
      }
    } catch (err) {
      console.error('2FA verification error', err);
      logout();
      setError(err.response?.data?.message || t('twoFactor.invalidCode'));

      setTimeout(() => {
        navigate('/login');
      }, 5000); // 5000ms = 5 seconds
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-factor-auth">
      <MDBContainer fluid className="h-custom">
        <MDBRow className="align-items-center justify-content-center">
          <MDBCol col="10" md="6">
            <img 
              src="https://www.con2cus.de/img/c2c.svg" 
              className="imgLogin" 
              alt="Sample" 
            />
          </MDBCol>

          <MDBCol col="4" md="6" className='glavniTwo'>
            <div className="d-flex flex-row align-items-center justify-content-center mb-4">
              <p className="lead fw-normal mb-0 me-3">{t('twoFactor.title')}</p>
            </div>

            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">{t('twoFactor.enterCode')}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <MDBInput className='inputcic'
                wrapperClass="mb-4" 
                label={t('twoFactor.authCode')} 
                id="formControl2FA" 
                type="text" 
                size="lg" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                required 
                contrast
              />

              {error && <p className="text-danger">{error}</p>}

              <div className="text-center text-md-start mt-4 pt-2">
                <MDBBtn className="mb-0 px-5" size="lg" type="submit" disabled={loading}>
                  {loading ? t('twoFactor.verifying') : t('twoFactor.verifyCode')}
                </MDBBtn>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
