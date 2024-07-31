import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartItem from '../components/CartItem';
import '../index.css';

const Panier = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'AWP | Dragon Lore Factory new',
      price: 10000,
      skin: {
        image: 'https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/default_generated/weapon_awp_cu_medieval_dragon_awp_light_png.png'
      },
    },
  ]);

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <div className="grid grid-cols-1 gap-6">
          {cartItems.map(item => (
            <CartItem key={item.id} item={item} onRemove={handleRemove} />
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <div className="text-2xl font-bold">Total : {totalPrice} $</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Panier;
