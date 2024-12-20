import React, { useState } from 'react';
import axios from 'axios';
import { 
  MDBContainer, 
  MDBCol, 
  MDBRow, 
  MDBBtn, 
  MDBIcon, 
  MDBInput, 
  MDBCheckbox 
} from 'mdb-react-ui-kit';
import './login.css';

export default function Login({setIsLoggedIn}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/login', formData, {
          withXSRFToken: true,
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true, 
      });
      setIsLoggedIn(true); 
      console.log('Login success', response);
  } catch (err) {
      console.error('Login error', err);
      if (err.response) {
          setError(err.response.data.message || 'Login failed');
      } else {
          setError('An error occurred. Please try again.');
      }
  }
  
  };

  return (
    <div className="login-page">
      <MDBContainer fluid className="h-custom">
        <MDBRow className="align-items-center justify-content-center">
          <MDBCol col='10' md='6'>
            <img 
              src="https://www.con2cus.de/img/c2c.svg" 
              className="imgLogin" 
              alt="Sample" 
            />
          </MDBCol>

          <MDBCol col='4' md='6'>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <p className="lead fw-normal mb-0 me-3">Sign in with</p>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='facebook-f' />
              </MDBBtn>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='twitter' />
              </MDBBtn>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='linkedin-in' />
              </MDBBtn>
            </div>

            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">Or</p>
            </div>

            <form onSubmit={handleSubmit}>
              <MDBInput 
                wrapperClass='mb-4' 
                label='Email address' 
                id='formControlLg' 
                type='email' 
                size="lg" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
              />
              <MDBInput 
                wrapperClass='mb-4' 
                label='Password' 
                id='formControlLg' 
                type='password' 
                size="lg" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required
              />

              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox 
                  name='flexCheck' 
                  value='' 
                  id='flexCheckDefault' 
                  label='Remember me' 
                />
                <a href="/forgot-password">Forgot password?</a>
              </div>

              {error && <p className="text-danger">{error}</p>}

              <div className='text-center text-md-start mt-4 pt-2'>
                <MDBBtn className="mb-0 px-5" size='lg' type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </MDBBtn>
                <p className="small fw-bold mt-2 pt-1 mb-2">
                  Don't have an account? <a href="/register" className="link-danger">Register</a>
                </p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
