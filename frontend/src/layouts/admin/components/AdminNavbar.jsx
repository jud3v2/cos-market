import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="fixed left-0 top-0 w-52 h-full bg-gray-800 text-white">
            <h1 className="text-2xl font-bold mt-4">Admin Panel</h1>
            <ul className="flex flex-col space-y-4 p-4">
                <li>
                    <Link to="/admin/panel" className="hover:text-blue-400">Dashboard</Link>
                </li>
                <li>
                    <Link to="/admin/clients" className="hover:text-blue-400">Clients</Link>
                </li>
                <li>
                    <Link to="/admin/products" className="hover:text-blue-400">Produits</Link>
                </li>
                <li>
                    <Link to="/admin/logout" className="hover:text-blue-400">Logout</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;