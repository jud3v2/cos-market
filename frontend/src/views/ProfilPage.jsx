import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/steam/inventory', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                setInventory(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Your Steam Inventory</h1>
            <ul>
                {inventory.map((item, index) => (
                    <li key={index}>
                        <img src={`https://steamcommunity-a.akamaihd.net/economy/image/${item.icon_url}`} alt={item.name} />
                        <p>{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Inventory;
