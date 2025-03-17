import React, { useState } from 'react';
import axios from 'axios';
import './user-profile.css';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

export default function UserProfile() {
  const { authUser, setAuthUser } = useAuth();
  const [url, setUrl] = useState('');
  const [name, setName] = useState(authUser?.user?.name || '');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { t } = useTranslation();

  const handleSavePhoto = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${authUser.user.id}/update-image`,
        { url },
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      console.log('Profile photo updated successfully');
      setAuthUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          profilePicture: url,
        },
      }));
      setIsEditingPhoto(false);
    } catch (err) {
      console.error('Failed to update profile photo:', err);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await axios.post('http://localhost:8000/user/update-password', {
        password: newPassword,
        password_confirmation: confirmPassword,
      }, {
        withXSRFToken: true,
        withCredentials: true
      });
      alert('Password updated successfully!');
      setIsEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password.');
    }
  };

  const handleSaveName = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${authUser.user.id}/update-name`,
        { name },
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      console.log('Name updated successfully');
      authUser.user.name = name;
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  return (
    <section className="sectionUserProfile">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4 profile-card">
              <div className="card-body text-center">
                <div className="profile-image-container">
                  <img
                    src={authUser?.user?.profilePicture || 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'}
                    alt={t('profile.avatarAlt', 'avatar')}
                    className="rounded-circle img-fluid profile-image"
                  />
                  {!isEditingPhoto && (
                    <button
                      onClick={() => setIsEditingPhoto(true)}
                      className="edit-photo-btn"
                    >
                      {t('profile.editPhoto', 'Edit Photo')}
                    </button>
                  )}
                </div>

                {isEditingPhoto && (
                  <div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder={t('profile.enterImageUrl', 'Enter Image URL')}
                      className="form-control profile-input"
                    />
                    <div className="mt-3">
                      <button
                        onClick={handleSavePhoto}
                        className="profile-btn profile-btn-success me-2"
                      >
                        {t('profile.savePhoto', 'Save Photo')}
                      </button>
                      <button
                        onClick={() => setIsEditingPhoto(false)}
                        className="profile-btn profile-btn-secondary"
                      >
                        {t('profile.cancel', 'Cancel')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-4 profile-card">
              <div className="card-body profile-info-card">
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <p className="profile-info-label">{t('profile.fullName', 'Full Name')}</p>
                  </div>
                  <div className="col-sm-9">
                    {isEditingName ? (
                      <div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t('profile.enterName', 'Enter Name')}
                          className="form-control profile-input"
                        />
                        <button
                          onClick={handleSaveName}
                          className="profile-btn profile-btn-success me-2"
                        >
                          {t('profile.saveName', 'Save Name')}
                        </button>
                        <button
                          onClick={() => setIsEditingName(false)}
                          className="profile-btn profile-btn-secondary"
                        >
                          {t('profile.cancel', 'Cancel')}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="profile-info-value">
                          {authUser?.user.name || t('profile.defaultName', 'John Doe')}
                        </p>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="profile-btn"
                        >
                          {t('profile.editName', 'Edit Name')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <hr className="profile-divider" />
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <p className="profile-info-label">{t('profile.email', 'Email')}</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="profile-info-value">
                      {authUser?.user?.email || t('profile.defaultEmail', 'example@example.com')}
                    </p>
                  </div>
                </div>
                <hr className="profile-divider" />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="profile-info-label">{t('profile.password', 'Password')}</p>
                  </div>
                  <div className="col-sm-9">
                    {isEditingPassword ? (
                      <div>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder={t('profile.enterNewPassword', 'Enter New Password')}
                          className="form-control profile-input"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t('profile.confirmNewPassword', 'Confirm New Password')}
                          className="form-control profile-input"
                        />
                        <button
                          onClick={handleSavePassword}
                          className="profile-btn profile-btn-success me-2"
                        >
                          {t('profile.savePassword', 'Save Password')}
                        </button>
                        <button
                          onClick={() => setIsEditingPassword(false)}
                          className="profile-btn profile-btn-secondary"
                        >
                          {t('profile.cancel', 'Cancel')}
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="profile-info-value">{t('profile.hiddenPassword', '********')}</p>
                        <button
                          onClick={() => setIsEditingPassword(true)}
                          className="profile-btn"
                        >
                          {t('profile.changePassword', 'Change Password')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
