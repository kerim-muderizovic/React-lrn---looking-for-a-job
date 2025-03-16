import React, { useState } from 'react';
import '../Admin/settings.css'; // Assuming you have a CSS file for styling

const ToggleSwitch = ({ isOn, handleToggle, label }) => {
  return (
    <div className="toggle-switch-container">
      <div className="toggle-switch">
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          className="toggle-switch-checkbox"
          id={`toggle-switch-${label}`}
        />
        <label className="toggle-switch-label" htmlFor={`toggle-switch-${label}`}>
          <span className="toggle-switch-inner"></span>
          <span className="toggle-switch-switch"></span>
        </label>
      </div>
    </div>
  );
};

const Settings = () => {
  // State for settings
  const [settings, setSettings] = useState({
    allowNewAccounts: true,
    allowPasswordReset: true,
    requireStrongPasswords: false,
    gracePeriod: 30
  });

  // Handle checkbox changes
  const handleCheckboxChange = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    setSettings({
      ...settings,
      gracePeriod: parseInt(e.target.value) || 0
    });
  };

  // Save settings function
  const saveSettings = () => {
    // Here you would typically send the settings to your backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

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
                <ToggleSwitch 
                  isOn={settings.allowNewAccounts}
                  handleToggle={() => handleCheckboxChange('allowNewAccounts')}
                  label="allowNewAccounts"
                />
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
                <ToggleSwitch 
                  isOn={settings.allowPasswordReset}
                  handleToggle={() => handleCheckboxChange('allowPasswordReset')}
                  label="allowPasswordReset"
                />
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
                  Grace delay (days)
                  <input 
                    type="number" 
                    value={settings.gracePeriod}
                    onChange={handleNumberChange}
                    min="1"
                    max="365"
                  />
                </label>
              </div>
              <p>This is the number of days without a login after which an account scheduled for deletion is permanently deleted.</p>
            </div>
          </div>

          {/* Section 3: Security Settings */}
          <div className="section">
            <h3>Security Settings</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  Require strong passwords
                </label>
                <ToggleSwitch 
                  isOn={settings.requireStrongPasswords}
                  handleToggle={() => handleCheckboxChange('requireStrongPasswords')}
                  label="requireStrongPasswords"
                />
              </div>
              <p className='AdminPanelP'>Enforce password complexity requirements for all users.</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="save-section">
            <button 
              className="save-button" 
              onClick={saveSettings}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;