import React, { useEffect } from 'react';
import {toast} from "react-toastify";

export default function Logout() {
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('dateResetAttempt');
        localStorage.removeItem('attempts');
        toast.info('Vous êtes déconnecté');

        setTimeout(() => {
                window.location.href = '/';
        }, 1500);
    }, []);

    return <div>Vous êtes déconnecté</div>;
}