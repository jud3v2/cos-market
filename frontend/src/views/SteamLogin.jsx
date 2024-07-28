import React from 'react';

const SteamLogin = () => {
    const handleLogin = () => {
        window.location.href = '/auth/steam';
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
