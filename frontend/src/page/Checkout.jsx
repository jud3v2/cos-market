import React, { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import CartService from '../services/cartService';
import { jwtDecode } from 'jwt-decode';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import config from '../config';
import CheckoutForm from '../components/checkoutForm';
import axios from 'axios';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const [cart, setCart] = useState(() => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  });

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  const bulletCoinReduction = 0;
  const tax = totalPrice * 0.2;
  const finalTotal = totalPrice - bulletCoinReduction + tax;

  const fetchClientSecret = async () => {
    try {
      const response = await axios.post('/payment/create-client-secret', { amount: totalPrice });
      setClientSecret(response.data.client_secret);
    } catch (error) {
      console.error('Error fetching client secret:', error);
    }
  };

  useEffect(() => {
    fetchClientSecret();
  }, []);

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  });

  const stripePromise = loadStripe(config.stripePublicKey);

  const options = {
    clientSecret: clientSecret,
  };

  const handleRemove = async (id) => {
    const updatedCartItems = cart.filter(item => item.id !== id);
    setCart(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));

    if (!localStorage.getItem('token')) {
      window.location.href = '/steam/login';
    }

    const response = await CartService.removeItem(id);
    if (!response.success) {
      console.error('Failed to remove item from database:', response.message);
    }
  };

  if (loading) {
    return <Loading message="Chargement de votre panier" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <div className="flex justify-between">
          <div className="w-2/2">
            <div className="grid grid-cols-1 gap-6 max-w-3xl">
              {cart.map(item => (
                <CartItem key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          </div>

          <div className="w-1/2 flex flex-col items-center">
  <div className="sticky top-4 bg-white p-10 rounded-lg shadow-md w-3/4 flex flex-col items-center">
    <div className="text-2xl font-bold mb-4">PANIER = {totalPrice.toFixed(2)}$</div>
    <div className="text-2xl font-bold mb-4">BULLET COIN REDUCTION = {bulletCoinReduction.toFixed(2)}$</div>
    <div className="text-2xl font-bold mb-4">TVA = +20%</div>
    <div className="text-2xl font-bold mt-4">TOTAL = {finalTotal.toFixed(2)}$</div>
  </div>
            <div className="sticky top-4 bg-white p-10 rounded-lg shadow-md w-3/4 flex flex-col items-center mt-3">
              <h2 className="text-2xl font-bold mb-4">Adresse de facturation</h2>
              <form action="#">
                    <div className={'mt-1'}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nom
                        </label>
                        <div className="mt-1">
                            <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="name"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                      <div className="mt-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Adresse
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="address"
                                id="address"
                                autoComplete="address"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className={'mt-1'}>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                Ville
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="city"
                                id="city"
                                autoComplete="city"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className={'mt-1'}>
                            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                Code postal
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="zip"
                                id="zip"
                                autoComplete="zip"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className={'mt-1'}>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                Pays
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="country"
                                id="country"
                                autoComplete="country"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <div className={'mt-5 flex justify-center w-full mx-auto'}>
                          <button type="submit" className={'p-2 bg-yellow-500 hover:bg-yellow-700 text-white rounded'}>
                            Enregistrer mon adresse de facturation
                          </button>
                        </div>
                      </div>
                    </div>
              </form>
            </div>
</div>
        </div>

        <div className="mt-6">
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
}
