import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
    const [profileUrl, setProfileUrl] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileUrl = async () => {
            try {
                const user = jwtDecode(localStorage.getItem('token'));
                const response = await axios.get('http://localhost:8000/api/steam/profile-url?user_id='+ user.sub);
                setProfileUrl(response.data.profile_url);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProfileUrl();
    }, []);

    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Your Steam Profile</h1>
            {profileUrl ? (
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                    <button>View Your Steam Profile</button>
                </a>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;
