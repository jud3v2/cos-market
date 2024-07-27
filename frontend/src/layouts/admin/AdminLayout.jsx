import React from 'react';
import Navbar from './components/AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <div>
                <script src="https://cdn.tailwindcss.com"></script>
                <header className="bg-gray-800 text-white p-4">
                        <nav className="flex justify-between">
                                <h1 className="text-xl">Admin Panel</h1>
                                <div>
                                        <Link to="/admin/clients" className="mr-4 hover:underline">Clients</Link>
                                        <Link to="/admin/products" className="hover:underline">Produits</Link>
                                </div>
                        </nav>
                </header>
                <main className="p-4">
                        {children}
                </main>
        </div>
    );
};

export default AdminLayout;