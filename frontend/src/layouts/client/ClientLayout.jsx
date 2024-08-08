import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../../index.css';

const ClientLayout = ({ children }) => {
    return (
        <div className="client-layout">
            <Header />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;