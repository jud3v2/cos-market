import React from 'react';
import Navbar from './components/AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="flex-1 p-4">
                <main>{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;