import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo/logo_cosmarket.png';
import '../index.css';

const Header = () => {
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const updateCartItemCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItemCount(cart.length);
    };

    updateCartItemCount();

    window.addEventListener('storage', updateCartItemCount);

    return () => {
      window.removeEventListener('storage', updateCartItemCount);
    };
  }, []);

  const getNavItemClass = (path) => {
    return location.pathname === path ? 'nav-item border-b-4 border-gray-950 ' : 'nav-item';
  };

  return (
      <header
          className="p-1 border-b-4 border-gray-900"
          style={{
            background: 'linear-gradient(to bottom, #FFC300, #FFD60A)'
          }}
      >
        <nav className="flex flex-col sm:flex-row items-center justify-center sm:justify-around">
          <img src={logo} alt="Skin Harem Logo" className="h-24 drop-shadow-xl sm:order-2 order-1" />
          <div className="flex flex-col xl:gap-32 lg:gap-20 lg:flex-row md:flex-col sm:flex-rcol items-center order-2 sm:order-1 sm:space-x-6">
            <a href="/" className={getNavItemClass('/')}>ACCUEIL</a>
            <a href="/produits" className={getNavItemClass('/produits')}>PRODUITS</a>
          </div>
          <div className="flex flex-col xl:gap-32 lg:gap-20 lg:flex-row md:flex-col sm:flex-col items-center order-3 sm:order-3 sm:space-x-6">
            <a href="/profil" className={getNavItemClass('/profil')}>PROFIL</a>
            <a href="/panier" className={getNavItemClass('/panier')}>PANIER ({cartItemCount})</a>
          </div>
        </nav>
      </header>
  );
};

export default Header;