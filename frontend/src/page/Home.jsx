import React from 'react';
import logo from '../assets/logo/logo_skinharem.png';
import '../index.css';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="p-1 border-b-4 border-gray-900 "
        style={{
          background: 'linear-gradient(to bottom, #FFC300, #FFD60A)'
        }}
      >
        <nav className="flex justify-around items-center">
          <a href="#" className="nav-item">ACCUEIL</a>
          <a href="#" className="nav-item">PRODUITS</a>
          <img src={logo} alt="Skin Harem Logo" className="h-32 drop-shadow-xl" />
          <a href="#" className="nav-item ">PROFIL</a>
          <a href="#" className="nav-item">PANIER</a>
        </nav>
      </header>
      <main className="flex-grow bg-white p-6">
        {/* Contenue de la page accueil */}
      </main>
      <footer className="bg-gray-900 text-white p-6">
        <div className="flex justify-around">
          <div className="text-center">
            <h4 className="font-bold">Soutien</h4>
            <p>Commision de vente</p>
            <p>Contact</p>
          </div>
          <div className="text-center">
            <h4 className="font-bold">Payez en toute sécurité avec</h4>
            <div className="flex justify-center space-x-4">
              <img src="path-to-visa.png" alt="Visa" className="h-8" />
              <img src="path-to-mastercard.png" alt="MasterCard" className="h-8" />
              <img src="path-to-paypal.png" alt="PayPal" className="h-8" />
              <img src="path-to-gpay.png" alt="GPay" className="h-8" />
            </div>
          </div>
          <div className="text-center">
            <h4 className="font-bold">Suivez nous sur</h4>
            <div className="flex justify-center space-x-4">
              <img src="path-to-facebook.png" alt="Facebook" className="h-8" />
              <img src="path-to-instagram.png" alt="Instagram" className="h-8" />
              <img src="path-to-youtube.png" alt="YouTube" className="h-8" />
              <img src="path-to-twitter.png" alt="Twitter" className="h-8" />
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-4">tout droit réservé © Maxime caron, Soliane Besaha, Judikael Bellance, Destiter Florian</p>
      </footer>
    </div>
  );
};

export default Home;
