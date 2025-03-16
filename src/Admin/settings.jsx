import React from 'react';
import '../Admin/settings.css'; // Assuming you have a CSS file for styling

const Settings = () => {
  return (
    <div className='jedanDIv'>
      <div className="admin-settings">
        <h2 className='AdminH2'>Admin settings</h2>
        <div className='AdminH3'>
          {/* Section 1: Account restrictions */}
          <div className="section">
            <h3>Account restrictions</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  Allow creating new accounts
                </label>
                <input type="checkbox" className='checkBoxAdminPanel' />
              </div>
              <p className='AdminPanelP'>By default, any user visiting your Baserow domain can sign up for a new account.</p>
              <div className='FamoznaLinija'>

              </div>
            </div>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  Allow resetting password
                </label>
                <input type="checkbox" className='checkBoxAdminPanel' />
              </div>
              <p className='AdminPanelP'>By default, users can request a password reset link.</p>
            </div>
          </div>

          {/* Section 2: User deletion */}
          <div className="section">
            <h3>User deletion</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  Grace delay
                  <input type="number" value="30" readOnly />
                </label>
              </div>
              <p>This is the number of days without a login after which an account scheduled for deletion is permanently deleted.</p>
            </div>
          </div>

          {/* Section 3: Add more sections here if needed */}
          {/* Example:
          <div className="section">
            <h3>Another Section</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  Example Setting
                </label>
                <input type="checkbox" className='checkBoxAdminPanel' />
              </div>
              <p className='AdminPanelP'>This is an example setting description.</p>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
};

export default Settings;