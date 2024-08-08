import React, { useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import CartService from "../services/cartService";
import Footer from "../components/Footer";
import "../index.css";
import { Link } from "react-router-dom";

const Panier = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchedCartItems = CartService.getCart();
    setCartItems(fetchedCartItems);
  }, []);

  const handleRemove = async (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);

    localStorage.setItem("cart", JSON.stringify(updatedCartItems));

    const steamId = localStorage.getItem("steam_id");
    const response = await CartService.removeItem(id);

    if (!response.success) {
      console.error("Failed to remove item from database:", response.message);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  const bulletCoinReduction = 0;
  const tax = totalPrice * 0.2;
  const finalTotal = totalPrice - bulletCoinReduction + tax;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <div className="flex justify-between">
          <div className="w-1/2">
            <div className="grid grid-cols-1 gap-6 max-w-3xl">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          </div>

          <div className="w-1/2 flex flex-col items-center">
            <div className="sticky top-4 bg-white p-10 rounded-lg shadow-md w-3/4 flex flex-col items-center">
              <div className="text-2xl font-bold mb-4">
                PANIER = {totalPrice.toFixed(2)}$
              </div>
              <div className="text-2xl font-bold mb-4">
                BULLET COIN REDUCTION = {bulletCoinReduction.toFixed(2)}$
              </div>
              <div className="text-2xl font-bold mb-4">TVA = +20%</div>
              <div className="text-2xl font-bold mt-4">
                TOTAL = {finalTotal.toFixed(2)}$
              </div>
              <Link
                to={"/checkout"}
                onClick={() => {}}
                className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex justify-center "
              >
                ALLER SUR LA PAGE DE PAIEMENT
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Panier;
