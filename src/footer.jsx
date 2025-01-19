import React from 'react';
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit';
import './footer.css';
import { useTranslation } from 'react-i18next';
export default function Footer() {
  const {t}=useTranslation();
  return (
    <MDBFooter className='bg-light text-center text-lg-start text-muted'>
    <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
      {/* Social media links */}
      <div className='me-5 d-none d-lg-block'>
        <span>{t('footer.socialMedia.description')}</span>
      </div>
      <div>
        <a href={t('footer.socialMedia.links.facebook')} className='me-4 text-reset'>
          <MDBIcon fab icon='facebook-f' />
        </a>
        <a href={t('footer.socialMedia.links.twitter')} className='me-4 text-reset'>
          <MDBIcon fab icon='twitter' />
        </a>
        <a href={t('footer.socialMedia.links.instagram')} className='me-4 text-reset'>
          <MDBIcon fab icon='instagram' />
        </a>
        <a href={t('footer.socialMedia.links.linkedin')} className='me-4 text-reset'>
          <MDBIcon fab icon='linkedin' />
        </a>
        <a href={t('footer.socialMedia.links.github')} className='me-4 text-reset'>
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
              {t('footer.sections.about.title')}
            </h6>
            <p>{t('footer.sections.about.description')}</p>
          </MDBCol>
  
          {/* Products */}
          <MDBCol md='2' lg='2' xl='2' className='mb-4'>
            <h6 className='text-uppercase fw-bold mb-4'>{t('footer.sections.products.title')}</h6>
            <p><a href='#!' className='text-reset'>{t('footer.sections.products.items.CRMTools')}</a></p>
            <p><a href='#!' className='text-reset'>{t('footer.sections.products.items.analytics')}</a></p>
            <p><a href='#!' className='text-reset'>{t('footer.sections.products.items.support')}</a></p>
            <p><a href='#!' className='text-reset'>{t('footer.sections.products.items.pricing')}</a></p>
          </MDBCol>
  
          {/* Useful Links */}
          <MDBCol md='3' lg='2' xl='2' className='mb-4'>
            <h6 className='text-uppercase fw-bold mb-4'>{t('footer.sections.usefulLinks.title')}</h6>
            <p><a href='#!' className='text-reset'>{t('footer.sections.usefulLinks.items.account')}</a></p>
            <p><a href='#!' className='text-reset'>{t('footer.sections.usefulLinks.items.helpCenter')}</a></p>
            <p><a href='#!' className='text-reset'>{t('footer.sections.usefulLinks.items.privacyPolicy')}</a></p>
            <p><a href='#!' className='text-reset'>{t('footer.sections.usefulLinks.items.termsOfService')}</a></p>
          </MDBCol>
  
          {/* Contact */}
          <MDBCol md='4' lg='3' xl='3' className='mb-md-0 mb-4'>
            <h6 className='text-uppercase fw-bold mb-4'>{t('footer.sections.contact.title')}</h6>
            <p><MDBIcon icon='home' className='me-2' />{t('footer.sections.contact.items.address')}</p>
            <p><MDBIcon icon='envelope' className='me-3' />{t('footer.sections.contact.items.email')}</p>
            <p><MDBIcon icon='phone' className='me-3' />{t('footer.sections.contact.items.phone')}</p>
            <p><MDBIcon icon='print' className='me-3' />{t('footer.sections.contact.items.fax')}</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  
    <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
      © 2024 {t('footer.copyright.text')} 
      <a className='text-reset fw-bold' href={t('footer.copyright.linkUrl')}>
        {t('footer.copyright.linkText')}
      </a>
    </div>
  </MDBFooter>
  
  );
}
