import React, { useState } from 'react';
import { useUser } from './userContext';
import axios from 'axios';
import './user-profile.css';

export default function UserProfile() {
  const { authenticatedUser } = useUser();
  const [url, setUrl] = useState('');
  const [name, setName] = useState(authenticatedUser?.name || ''); // Initialize with current user name
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const handleSavePhoto = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${authenticatedUser.id}/update-image`,
        { url },
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      console.log('Profile photo updated successfully');
      authenticatedUser.url = url;
      setIsEditingPhoto(false);
    } catch (err) {
      console.error('Failed to update profile photo:', err);
    }
  };

  const handleSaveName = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${authenticatedUser.id}/update-name`,
        { name },
        {
          withXSRFToken: true,
          withCredentials: true,
        }
      );
      console.log('Name updated successfully');
      authenticatedUser.name = name;
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
                  src={authenticatedUser?.url || 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp'}
                  alt="avatar"
                  className="rounded-circle img-fluid"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
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
                          {authenticatedUser?.name || 'John Doe'}
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
                      {authenticatedUser?.email || 'example@example.com'}
                    </p>
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
