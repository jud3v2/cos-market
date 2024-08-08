import React, { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';
import CartService from '../services/cartService';
import '../index.css';
import {Link} from "react-router-dom";

const Panier = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchedCartItems = CartService.getCart();
    setCartItems(fetchedCartItems);
  }, []);

  const handleRemove = async (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);

    localStorage.setItem('cart', JSON.stringify(updatedCartItems));

    const steamId = localStorage.getItem('steam_id');
    const response = await CartService.removeItem(id);

    if (!response.success) {
      console.error('Failed to remove item from database:', response.message);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <div className="flex w-full mx-auto justify-center">
          <div className="grid grid-cols-2 gap-6">
            {cartItems.map(item => (
                <CartItem key={item.id} item={item} onRemove={handleRemove}/>
            ))}
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <div className={'flex-1'}>
            <Link to={'/checkout'} onClick={() => {}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              {/*TODO: Enregister les data du panier en tant que commandes */}
                Allez sur la page de paiement
            </Link>
          </div>
          <div className="text-2xl font-bold">Total : {totalPrice} $</div>
        </div>
      </main>
    </div>
  );
};

export default Panier;