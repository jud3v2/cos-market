import React, { useState, useEffect } from 'react';
import CartService from '../services/cartService';
import { toast } from "react-toastify";
import axios from 'axios';
import config from "../config/index.js";
import {jwtDecode} from "jwt-decode";

const AddToCartButton = ({ product, buttonClassName }) => {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    const checkProductInCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const productInCart = cart.some(item => item.id === product.id);
      setIsInCart(productInCart);
    };

    checkProductInCart();
  }, [product.id]);

  // Fonction pour ajouter le produit au panier
  const handleAddToCart = async (e) => {
    e.preventDefault();
    const user = jwtDecode(localStorage.getItem('token'));
    const response = axios.get(config.backendUrl + '/product/check-available/' + product.id)
        .then(async (response) => {
                const data = response.data;
                if(data.isBlocked) {
                        toast.info('Le produit [' + product.name + '] est bloqué pour ' + data.availability)
                        return false;
                } else {
                        if (CartService.addProduct(product)) {
                                toast('Produit ajouté au panier', {
                                        type: 'success',
                                });
                                // Sauvegarder le panier dans la base de données
                                const response = await CartService.saveCartToDB(product.id);

                                if (response.success) {
                                        const blockProductPromise = axios.put(config.backendUrl + '/product/block/' + product.id, {
                                                user_id: parseInt(user.sub),
                                                product: product.id
                                        }, {
                                                headers: {
                                                        Authorization: 'Bearer ' + localStorage.getItem('token')
                                                }
                                        });
                                        await toast.promise(blockProductPromise, {
                                                pending: 'Mise à jour de la disponibilité du produit...',
                                                success: 'Produit bloqué pendant 15 minute',
                                                error: 'Erreur lors de la mise à jour de la disponibilité du produit'
                                        });
                                } else {
                                        console.info('Erreur lors de la sauvegarde du panier : ' + response.message);
                                }
                        } else {
                                toast('Le produit [' + product.name + '] est déjà dans votre panier', {
                                        type: 'error',
                                });
                        }
                }
                return response.data;
        })
        .catch((error) => {
                console.error('Erreur lors de la récupération du produit : ' + error);
                return null;
        })

    await toast.promise(response, {
            pending: 'Vérification de la disponibilité du produit...',
            success: 'Produit disponible',
            error: 'Produit indisponible'
    })
};

  // Classe par défaut du bouton
  const buttonClass = buttonClassName || "bg-blue-500 text-white px-4 py-2 rounded";

  return (
    <button
      onClick={handleAddToCart}
      className={buttonClass}
      disabled={isInCart}
    >
      {isInCart ? 'Produit déjà dans le panier' : 'Ajouter au panier'}
    </button>
  );
};

export default AddToCartButton;
