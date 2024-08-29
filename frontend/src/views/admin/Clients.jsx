import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Clients = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const fetchOrders = async (id, name) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/admin/users/${id}/orders`);
            if (response.data.orders) {
                setOrders(response.data.orders);
                setSelectedUser(id);
                setSelectedUserName(name);
                setIsModalOpen(true);
            } else {
                setError('Erreur lors de la récupération des commandes');
            }
        } catch (err) {
            setError('Erreur lors de la récupération des commandes');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p className="text-center text-lg">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    // styles pour le modal
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '20px',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '85%',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            maxHeight: '80vh', 
            overflowY: 'auto',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-6 text-center">Liste des clients</h2>
            <div className="overflow-x-auto mx-auto max-w-7xl">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="border px-6 py-3 text-left">ID Client</th>
                            <th className="border px-6 py-3 text-left">Pseudo</th>
                            <th className="border px-6 py-3 text-left">Email</th>
                            <th className="border px-6 py-3 text-left">Roles</th>
                            <th className="border px-6 py-3 text-left">Commandes</th>
                            <th className="border px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-100">
                                <td className="border px-6 py-4">{user.id}</td>
                                <td className="border px-6 py-4">{user.name}</td>
                                <td className="border px-6 py-4">{user.email}</td>
                                <td className='border px-6 py-4'>{user.roles}</td>
                                <td className='border px-6 py-4'>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                        onClick={() => fetchOrders(user.id, user.name)}
                                    >
                                        Voir les commandes du client
                                    </button>
                                </td>
                                <td className='border px-6 py-4 space-x-4'>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Editer</button>
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Orders Modal"
                style={customStyles}
            >
                <h3 className="text-2xl font-bold mb-4">Commande(s) effectuée(s) par : {selectedUserName}</h3>

                {orders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="border px-6 py-3 text-left">ID Commande</th>
                                    <th className="border px-6 py-3 text-left">Prix Total</th>
                                    <th className="border px-6 py-3 text-left">Prix Total TTC</th>
                                    <th className="border px-6 py-3 text-left">Taxe</th>
                                    <th className="border px-6 py-3 text-left">Status</th>
                                    <th className="border px-6 py-3 text-left">Méthode de paiement</th>
                                    <th className="border px-6 py-3 text-left">ID de paiement</th>
                                    <th className="border px-6 py-3 text-left">Adresse du client</th>
                                    <th className="border px-6 py-3 text-left">Date de création</th>
                                    <th className="border px-6 py-3 text-left">Date de modification</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-gray-100">
                                        <td className="border px-6 py-4">{order.id}</td>
                                        <td className="border px-6 py-4">{order.total_price}</td>
                                        <td className="border px-6 py-4">{order.total_price_with_tax}</td>
                                        <td className="border px-6 py-4">{order.tax}</td>
                                        <td className="border px-6 py-4">{order.status}</td>
                                        <td className="border px-6 py-4">{order.payment_method}</td>
                                        <td className="border px-6 py-4">{order.payment_id}</td>
                                        <td className="border px-6 py-4">{order.client_address}</td>
                                        <td className="border px-6 py-4">{order.created_at}</td>
                                        <td className="border px-6 py-4">{order.updated_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center">Cet utilisateur n'a pas encore effectué de commande.</p>
                )}

                <div className="mt-4 text-center">
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600" onClick={closeModal}>
                        Fermer
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Clients;
