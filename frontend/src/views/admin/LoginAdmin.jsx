import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Vérification si l'administrateur est déjà connecté
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/admin/panel');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await axios.post(`${config.backendUrl}/admin/login`, {
            email,
                password,
            });
            setMessage(response.data.message);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/admin/panel';

        } catch (error) {
            console.error(error);
            setMessage(error.response.data.message || 'An error occurred');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
            {message && <p className="text-red-500 mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="p-6 rounded shadow-md w-80">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginAdmin;