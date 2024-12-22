import React, { useState } from 'react';
import { useUser } from './userContext';
import axios from 'axios';
import './user-profile.css';

export default function UserProfile() {
  const { authenticatedUser } = useUser();
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSavePhoto = async () => {
    try {
      await axios.put(
        `http://localhost:8000/user/${authenticatedUser.id}/update-image`,
        { url }, // Request payload
        {
          withXSRFToken: true, // Ensure XSRF token is included
          withCredentials: true, // Include credentials in the request
        }
      );
      console.log('URL updated successfully');

      // Optionally update the local authenticated user state
      authenticatedUser.url = url; // Update the user's URL attribute locally
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update URL:', err);
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
                <h5 className="my-3">{authenticatedUser?.name || 'Guest'}</h5>
                <p className="text-muted mb-1">Full Stack Developer</p>
                <p className="text-muted mb-4">Donji Vakuf, Bosna i Hercegovina</p>
                <div className="d-flex justify-content-center mb-2">
                  {isEditing ? (
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
                      Add profile photo
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-secondary btn-sm mt-2 ms-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary btn-sm"
                    >
                      Add profile photo from the internet
                    </button>
                  )}
                </div>
                {authenticatedUser?.url && (
                  <p className="text-muted mt-3"></p>
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
                    <p className="text-muted mb-0">
                      {authenticatedUser?.name || 'John Doe'}
                    </p>
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
