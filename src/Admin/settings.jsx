import React, { useState } from 'react';
import './settings.css';

const Settings = () => {
    const [siteTitle, setSiteTitle] = useState("My Website");
    const [tagline, setTagline] = useState("Just another amazing website");
    const [email, setEmail] = useState("admin@example.com");
    const [disableSignup, setDisableSignup] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    const saveSettings = () => {
        alert("Settings saved successfully!");
    };

    return (
        <div className="containerSettings">
            <h2>Admin Settings</h2>

            {/* Site Title */}
            <div className='formaSetinga'>
            <label className="search-label">
                <input
                    type="text"
                    className="input"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    placeholder="Enter site title..."
                />
                <kbd className="slash-icon">/</kbd>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                    <g>
                        <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="currentColor" data-original="#000000"></path>
                    </g>
                </svg>
            </label>

            {/* Tagline */}
            <label className="search-label">
                <input
                    type="text"
                    className="input"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Enter tagline..."
                />
                <kbd className="slash-icon">/</kbd>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                    <g>
                        <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="currentColor" data-original="#000000"></path>
                    </g>
                </svg>
            </label>

            {/* Admin Email */}
            <label className="search-label">
                <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email..."
                />
                <kbd className="slash-icon">/</kbd>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                    <g>
                        <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="currentColor" data-original="#000000"></path>
                    </g>
                </svg>
            </label>

            {/* Change Password */}
            <label className="search-label">
                <input
                    type="password"
                    className="input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                />
                <kbd className="slash-icon">/</kbd>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                    <g>
                        <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="currentColor" data-original="#000000"></path>
                    </g>
                </svg>
            </label>

            {/* Send Email to All Users */}
            <label className="search-label">
                <textarea
                    className="input"
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <kbd className="slash-icon">/</kbd>
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 56.966 56.966" style={{ enableBackground: 'new 0 0 512 512' }} xmlSpace="preserve">
                    <g>
                        <path d="M55.146 51.887 41.588 37.786A22.926 22.926 0 0 0 46.984 23c0-12.682-10.318-23-23-23s-23 10.318-23 23 10.318 23 23 23c4.761 0 9.298-1.436 13.177-4.162l13.661 14.208c.571.593 1.339.92 2.162.92.779 0 1.518-.297 2.079-.837a3.004 3.004 0 0 0 .083-4.242zM23.984 6c9.374 0 17 7.626 17 17s-7.626 17-17 17-17-7.626-17-17 7.626-17 17-17z" fill="currentColor" data-original="#000000"></path>
                    </g>
                </svg>
            </label>

            {/* Disable Account Creation */}
            <label className='modernCheckBox'>
                <input className='invisible'
                    type="checkbox"
                    checked={disableSignup}
                    onChange={() => setDisableSignup(!disableSignup)}
                /> Disable Account Creation
                  <div class="checkmark"></div>
            </label>

            {/* Save Button */}
            <button onClick={saveSettings}>Save Changes</button>
            </div>
        </div>
    );
};

export default Settings;