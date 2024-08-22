import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = jwtDecode(token);
                const response = await axios.get(`http://localhost:8000/api/user-profile/${user.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUserProfile(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserProfile();
    }, []);

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
    {userProfile ? (
        <div className="flex flex-col items-center w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            <img src={userProfile.avatar} alt="Steam Avatar" className="rounded-full mb-4" style={{ width: '150px', height: '150px' }} />
            <h2 className="text-2xl font-bold mb-2">{userProfile.profile_name}</h2>
            <p className="text-gray-600 mb-2"><strong>Pays :</strong> {userProfile.country || 'Inconnu'}</p>
            <p className="text-gray-600 mb-2"><strong>Adresse email :</strong> {userProfile.email || 'Inconnu'}</p>
            <p className="text-gray-600 mb-4"><strong>Steam ID :</strong> {userProfile.steam_id || 'Inconnu'}</p>
            <a href={`${userProfile.profile_url}/inventory/#730`} target="_blank" rel="noopener noreferrer">
                <button className="bg-yellow-400 hover:bg-orange-400 text-white text-xl font-bold py-3 px-10 rounded-lg mb-4">
                    Voir mon inventaire Counter Strike 2
                </button>
            </a>
            <a href={userProfile.profile_url} target="_blank" rel="noopener noreferrer">
                <button className="bg-yellow-400 hover:bg-orange-400 text-white text-xl font-bold py-3 px-10 rounded-lg">
                    Voir mon profil Steam
                </button>
            </a>
        </div>
    ) : (
        <p>Loading...</p>
    )}
</div>

    );
};

export default ProfilePage;