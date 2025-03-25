import React, { useState, useEffect } from 'react';
import '../Admin/settings.css'; // Assuming you have a CSS file for styling
import { useTranslation } from 'react-i18next';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

const ToggleSwitch = ({ isOn, handleToggle, label, disabled = false }) => {
  return (
    <div className="toggle-switch-container">
      <div className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
        <input
          type="checkbox"
          checked={isOn}
          onChange={handleToggle}
          className="toggle-switch-checkbox"
          id={`toggle-switch-${label}`}
          disabled={disabled}
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
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  
  // State for settings - matching the database schema
  const [settings, setSettings] = useState({
    requireStrongPassword: false,
    allow_creating_accounts: true,
    user_deletion_days: 30,
    enable_audit_logs: true,
    enable_reset_password: true
  });

  // Fetch settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/Admin/settings');
        
        if (response.data && response.data.settings) {
          setSettings(response.data.settings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

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
      user_deletion_days: parseInt(e.target.value) || 0
    });
  };

  // Save settings function
  const saveSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/Admin/ApplySettings', settings, {
        withXSRFToken: true
      });
      
      toast.success('Settings saved successfully!');
      console.log('Settings saved:', response.data);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading settings...</div>;
  }

  return (
    <div className='jedanDIv'>
      <div className="admin-settings">
        <h2 className='AdminH2'>{t('admin.settings')}</h2>
        <div className='AdminH3'>
          {/* Section 1: Account restrictions */}
          <div className="section">
            <h3>{t('admin.accountRestrictions')}</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  {t('admin.allowCreatingAccounts')}
                </label>
                <ToggleSwitch 
                  isOn={settings.allow_creating_accounts} 
                  handleToggle={() => handleCheckboxChange('allow_creating_accounts')} 
                  label="allow_creating_accounts" 
                />
              </div>
              <p className='AdminPanelP'>{t('admin.allowCreatingAccountsDescription')}</p>
            </div>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  {t('admin.allowResetPassword')}
                </label>
                <ToggleSwitch 
                  isOn={settings.enable_reset_password} 
                  handleToggle={() => handleCheckboxChange('enable_reset_password')} 
                  label="enable_reset_password" 
                />
              </div>
              <p className='AdminPanelP'>{t('admin.allowResetPasswordDescription')}</p>
            </div>
          </div>
          
          {/* Section 2: User deletion */}
          <div className="section">
            <h3>{t('admin.userDeletion')}</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  {t('admin.gracePeriod')} (days)
                </label>
                <input 
                  type="number" 
                  value={settings.user_deletion_days}
                  onChange={handleNumberChange}
                  min="1"
                  max="365"
                />
              </div>
              <p className='AdminPanelP'>{t('admin.gracePeriodDescription')}</p>
            </div>
          </div>

          {/* Section 3: Security Settings */}
          <div className="section">
            <h3>{t('admin.securitySettings')}</h3>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  {t('admin.requireStrongPassword')}
                </label>
                <ToggleSwitch 
                  isOn={settings.requireStrongPassword} 
                  handleToggle={() => handleCheckboxChange('requireStrongPassword')} 
                  label="requireStrongPassword" 
                />
              </div>
              <p className='AdminPanelP'>{t('admin.requireStrongPasswordDescription')}</p>
            </div>
            <div className="setting">
              <div className='tajDrugiDiv'>
                <label>
                  {t('admin.enableAuditLogs')}
                </label>
                <ToggleSwitch 
                  isOn={settings.enable_audit_logs} 
                  handleToggle={() => handleCheckboxChange('enable_audit_logs')} 
                  label="enable_audit_logs" 
                />
              </div>
              <p className='AdminPanelP'>{t('admin.enableAuditLogsDescription')}</p>
            </div>
          </div>
        
          {/* Save Button */}
          <div className="save-section">
            <button 
              className="save-button" 
              onClick={saveSettings}
              disabled={isLoading}
            >
              {isLoading ? t('common.saving') : t('common.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;