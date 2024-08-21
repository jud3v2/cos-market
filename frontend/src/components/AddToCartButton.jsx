import React, { useState, useEffect } from 'react';
import CartService from '../services/cartService';
import { toast } from "react-toastify";
import axios from 'axios';
import config from "../config/index.js";
import {jwtDecode} from "jwt-decode";

const AddToCartButton = ({ product }) => {
  const [isInCart, setIsInCart] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

    const checkProductInCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const productInCart = cart.some(item => item.id === product.id && item.user_id === user.sub);
      setIsInCart(productInCart);
    };

    const checkProductAvailability = async () => {
      try {
        const response = await axios.get(config.backendUrl + `/product/check-available/${product.id}`);
        const data = response.data;

        if (data.isBlocked) {
          setIsBlocked(true);
          setBlockedUntil(data.availability);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la disponibilité du produit :", error);
      }
    };

    if(user !== null && user.hasOwnProperty('sub')) {
      setUserId(parseInt(user.sub));
      checkProductInCart();
      checkProductAvailability();
    }
  }, [product.id]);

  // Fonction pour ajouter le produit au panier
  const handleAddToCart = async (e) => {
    e.preventDefault();

    try {
      // Vérification de la disponibilité du produit
      const response = await axios.get(config.backendUrl + '/product/check-available/' + product.id);
      const data = response.data;

      if (data.isBlocked) {
        toast.info(`Le produit [${product.name}] est bloqué pour ${data.availability}`);
        setIsBlocked(true);
        setBlockedUntil(data.availability);
        return;
      }

      // Ajouter le produit au panier localement
      if (CartService.addProduct(product)) {
        setIsInCart(true);
        toast.success('Produit ajouté au panier');

        // Sauvegarder le panier dans la base de données
        const saveResponse = await CartService.saveCartToDB(product.id);

        if (saveResponse.success) {
          const blockProductPromise = axios.put(
            `${config.backendUrl}/product/block/${product.id}`,
            { user_id: userId, product: product.id },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
          );

          await toast.promise(blockProductPromise, {
            pending: 'Mise à jour de la disponibilité du produit...',
            success: 'Produit bloqué pendant 15 minutes',
            error: 'Erreur lors de la mise à jour de la disponibilité du produit'
          });

          setIsBlocked(true);
          setBlockedUntil('15 minutes');
        } else {
          console.error('Erreur lors de la sauvegarde du panier :', saveResponse.message);
        }
      } else {
        toast.error(`Le produit [${product.name}] est déjà dans votre panier`);
        setIsInCart(true);
      }

    } catch (error) {
      console.error('Erreur lors de la récupération du produit :', error);
      toast.error('Erreur lors de la vérification de la disponibilité du produit');
    }
  };

  // Déterminer la classe CSS et le texte du bouton en fonction de l'état
  let buttonClass = "text-white px-4 py-2 rounded "; // Classe de base

  let buttonText = '';
  if (isBlocked && !isInCart) {
    buttonClass += "bg-red-500"; // Rouge si le produit est bloqué mais pas dans le panier
    buttonText = `Produit bloqué pendant ${blockedUntil}`;
  } else if (isBlocked && isInCart) {
    buttonClass += "bg-gray-500"; // Gris si le produit est bloqué et déjà dans le panier
    buttonText = 'Produit déjà dans votre panier';
  } else if (!isBlocked && !isInCart) {
    buttonClass += "bg-blue-500"; // Bleu si le produit est disponible et non dans le panier
    buttonText = 'Ajouter au panier';
  } else if (!isBlocked && isInCart) {
    buttonClass += "bg-gray-500"; // Gris si le produit est déjà dans le panier
    buttonText = 'Produit déjà dans le panier';
  }

  return (
    <button
      onClick={handleAddToCart}
      className={buttonClass}
      disabled={isInCart || isBlocked}
    >
      {buttonText}
    </button>
  );
};

export default AddToCartButton;
