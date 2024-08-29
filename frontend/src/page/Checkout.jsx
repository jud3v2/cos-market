import React, {useEffect, useState} from 'react';
import CartItem from '../components/CartItem';
import CartService from '../services/cartService';
import {jwtDecode} from 'jwt-decode';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import config from '../config';
import CheckoutForm from '../components/checkoutForm';
import axios from 'axios';
import Loading from '../components/Loading';
import '../checkout.css';
import {toast} from "react-toastify";

export default function Checkout() {
        const [cart, setCart] = useState(() => {
                const cart = localStorage.getItem('cart');
                return cart ? JSON.parse(cart) : [];
        });
        const [addresses, setAddresses] = useState([]); // [...billingAddress]
        const [isAddressesLoading, setIsAddressesLoading] = useState(true);
        const [selectedAdresse, setSelectedAdresse] = useState(null); // [...billingAddress
        const [loading, setLoading] = useState(false);
        const [clientSecret, setClientSecret] = useState('');
        const [showBillingAddress, setShowBillingAddress] = useState(false);
        const [order, setOrder] = useState({});
        const totalPrice = cart.reduce((total, item) => total + item.price, 0);
        const bulletCoinReduction = 0;
        const tax = totalPrice * 0.2;
        const finalTotal = totalPrice - bulletCoinReduction + tax;

        const fetchClientSecret = async () => {
                try {
                        const response = await axios.post('/payment/create-client-secret', {amount: totalPrice});
                        setClientSecret(response.data.client_secret);
                } catch (error) {
                        console.error('Error fetching client secret:', error);
                }
        };

        const fetchAddresses = async () => {
                await axios.get(`${config.backendUrl}/address-book`)
                    .then((response) => {
                            setAddresses(response.data);

                            addresses.map(address => {
                                    if (address.isDefault === 1) {
                                            setSelectedAdresse(address);
                                    }
                            })
                    })
                    .catch((error) => {
                            console.error('Failed to fetch addresses:', error);
                    })
                    .finally(() => {
                            setIsAddressesLoading(false);
                    })
        }

        useEffect(() => {
                (async () => {
                        await fetchAddresses();
                })()
        }, [])

        const saveOrder = async () => {
                let user = localStorage.getItem("token");
                user = jwtDecode(user);
                const defaultAddressId = addresses.filter(address => address.isDefault === 1)[0].id;
                console.log(defaultAddressId, selectedAdresse.id);
                const response = await axios.post(`${config.backendUrl}/order`, {
                        user_id: user.sub,
                        address_id: selectedAdresse.id || defaultAddressId,
                })
                    .then((response) => response.data)
                    .catch((error) => {
                            console.error('Failed to save order:', error);
                            toast("Server Response: " + error.response.data.error, {
                                    type: "error",
                            });
                    })

                if (response.error) {
                        toast(response.error, {
                                type: "error",
                        });
                } else if (response.success && response.hasOwnProperty('products')) {
                        //TODO: Réactiver la suppression du panier uniquement lorsque le paiement à été validé.
                        /*toast.info("Votre pannier a été vidé", {
                                type: "info",
                        })
                        localStorage.removeItem('cart');*/

                        setCart(response.products);
                        setOrder(response);
                        console.log(response)
                        toast.info("Votre commande a été sauvegardée", {});
                }

        }

        useEffect(() => {
                fetchClientSecret();

                if(selectedAdresse) {
                        (async () => {
                                await toast.promise(saveOrder(), {
                                        pending: 'Sauvegarde de votre commande en cours...',
                                })
                        })()
                }
        }, [selectedAdresse]);

        const stripePromise = loadStripe(config.stripePublicKey);

        const options = {
                clientSecret: clientSecret,
        };

        const handleRemove = async (id) => {
                const updatedCartItems = cart.filter(item => item.id !== id);
                setCart(updatedCartItems);
                localStorage.setItem('cart', JSON.stringify(updatedCartItems));

                const response = await CartService.removeItem(id);
                if (!response.success) {
                        console.error('Failed to remove item from database:', response.message);
                }
        };

        if (loading) {
                return <Loading message="Chargement de votre panier"/>;
        }

        console.log(selectedAdresse)

        return (
            <div className="checkout-container flex flex-col min-h-screen ">
                    <main className="flex-grow bg-gray-100 p-6">
                            <h1 className="text-3xl font-bold mb-4">Checkout</h1>

                            <div className="flex flex-col lg:flex-row justify-between lg:h-full lg:z-10">
                                    <div className="cart-section w-full lg:w-1/2">
                                            <div className="grid grid-cols-1 gap-6">
                                                    {cart.map(item => (
                                                        <CartItem key={item.id} item={item} onRemove={handleRemove}/>
                                                    ))}
                                            </div>
                                    </div>

                                    <div className="summary-section w-full lg:w-1/3 mx-auto lg:mt-4 ">
                                            <div className="sticky-container">
                                                    <div className="bg-white p-10 rounded-lg shadow-md mb-6">
                                                            <div className="text-2xl font-bold mb-4">PANIER
                                                                    = {totalPrice.toFixed(2)}$
                                                            </div>
                                                            <div className="text-2xl font-bold mb-4">BULLET COIN
                                                                    REDUCTION = {bulletCoinReduction.toFixed(2)}$
                                                            </div>
                                                            <div className="text-2xl font-bold mb-4">TVA = +20%</div>
                                                            <div className="text-2xl font-bold mt-4">TOTAL
                                                                    = {finalTotal.toFixed(2)}$
                                                            </div>
                                                    </div>

                                                    <div
                                                        className="bg-white p-10 rounded-lg shadow-md sticky-container ">
                                                            <h2
                                                                className="text-2xl font-bold mb-4 cursor-pointer"
                                                                onClick={() => setShowBillingAddress(!showBillingAddress)}
                                                            >
                                                                    Choisissez une adresse de
                                                                    facturation {showBillingAddress ? '▲' : '▼'}
                                                            </h2>

                                                            {showBillingAddress && (
                                                                <div className="grid grid-cols-1 gap-6">
                                                                        {addresses?.map((address, index) => {
                                                                                return (
                                                                                    <div key={index}>
                                                                                            <p className={'text-yellow-500'}>{selectedAdresse?.id === address.id ? 'Adresse Sélectionnée' : ''}</p>
                                                                                            <div
                                                                                                className={`bg-gray-100 p-4 rounded-lg cursor-pointer ${selectedAdresse?.id === address?.id ? 'border-2 border-yellow-400' : ''}`}
                                                                                                onClick={() => setSelectedAdresse(address)}>
                                                                                                    <div
                                                                                                        className="text-lg font-bold">
                                                                                                            {address.name} {address.isDefault === 1 ? '(        Default)' : ''}
                                                                                                    </div>
                                                                                                    <div>{address.address}</div>
                                                                                                    <div>{address.zipcode} {address.city}</div>
                                                                                                    <div>{address.country}</div>
                                                                                                    <div>{address.phone}</div>
                                                                                            </div>
                                                                                    </div>
                                                                                )
                                                                        })}

                                                                        {isAddressesLoading && (
                                                                            <div className="text-center">
                                                                                    <p>Chargement de vos adresses en
                                                                                            cours</p>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            )}
                                                    </div>
                                            </div>
                                    </div>
                            </div>

                            <div className="stripe-form-wrapper mt-6 lg:w-1/2 lg:z-50">
                                    {selectedAdresse === null && (
                                        <div className="text-center">
                                                <p className="text-red-500">Afin de poursuivre la procédure de paiement il vous faut choisir une adresse de facturation.</p>
                                        </div>
                                    )}
                                    {clientSecret && (
                                        <Elements stripe={stripePromise} options={options}>
                                                <CheckoutForm clientSecret={clientSecret} order={order}/>
                                        </Elements>
                                    )}
                            </div>
                    </main>
            </div>
        );
}
