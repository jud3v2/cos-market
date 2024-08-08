import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from "../../components/Loading.jsx";

const SteamLoginSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            navigate('/admin/panel');
        }
    }, [location, navigate]);

    return <Loading message={"Connexion en cours..."} />;
};

export default SteamLoginSuccess;
