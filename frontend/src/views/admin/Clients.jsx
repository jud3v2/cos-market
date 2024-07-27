import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Clients = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/admin/users');
                if (response.data.success) {
                    setUsers(response.data.users);
                } else {
                    setError('Erreur lors de la récupération des utilisateurs');
                }
            } catch (err) {
                setError('Erreur lors de la récupération des utilisateurs');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Customer List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="border px-6 py-3 text-left">ID</th>
                            <th className="border px-6 py-3 text-left">Nom</th>
                            <th className="border px-6 py-3 text-left">Email</th>
                            <th className="border px-6 py-3 text-left">Roles</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-100">
                                <td className="border px-6 py-4">{user.id}</td>
                                <td className="border px-6 py-4">{user.name}</td>
                                <td className="border px-6 py-4">{user.email}</td>
                                <td className='border px-6 py-4'>{user.roles}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Clients;