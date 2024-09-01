import React from 'react';
import { Link } from 'react-router-dom';
import { Dashboard, People, ShoppingCart, ExitToApp } from '@mui/icons-material';

const Navbar = () => {
    return (
        <nav className="fixed left-0 top-0 w-64 h-full bg-gray-900 text-white shadow-lg">
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
                <ul className="flex flex-col space-y-4">
                    <li>
                        <Link to="/admin/panel" className="flex items-center space-x-3 hover:text-blue-500 transition-colors duration-300">
                            <Dashboard />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/clients" className="flex items-center space-x-3 hover:text-blue-500 transition-colors duration-300">
                            <People />
                            <span>Clients</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/products" className="flex items-center space-x-3 hover:text-blue-500 transition-colors duration-300">
                            <ShoppingCart />
                            <span>Produits</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/admin/logout" className="flex items-center space-x-3 text-red-500 hover:text-red-700 transition-colors duration-300">
                            <ExitToApp />
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
