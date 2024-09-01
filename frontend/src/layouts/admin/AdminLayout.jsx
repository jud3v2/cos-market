import React from 'react';
import Navbar from './components/AdminNavbar';

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen justify-between">
            <div className={'mr-48'}>
                    <Navbar />
            </div>
            <div className="w-full">
                <main>{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;