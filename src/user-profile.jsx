import React, { useState } from 'react';
import axios from 'axios';
import './user-profile.css';
import { useAuth } from './AuthContext';
export default function UserProfile() {
  const { authenticatedUser } = useUser();
  const {useAuth} = useAuth();
  const [url, setUrl] = useState('');
  const [name, setName] = useState(useAuth?.name || ''); // Initialize with current user name
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSavePhoto = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${useAuth.id}/update-image`,
        { url },
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      console.log('Profile photo updated successfully');
      useAuth.url = url;
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
      await axios.post('http://localhost:8000/user/update-password', { password: newPassword,
        password_confirmation: confirmPassword, },{ 
        withXSRFToken:true,
        withCredentials: true });
      alert('Password updated successfully!');
      setIsEditingPassword(false);
    } catch (error) {
      console.log(newPassword, 'a drugi:',confirmPassword)
      console.error('Error updating password:', error);
      alert('Failed to update password.');
    }
  };
  

  const handleSaveName = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${useAuth.id}/update-name`,
        { name },
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      console.log('Name updated successfully');
      useAuth.name = name;
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update name:', err);
    }
  };

  return (
    <section style={{ backgroundColor: '#eee' }} className="sectionUserProfile">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <img
                  src={useAuth?.url || 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                {isEditingPhoto ? (
                  <div>
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter Image URL"
                      className="form-control"
                    />
                    <button
                      onClick={handleSavePhoto}
                      className="btn btn-success btn-sm mt-2"
                    >
                      Save Photo
                    </button>
                    <button
                      onClick={() => setIsEditingPhoto(false)}
                      className="btn btn-secondary btn-sm mt-2 ms-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingPhoto(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit Photo
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-8">
  <div className="card mb-4">
    <div className="card-body">
      <div className="row">
        <div className="col-sm-3">
          <p className="mb-0">Full Name</p>
        </div>
        <div className="col-sm-9">
          {isEditingName ? (
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="form-control"
              />
              <button
                onClick={handleSaveName}
                className="btn btn-success btn-sm mt-2"
              >
                Save Name
              </button>
              <button
                onClick={() => setIsEditingName(false)}
                className="btn btn-secondary btn-sm mt-2 ms-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="text-muted mb-0">
                {useAuth?.name || 'John Doe'}
              </p>
              <button
                onClick={() => setIsEditingName(true)}
                className="btn btn-primary btn-sm mt-2"
              >
                Edit Name
              </button>
            </div>
          )}
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <p className="mb-0">Email</p>
        </div>
        <div className="col-sm-9">
          <p className="text-muted mb-0">
            {useAuth?.email || 'example@example.com'}
          </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-3">
          <p className="mb-0">Password</p>
        </div>
        <div className="col-sm-9">
          {isEditingPassword ? (
            <div>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="form-control"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="form-control mt-2"
              />
              <button
                onClick={handleSavePassword}
                className="btn btn-success btn-sm mt-2"
              >
                Save Password
              </button>
              <button
                onClick={() => setIsEditingPassword(false)}
                className="btn btn-secondary btn-sm mt-2 ms-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="text-muted mb-0">********</p>
              <button
                onClick={() => setIsEditingPassword(true)}
                className="btn btn-primary btn-sm mt-2"
              >
                Change Password
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
