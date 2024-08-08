import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Clients = () => {
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState('');

        useEffect(() => {
                const fetchProduct = async () => {
                        try {
                                const response = await axios.get('http://localhost:8000/api/product');
                                if (response.data.success) {
                                        setProducts(response.data.products);
                                } else {
                                        setError('Erreur lors de la récupération des produits');
                                }
                        } catch (err) {
                                console.log(err)
                                setError('Erreur lors de la récupération des produits');
                        } finally {
                                setLoading(false);
                        }
                };

                fetchProduct();
        }, []);

        if (loading) return <p className="text-center text-lg">Loading...</p>;
        if (error) return <p className="text-center text-red-500">{error}</p>;

        return (
            <div className="container mx-auto p-4">
                    <h2 className="text-3xl font-bold mb-6 text-center">Product List</h2>
                    <div className="overflow-x-auto w-full">
                            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                    <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                            <th className="border px-6 py-3 text-left">ID</th>
                                            <th className="border px-6 py-3 text-left">Name</th>
                                            <th className="border px-6 py-3 text-left">Slug</th>
                                            <th className="border px-6 py-3 text-left">Price</th>
                                            <th className="border px-6 py-3 text-left">Active</th>
                                            <th className="border px-6 py-3 text-left">Type</th>
                                            <th className="border px-6 py-3 text-left">Item ID</th>
                                            <th className="border px-6 py-3 text-left">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm font-light">
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-gray-100">
                                                <td className="border px-6 py-4">{product.id}</td>
                                                <td className="border px-6 py-4">{product.name}</td>
                                                <td className="border px-6 py-4">{product.slug}</td>
                                                <td className='border px-6 py-4'>{product.price} €</td>
                                                <td className='border px-6 py-4'>{product.isActive === 0 ? "indisponible" : "disponible"}</td>
                                                <td className='border px-6 py-4'>{product.type}</td>
                                                <td className='border px-6 py-4'>{product.item_id}</td>
                                                <td className='border px-6 py-4 space-x-4'>
                                                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Edit</button>
                                                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</button>
                                                </td>
                                        </tr>
                                    ))}
                                    </tbody>
                            </table>
                    </div>
            </div>
        );
};

export default Clients;