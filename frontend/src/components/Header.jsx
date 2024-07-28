import React from 'react';
import logo from '../assets/logo/logo_skinharem.png';
import '../index.css';

const Header = () => {
  return (
    <header
      className="p-1 border-b-4 border-gray-900"
      style={{
        background: 'linear-gradient(to bottom, #FFC300, #FFD60A)'
      }}
    >
      <nav className="flex flex-col sm:flex-row items-center justify-center sm:justify-around">
        <img src={logo} alt="Skin Harem Logo" className="h-32 drop-shadow-xl sm:order-2 order-1" />
        <div className="flex flex-col xl:gap-32 lg:gap-20 lg:flex-row md:flex-col sm:flex-rcol items-center order-2 sm:order-1 sm:space-x-6">
          <a href="/" className="nav-item">ACCUEIL</a>
          <a href="/produits" className="nav-item">PRODUITS</a>
        </div>
        <div className="flex flex-col xl:gap-32 lg:gap-20 lg:flex-row md:flex-col sm:flex-col items-center order-3 sm:order-3 sm:space-x-6">
          <a href="/profil" className="nav-item">PROFIL</a>
          <a href="/panier" className="nav-item">PANIER</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
