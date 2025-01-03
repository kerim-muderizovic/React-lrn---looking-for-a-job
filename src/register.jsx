import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardImage, MDBInput, MDBIcon, MDBCheckbox } from 'mdb-react-ui-kit';
import './register.css';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      console.log()
      const response = await axios.post('/register', formData, {
        
        withXSRFToken: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSuccess('Registration successful! Check your email box.');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-bg">
      <MDBContainer fluid className="d-flex justify-content-center align-items-center">
        <MDBCard className='custom-card text-black'>
          <MDBCardBody>
            <MDBRow className="no-gutters"> 
              {/* Form Section */}
              <MDBCol md='6' className='d-flex justify-content-center flex-column'>
                <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="user me-3" size='lg' />
                  <MDBInput 
                    label='Your Name' 
                    id='form1' 
                    type='text' 
                    className='w-100' 
                    value={formData.name} 
                    onChange={handleChange} 
                    name="name"
                  />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="envelope me-3" size='lg' />
                  <MDBInput 
                    label='Your Email' 
                    id='form2' 
                    type='email' 
                    value={formData.email} 
                    onChange={handleChange} 
                    name="email"
                  />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="lock me-3" size='lg' />
                  <MDBInput 
                    label='Password' 
                    id='form3' 
                    type='password' 
                    value={formData.password} 
                    onChange={handleChange} 
                    name="password"
                  />
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="key me-3" size='lg' />
                  <MDBInput 
                    label='Repeat your password' 
                    id='form4' 
                    type='password' 
                    value={formData.password_confirmation} 
                    onChange={handleChange} 
                    name="password_confirmation"
                  />
                </div>

                <div className='mb-4'>
                  <MDBCheckbox 
                    name='flexCheck' 
                    value='' 
                    id='flexCheckDefault' 
                    label='Subscribe to our newsletter' 
                  />
                </div>

                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success">{success}</p>}

                <MDBBtn className='mb-4' size='lg' type="submit" onClick={handleSubmit}>Register</MDBBtn>
              </MDBCol>

              {/* Image Section */}
              <MDBCol md='6' className="d-flex justify-content-center align-items-center">
                <MDBCardImage
                  className='imgC'
                  src='https://www.shutterstock.com/image-vector/support-icon-can-be-used-600nw-1887496465.jpg'
                  alt="Support"
                  fluid
                />
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}
