import React, { useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import CartService from "../services/cartService";
import "../index.css";
import { Link } from "react-router-dom";
import config from "../config/index.js";
import axios from "axios";
import {toast} from "react-toastify";

const Panier = () => {
  const [cartItems, setCartItems] = useState([]);
  const [bulletCoins, setBulletCoins] = useState(0);
  const [bulletCoinData, setBulletCoinData] = useState([]); // [bulletCoinValue, bulletCoinReduction, finalTotal]
  const bulletCoinValue = 0.0001; // Valeur de réduction par bullet coin (0,01%)

  const fetchBulletCoinData = async () => {
     await axios.get(`${config.backendUrl}/bulletcoin`)
         .then(response => {
              setBulletCoinData(response.data);
         })
         .catch(error => (
             console.error(error)
         ))
         .finally(() => {

         });
  }

  useEffect(() => {
    const fetchedCartItems = CartService.getCart();
    setCartItems(fetchedCartItems);

    (async () => {
      await fetchBulletCoinData();
    }) ()
  }, []);

  const handleRemove = async (id) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCartItems);

    localStorage.setItem("cart", JSON.stringify(updatedCartItems));

    const response = await CartService.removeItem(id);

    if (!response.success) {
      console.error("Failed to remove item from database:", response.message);
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  const tax = totalPrice * 0.2;
  const priceWithTax = totalPrice + tax;
// Calcul de la réduction totale due aux bullet coins
  const bulletCoinReduction = priceWithTax * (bulletCoinValue * bulletCoins);

// Calcul du prix final après application de la réduction des bullet coins
  const finalTotal = priceWithTax - bulletCoinReduction;

  const incrementBulletCoins = () => {
    if(bulletCoins >= bulletCoinData?.amount) {
      toast.error("Vous ne pouvez pas avoir plus de bullet coins que ceux disponibles: " + bulletCoinData?.amount)
      return
    }
    setBulletCoins(bulletCoins + 1);
  };

  const decrementBulletCoins = () => {
    if (bulletCoins > 0) {
      setBulletCoins(bulletCoins - 1);
    } else if(bulletCoins === 0) {
      toast.error("Vous ne pouvez pas avoir moins de 0 bullet coins.")
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">Panier</h1>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-1 gap-6 max-w-3xl">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center mt-6 lg:mt-0">
            <div className="sticky top-4 bg-white p-10 rounded-lg shadow-md w-full lg:w-3/4 flex flex-col items-center">
              <div className="text-2xl font-bold mb-4">
                Sous-total (sans TVA) = {totalPrice.toFixed(2)}$
              </div>

              <div className="text-2xl font-bold mb-4">
                Prix avec TVA (20%) = {priceWithTax.toFixed(2)}$
              </div>

              <div className="text-2xl font-bold mb-4">BULLET COINS Disponible</div>
                <div className="text-2xl font-bold mb-4">
                    {bulletCoinData?.amount} Bullet Coins
                </div>
              <div className="flex items-center mb-4">
                <button
                  onClick={decrementBulletCoins}
                  className="bg-red-500 text-white px-3 py-1 rounded-l"
                >
                  -
                </button>
                <input className="px-4 py-2 text-lg" value={bulletCoins} onChange={e => setBulletCoins(parseInt(e.target.value))}/>
                <button
                  onClick={incrementBulletCoins}
                  className="bg-green-500 text-white px-3 py-1 rounded-r"
                >
                  +
                </button>
              </div>
              <div className="text-xl font-bold mb-4">
                Réduction avec Bullet Coins = -
                {bulletCoinReduction.toFixed(2)}$
              </div>

              <div className="text-2xl font-bold mt-4">
                TOTAL À PAYER = {finalTotal.toFixed(2)}$
              </div>
              <p className={"text-sm"}>
                <small>
                  Bonjour en cliquant sur le bouton ci-dessous cela impliquera
                  que les produits disponibles dans votre commande vous seront
                  bloqués pendant 15 minutes, de plus cela impliquera la
                  conversion de votre panier en commande.
                </small>
              </p>
              <Link
                to={"/checkout?bulletCoins=" + bulletCoins + "&bulletCoinReduction=" + bulletCoinReduction + "&finalTotal=" + finalTotal}
                className="text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 flex justify-center ">
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