import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo/logo_cosmarket.png';
import '../index.css';
import { useRecoilValue } from 'recoil';
import { cartCountState } from '../states/cart';

const Header = () => {
  const location = useLocation();
  const count = useRecoilValue(cartCountState);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token'); // Vérifie si le token est présent

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
        <div className="flex flex-col xl:gap-32 lg:gap-20 lg:flex-row md:flex-col sm:flex-row items-center order-2 sm:order-1 sm:space-x-6">
          <a href="/" className={getNavItemClass('/')}>ACCUEIL</a>
          <a href="/produits" className={getNavItemClass('/produits')}>PRODUITS</a>
        </div>
        <div 
          className="relative flex flex-col xl:gap-32 lg:gap-20 lg:flex-row md:flex-col sm:flex-col items-center order-3 sm:order-3 sm:space-x-6"
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          <a href="/profil" className={getNavItemClass('/profil')}>PROFIL</a>
          {isProfileHovered && (
            <div
              className="absolute mt-28 p-2 bg-gray-200 rounded shadow-lg bg-yellow-400 z-20"
              style={{ transition: 'opacity 0.5s', opacity: isProfileHovered ? 1 : 0 }}
            >
              {isAuthenticated ? (
                <>
                  <a
                    href="/cos-aim-lab"
                    className="block px-4 py-2 text-black hover:bg-white"
                  >
                    COS AIM LAB
                  </a>
                  <a
                    href="/logout"
                    onClick={() => localStorage.removeItem('token')}
                    className="block px-4 py-2 text-black hover:bg-white"
                  >
                    Déconnexion
                  </a>
                </>
              ) : (
                <a
                  href="/steam/login"
                  className="block px-4 py-2 text-black hover:bg-white"
                >
                  Connexion
                </a>
              )}
            </div>
          )}
          <a href="/panier" className={getNavItemClass('/panier')}>PANIER ({count})</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
