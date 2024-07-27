import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../index.css';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-white p-6">
        {/* Contenue de la page accueil */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
