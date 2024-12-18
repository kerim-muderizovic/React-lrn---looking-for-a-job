import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit';
import './footer.css';
export default function Footer() {
  return (
    <MDBFooter className='bg-light text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        {/* Social media links */}
        <div className='me-5 d-none d-lg-block'>
          <span>Connect with us on social networks:</span>
        </div>
        <div>
          <a href='#!' className='me-4 text-reset'>
            <MDBIcon fab icon='facebook-f' />
          </a>
          <a href='#!' className='me-4 text-reset'>
            <MDBIcon fab icon='twitter' />
          </a>
          <a href='#!' className='me-4 text-reset'>
            <MDBIcon fab icon='instagram' />
          </a>
          <a href='#!' className='me-4 text-reset'>
            <MDBIcon fab icon='linkedin' />
          </a>
          <a href='#!' className='me-4 text-reset'>
            <MDBIcon fab icon='github' />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            {/* About */}
            <MDBCol md='3' lg='4' xl='3' className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon='gem' className='me-3' />
                Con2Cus
              </h6>
              <p>
                'Con2Cus s' is your trusted CRM solution, providing tools to streamline your business operations.
              </p>
            </MDBCol>

            {/* Links */}
            <MDBCol md='2' lg='2' xl='2' className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='#!' className='text-reset'>
                  CRM Tools
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Analytics
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Support
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Pricing
                </a>
              </p>
            </MDBCol>

            {/* Useful links */}
            <MDBCol md='3' lg='2' xl='2' className='mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Your Account
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Help Center
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Privacy Policy
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Terms of Service
                </a>
              </p>
            </MDBCol>

            {/* Contact */}
            <MDBCol md='4' lg='3' xl='3' className='mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon='home' className='me-2' />
                Sarajevo, BIH 71000
              </p>
              <p>
                <MDBIcon icon='envelope' className='me-3' />
                info@con2cus.com
              </p>
              <p>
                <MDBIcon icon='phone' className='me-3' /> + 387 62 123 456
              </p>
              <p>
                <MDBIcon icon='print' className='me-3' /> + 387 36 789 101
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Copyright: 
        <a className='text-reset fw-bold' href='https://con2cus.de/'>
          Con2Cus.de
        </a>
      </div>
    </MDBFooter>
  );
}
