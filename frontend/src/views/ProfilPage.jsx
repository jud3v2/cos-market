import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';
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
<main>
        <div>
            {userProfile ? (
                <div>
                    <img src={userProfile.avatar} alt="Steam Avatar" style={{ borderRadius: '50%', width: '150px', height: '150px' }} />
                    <h2>{userProfile.profile_name}</h2>
                    <p><strong>Pays :</strong> {userProfile.country || 'Unknown'}</p>
                    <p><strong>Adresse email :</strong> {userProfile.email || 'Unknown'}</p>
                    <p><strong>Steam ID :</strong> {userProfile.steam_id || 'Unknown'}</p>
                    <a href={`${userProfile.profile_url}/inventory/#730`} target="_blank" rel="noopener noreferrer">
                        <button className="bg-yellow-400 hover:bg-orange-400 text-white text-xl font-bold py-3 px-52 rounded">
                            Voir mon inventaire Counter Strike 2
                        </button>
                    </a>
                    <a href={userProfile.profile_url} target="_blank" rel="noopener noreferrer">
                        <button className="flex mt-2 bg-yellow-400 hover:bg-orange-400 text-white text-xl font-bold py-3 px-52 rounded">
                            Voir mon profil Steam
                        </button>
                    </a>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
        </main>
    );
};

export default ProfilePage;
