import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SteamLogin = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            console.log('Token stored in localStorage:', token);
            navigate('/');
        } else if (localStorage.getItem('token')) {
            console.log('Token already in localStorage, redirecting to home page');
            navigate('/');
        } else {
            console.log('No token found in URL or localStorage');
        }
    }, [location, navigate]);

    const handleLogin = () => {
        console.log('Redirecting to Steam login');
        window.location.href = 'http://localhost:8000/api/steam/login';
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <h1>Login with Steam</h1>
                <button onClick={handleLogin} className="btn btn-primary">
                    <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_large_noborder.png" alt="Login with Steam" />
                </button>
            </div>
        </div>
    );
};

export default SteamLogin;
