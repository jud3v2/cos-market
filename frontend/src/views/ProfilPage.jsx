import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import config from "../config/index.js";
import dayjs from "dayjs";

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [skins, setSkins] = useState([]);
    const [bulletCoin, setBulletCoin] = useState(null);
    const [error, setError] = useState(null);
    const [isAddressBookLoading, setIsAddressBookLoading] = useState(true);
    const [isBCTransactionLoading, setIsBCTransactionLoading] = useState(true);
    const [bcTransaction, setBcTransaction] = useState([]);
    const [isBCLoading, setIsBCLoading] = useState(true);
    const [addressBook, setAddressBook] = useState([]);
    const [newAddress, setNewAddress] = useState({
        name: '',
        address: '',
        city: '',
        zipcode: '',
        country: '',
        isDefault: false,
    });
    const [editMode, setEditMode] = useState(null);
    const [editAddress, setEditAddress] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);

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

        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/inventory', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setInventory(response.data.products || []);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchSkins = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/skin');
                setSkins(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchAddressBook = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/adress-book', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }).finally(() => {
                    setIsAddressBookLoading(false)
                });

                setAddressBook(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchBulletCoin = async () => {
            await axios.get(`${config.backendUrl}/bulletcoin`)
                .then(response => {
                    setBulletCoin(response.data)
                })
                .catch(console.error)
                .finally(() => {
                    setIsBCLoading(false);
                })
        }

        const fetchBCTransaction = async () => {
            await axios.get(`${config.backendUrl}/bc/transactions`)
                .then(response => {
                    setBcTransaction(response.data.transactions);
                })
                .catch(console.error)
                .finally(() => {
                    setIsBCTransactionLoading(false);
                })
        }

        fetchUserProfile();
        fetchInventory();
        fetchSkins();
        fetchAddressBook();
        fetchBulletCoin();
        fetchBCTransaction();
    }, []);

    // Fonction pour trouver l'image en comparant les noms
    const getImageForProduct = (productName) => {
        const matchedSkin = skins.find(skin => skin.name === productName);
        return matchedSkin ? matchedSkin.image : 'https://path-to-placeholder-image.com/default.png';
    };

    const handleAddAddress = async () => {
        setIsAdding(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/api/adress-book', newAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Mettre à jour l'état de toutes les adresses
            const updatedAddressBook = addressBook.map(address => ({
                ...address,
                isDefault: false
            }));

            setAddressBook([...updatedAddressBook, response.data]);

            setNewAddress({
                name: '',
                address: '',
                city: '',
                zipcode: '',
                country: '',
                isDefault: false,
            });
            setShowAddForm(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        setIsDeleting(id);
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/adress-book/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAddressBook(addressBook.filter(address => address.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEditAddress = async (id) => {
        setIsEditing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8000/api/adress-book/${id}`, editAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Mettre à jour l'état de toutes les adresses
            const updatedAddressBook = addressBook.map(address =>
                address.id === id ? response.data : { ...address, isDefault: response.data.isDefault ? false : address.isDefault }
            );
            setAddressBook(updatedAddressBook);
            setEditMode(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsEditing(false);
        }
    };

    const handleEditClick = (address) => {
        setEditMode(address.id);
        setEditAddress(address);
    };

    if (error) return <p>Error: {error}</p>;

    console.log(inventory);

    return (
        <div className="flex items-start justify-center min-h-screen bg-gray-100 p-6 gap-8">
            {userProfile ? (
                <>
                    {/* Colonne Profil */}
                    <div className='flex flex-col'>
                    <div className="w-full max-w-full bg-white p-6 rounded-lg shadow-lg mr-6">
                        <img src={userProfile.avatar} alt="Steam Avatar" className="rounded-full mb-4"
                            style={{ width: '150px', height: '150px' }} />
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
                    <div className={'w-full max-w-full'}>
                        {/* Section Inventaire */}
                        <div className="w-full bg-white p-6 rounded-lg shadow-lg mt-3">
                                <h3 className="text-xl font-bold mb-4">Votre Inventaire :</h3>
                                {inventory.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {inventory.map(product => (
                                            <div key={product.id} className="flex flex-col items-center">
                                                <img
                                                    src={product.skin.image}
                                                    alt={product.name}
                                                    className="w-24 h-24 object-fit"
                                                />
                                                <p className="text-sm text-center">{product.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600">Aucun produit dans votre inventaire.</p>
                                )}
                            </div>
                    </div>
                    </div>

                    <div className={'w-full max-w-full'}>
                        {/* Colonne BulletCoin Solde */}
                        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-4">Mes adresses de facturation :</h3>
                            {addressBook && addressBook.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addressBook.map((address) => (
                                        <div key={address.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                            {editMode === address.id ? (
                                                <>
                                                    {/* Mode d'édition */}
                                                    <input
                                                        type="text"
                                                        value={editAddress.name}
                                                        onChange={(e) => setEditAddress({
                                                            ...editAddress,
                                                            name: e.target.value
                                                        })}
                                                        className="border p-2 rounded w-full mb-2"
                                                        placeholder="Nom"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editAddress.address}
                                                        onChange={(e) => setEditAddress({
                                                            ...editAddress,
                                                            address: e.target.value
                                                        })}
                                                        className="border p-2 rounded w-full mb-2"
                                                        placeholder="Adresse"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editAddress.city}
                                                        onChange={(e) => setEditAddress({
                                                            ...editAddress,
                                                            city: e.target.value
                                                        })}
                                                        className="border p-2 rounded w-full mb-2"
                                                        placeholder="Ville"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editAddress.zipcode}
                                                        onChange={(e) => setEditAddress({
                                                            ...editAddress,
                                                            zipcode: e.target.value
                                                        })}
                                                        className="border p-2 rounded w-full mb-2"
                                                        placeholder="Code postal"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editAddress.country}
                                                        onChange={(e) => setEditAddress({
                                                            ...editAddress,
                                                            country: e.target.value
                                                        })}
                                                        className="border p-2 rounded w-full mb-2"
                                                        placeholder="Pays"
                                                    />
                                                    <div className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={editAddress.isDefault}
                                                            onChange={(e) => setEditAddress({
                                                                ...editAddress,
                                                                isDefault: e.target.checked
                                                            })}
                                                            className="mr-2"
                                                        />
                                                        <label>Définir comme adresse par défaut</label>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <button onClick={() => handleEditAddress(address.id)}
                                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                                disabled={isEditing}>
                                                            {isEditing ? 'Enregistrement...' : 'Enregistrer'}
                                                        </button>
                                                        <button onClick={() => setEditMode(null)}
                                                                className="bg-gray-500 text-white px-4 py-2 rounded ml-2">
                                                            Annuler
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Mode d'affichage */}
                                                    <h4 className="text-lg font-semibold mb-2">{address.name} {address.isDefault &&
                                                        <span
                                                            className="text-yellow-500 font-bold">(Par défaut)</span>}</h4>
                                                    <p className="text-gray-600 mb-1">{address.address}</p>
                                                    <p className="text-gray-600 mb-1">{address.city}, {address.zipcode}</p>
                                                    <p className="text-gray-600 mb-2">{address.country}</p>
                                                    <div className="flex justify-between mt-4">
                                                        <button onClick={() => handleEditClick(address)}
                                                                className="bg-blue-500 text-white px-4 py-2 rounded">
                                                            Modifier
                                                        </button>
                                                        <button onClick={() => handleDeleteAddress(address.id)}
                                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                                                disabled={isDeleting === address.id}>
                                                            {isDeleting === address.id ? 'Suppression...' : 'Supprimer'}
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : isAddressBookLoading ? (
                                <p className="text-gray-600">Chargement de vos adresse en cours...</p>
                            ) : (
                                <p className="text-gray-600">Aucune adresse enregistrée.</p>
                            )}

                            {/* Bouton pour afficher/masquer le formulaire d'ajout d'adresse */}
                            <button
                                onClick={() => setShowAddForm(!showAddForm)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
                            >
                                {showAddForm ? 'Masquer le formulaire' : 'Ajouter une nouvelle adresse'}
                            </button>

                            {/* Formulaire pour ajouter une nouvelle adresse */}
                            {showAddForm && (
                                <div className="w-full mt-6">
                                    <input
                                        type="text"
                                        placeholder="Nom de l'adresse (Ex: Domicile, Maison, Bureau)"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Adresse"
                                        value={newAddress.address}
                                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ville"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Code postal"
                                        value={newAddress.zipcode}
                                        onChange={(e) => setNewAddress({...newAddress, zipcode: e.target.value})}
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pays"
                                        value={newAddress.country}
                                        onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                    <div className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={newAddress.isDefault}
                                            onChange={(e) => setNewAddress({
                                                ...newAddress,
                                                isDefault: e.target.checked
                                            })}
                                            className="mr-2"
                                        />
                                        <label>Définir comme adresse par défaut</label>
                                    </div>
                                    <button
                                        onClick={handleAddAddress}
                                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                                        disabled={isAdding}
                                    >
                                        {isAdding ? 'Ajout en cours...' : 'Ajouter l\'adresse'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow-lg mt-3">
                            <h3 className="text-xl font-bold mb-4">Votre solde de bullet coin :</h3>
                            {bulletCoin && bulletCoin?.amount ? (
                                <div className={'w-full'}>
                                    Solde actuel de bullet coin: <strong>{bulletCoin?.amount}</strong>
                                </div>
                            ) : isBCLoading ? (
                                <p className="text-gray-600">Chargement de votre solde de BulletCoin....</p>
                            ) : (
                                <p className="text-gray-600">Aucun bullet coin enregistrée.</p>
                            )}
                        </div>

                        <div className="w-full bg-white p-6 rounded-lg shadow-lg mt-3">
                            <h3 className="text-xl font-bold mb-4">Vos Transactions de BulletCoins :</h3>
                            {bcTransaction && bcTransaction?.length > 0 ? (
                                <div className={'w-full'}>
                                    <details>
                                        <summary>
                                            Afficher les transactions
                                        </summary>
                                        <table
                                            className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                                            <thead>
                                            <tr className="bg-yellow-500 text-white uppercase text-sm leading-normal">
                                                <th className="py-3 px-6 text-left">ID Transaction</th>
                                                <th className="py-3 px-6 text-left">Type</th>
                                                <th className="py-3 px-6 text-left">Montant</th>
                                                <th className="py-3 px-6 text-left">Description</th>
                                                <th className="py-3 px-6 text-left">Statut</th>
                                                <th className="py-3 px-6 text-left">Date</th>
                                            </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-sm font-light">
                                            {bcTransaction && bcTransaction?.length > 0 && bcTransaction.map(transaction => (
                                                <tr key={transaction.transaction_id}
                                                    className="border-b border-gray-200 hover:bg-yellow-100">
                                                    <td className="py-3 px-6 text-left">{transaction.transaction_id}</td>
                                                    <td className="py-3 px-6 text-left">{transaction.type}</td>
                                                    <td className="py-3 px-6 text-left">{transaction.amount}</td>
                                                    <td className="py-3 px-6 text-left">{transaction.description}</td>
                                                    <td className="py-3 px-6 text-left">{transaction.status}</td>
                                                    <td className="py-3 px-6 text-left">{dayjs(transaction.created_at).format('LLLL')}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                            <tfoot>
                                            <tr>
                                                <td colSpan="6"
                                                    className="py-3 px-6 text-center bg-yellow-200 text-gray-800">End of
                                                    Transactions
                                                </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </details>
                                </div>
                            ) : isBCLoading ? (
                                <p className="text-gray-600">Chargement de vos bullet coin transaction...</p>
                            ) : (
                                <p className="text-gray-600">Aucune transactions n'a été effectué sur votre compte.</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <p>Chargement de votre profile...</p>
            )}
        </div>
    );
};

export default ProfilePage;
