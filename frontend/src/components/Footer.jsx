import React from 'react';
import visa from '../assets/payement/visa.svg';
import maestro from '../assets/payement/maestro.svg';
import paypal from '../assets/payement/paypal.svg';
import gpay from '../assets/payement/gpay.svg';
import facebook from '../assets/media/facebook.svg';
import insta from '../assets/media/insta.svg';
import twitter from '../assets/media/twitter.svg';
import '../index.css';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6">
      <div className="flex flex-col items-center sm:flex-row sm:justify-around">
        <div className="text-center sm:text-left flex flex-col mb-4 sm:mb-0">
          <h4 className="font-bold pb-5">Soutien</h4>
          <a href="#">Commision de vente</a>
          <a href="#">Contact</a>
        </div>
        <div className="text-center mb-4 sm:mb-0">
          <h4 className="font-bold pb-5">Payez en toute sécurité avec</h4>
          <div className="flex justify-center space-x-4">
            <img src={visa} alt="Visa" className="w-10 border px-1 bg-slate-100 rounded-lg" />
            <img src={maestro} alt="MasterCard" className="w-10 border px-1 bg-slate-100 rounded-lg" />
            <img src={paypal} alt="PayPal" className="w-10 border px-1 bg-slate-100 rounded-lg" />
            <img src={gpay} alt="GPay" className="w-10 border px-1 bg-slate-100 rounded-lg" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold pb-5">Suivez nous sur</h4>
          <div className="flex justify-center space-x-4">
            <a href="#fb"><img src={facebook} alt="Facebook" className="h-8" /></a>
            <a href="#insta"><img src={insta} alt="Instagram" className="h-8" /></a>
            <a href="#twitter"><img src={twitter} alt="Twitter" className="h-8" /></a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-4">Tout droit réservé © Maxime Caron, Sofiane Bessaha, Judikael Bellance, Desitter Florian</p>
    </footer>
  );
};

export default Footer;
