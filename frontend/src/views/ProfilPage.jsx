import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
    const [steamId, setSteamId] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSteamId = async () => {
            try {
                const user = jwtDecode(localStorage.getItem('token'));
                const response = await axios.get('http://localhost:8000/api/steam/profile-url?user_id=' + user.sub);
                const profileUrl = response.data.profile_url;

                const steamId = profileUrl.split('/').filter(Boolean).pop();
                setSteamId(steamId);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSteamId();
    }, []);

    if (error) return <p>Error: {error}</p>;
    const inventoryUrl = `https://steamcommunity.com/profiles/${steamId}/inventory/#730`;

    return (
        <div>
            <h1>Your Steam Profile</h1>
            {steamId ? (
                <a href={inventoryUrl} target="_blank" rel="noopener noreferrer">
                    <button>View Your CS:GO Inventory</button>
                </a>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProfilePage;

