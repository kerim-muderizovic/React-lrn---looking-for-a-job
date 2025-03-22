import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import './user-profile.css';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';

export default function UserProfile() {
  const { authUser, setAuthUser, fetchAuthenticatedUser } = useAuth();
  const [url, setUrl] = useState('');
  const [name, setName] = useState(authUser?.user?.name || '');
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Update the name state when authUser changes
    if (authUser?.user?.name) {
      setName(authUser.user.name);
    }
  }, [authUser]);

  const handleSavePhoto = async () => {
    if (!url.trim()) {
      setPhotoError(t('userProfile.enterValidUrl', 'Please enter a valid URL'));
      return;
    }
    
    setIsSubmitting(true);
    setPhotoError('');
    
    try {
      console.log('Updating profile photo', authUser);
      const response = await axios.put(
        `/user/${authUser.user.id}/update-image`,
        { url },
        { withXSRFToken: true }
      );
      console.log('Profile photo updated successfully', response.data);
      
      // Refresh the user data from the server to ensure we have the latest
      await fetchAuthenticatedUser();
      
      // Also update local state
      setAuthUser(prev => ({
        ...prev,
        user: {
          ...prev.user,
          url: url
        }
      }));
      
      // Reset the state and close the editing UI
      setIsEditingPhoto(false);
    } catch (err) {
      console.error('Failed to update profile photo:', err);
      setPhotoError(err.response?.data?.message || t('userProfile.errorUpdatingPhoto', 'Error updating photo. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (!newPassword.trim()) {
      setPasswordError(t('userProfile.enterValidPassword', 'Please enter a valid password'));
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(t('userProfile.passwordsDoNotMatch', 'Passwords do not match!'));
      return;
    }
    
    setIsSubmitting(true);
    setPasswordError('');

    try {
      const response = await axios.post('/user/update-password', {
        password: newPassword,
        password_confirmation: confirmPassword,
      }, { withXSRFToken: true });
      
      console.log('Password updated successfully', response.data);
      setPasswordError('');
      
      // Refresh user data
      await fetchAuthenticatedUser();
      
      // Reset state and close editing UI
      setIsEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Failed to update password:', err);
      setPasswordError(err.response?.data?.message || t('userProfile.errorUpdatingPassword', 'Error updating password. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveName = async () => {
    if (!name.trim()) {
      setNameError(t('userProfile.enterValidName', 'Please enter a valid name'));
      return;
    }
    
    setIsSubmitting(true);
    setNameError('');
    
    try {
      const response = await axios.put(
        `/user/${authUser.user.id}/update-name`,
        { name },
        { withXSRFToken: true }
      );
      console.log('Name updated successfully', response.data);
      
      // Refresh the user data from the server
      await fetchAuthenticatedUser();
      
      // Also update local state
      setAuthUser(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: name
        }
      }));
      
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
      setNameError(err.response?.data?.message || t('userProfile.errorUpdatingName', 'Error updating name. Please try again.'));
    } finally {
      setIsSubmitting(false);
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
                      onChange={(e) => {
                        setUrl(e.target.value);
                        setPhotoError(''); // Clear error when input changes
                      }}
                      placeholder={t('profile.enterImageUrl', 'Enter Image URL')}
                      className="form-control profile-input"
                    />
                    {photoError && (
                      <div className="text-danger mt-2">{photoError}</div>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={handleSavePhoto}
                        className="profile-btn profile-btn-success me-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span>
                            <i className="fas fa-spinner fa-spin me-1"></i>
                            {t('profile.saving', 'Saving...')}
                          </span>
                        ) : (
                          t('profile.savePhoto', 'Save Photo')
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPhoto(false);
                          setPhotoError('');
                          setUrl('');
                        }}
                        className="profile-btn profile-btn-secondary"
                        disabled={isSubmitting}
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
                          onChange={(e) => {
                            setName(e.target.value);
                            setNameError('');
                          }}
                          placeholder={t('profile.enterName', 'Enter Name')}
                          className="form-control profile-input"
                        />
                        {nameError && (
                          <div className="text-danger mt-2">{nameError}</div>
                        )}
                        <button
                          onClick={handleSaveName}
                          className="profile-btn profile-btn-success me-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>
                              <i className="fas fa-spinner fa-spin me-1"></i>
                              {t('profile.saving', 'Saving...')}
                            </span>
                          ) : (
                            t('profile.saveName', 'Save Name')
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false);
                            setNameError('');
                            setName(authUser?.user.name || '');
                          }}
                          className="profile-btn profile-btn-secondary"
                          disabled={isSubmitting}
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
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError('');
                          }}
                          placeholder={t('profile.enterNewPassword', 'Enter New Password')}
                          className="form-control profile-input"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError('');
                          }}
                          placeholder={t('profile.confirmNewPassword', 'Confirm New Password')}
                          className="form-control profile-input"
                        />
                        {passwordError && (
                          <div className="text-danger mt-2">{passwordError}</div>
                        )}
                        <button
                          onClick={handlePasswordSubmit}
                          className="profile-btn profile-btn-success me-2"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>
                              <i className="fas fa-spinner fa-spin me-1"></i>
                              {t('profile.saving', 'Saving...')}
                            </span>
                          ) : (
                            t('profile.savePassword', 'Save Password')
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingPassword(false);
                            setPasswordError('');
                            setNewPassword('');
                            setConfirmPassword('');
                          }}
                          className="profile-btn profile-btn-secondary"
                          disabled={isSubmitting}
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
