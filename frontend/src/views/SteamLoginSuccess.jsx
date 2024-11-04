import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from "../components/Loading.jsx";
import config from '../config';

const SteamLoginSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get(`${config.backendUrl}/user`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Failed to fetch user data', error);
                    navigate('/'); 
                });
        } else {
            navigate('/');
        }
    }, [location, navigate]);

    if (!user) {
        return <Loading message={'Chargement de votre profil'} />;
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1>Welcome, {user.profile_name}</h1>
                <img src={user.avatar} alt="Avatar" />
                <p>Profile URL: <a href={user.profile_url} target="_blank" rel="noopener noreferrer">{user.profile_url}</a></p>
                <p>Country: {user.profile_country}</p>
                <p>State: {user.profile_state}</p>
                <p>City: {user.profile_city}</p>
            </div>
        </div>
    );
};

export default SteamLoginSuccess;
