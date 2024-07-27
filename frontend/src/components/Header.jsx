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
      <nav className="flex justify-around items-center">
        <a href="/" className="nav-item">ACCUEIL</a>
        <a href="/produits" className="nav-item">PRODUITS</a>
        <img src={logo} alt="Skin Harem Logo" className="h-32 drop-shadow-xl" />
        <a href="/profil" className="nav-item">PROFIL</a>
        <a href="/panier" className="nav-item">PANIER</a>
      </nav>
    </header>
  );
};

export default Header;
