import React, {useEffect, useState} from 'react';
import CartItem from "../components/CartItem.jsx";
import CartService from "../services/cartService.js";
import {jwtDecode} from "jwt-decode";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import config from '../config';
import CheckoutForm from "../components/checkoutForm.jsx";
import axios from 'axios';
import Loading from "../components/Loading.jsx";

export default function Checkout() {
        const [cart, setCart] = useState(() => {
                const cart = localStorage.getItem('cart');
                return cart ? JSON.parse(cart) : [];
        });

        const [loading, setLoading] = useState(false);

        const [clientSecret, setClientSecret] = useState('');

        const totalPrice = cart.reduce((total, item) => total + item.price, 0);

        const m = async () => {
                const d = await axios.post('/payment/create-client-secret', {
                        amount: totalPrice,
                })
                    .then(res => res.data)
                    .then(data => data)
                    .catch(console.error);

                setClientSecret(d.client_secret);
        }

        useEffect(() => {
                (async () => {
                     await m();
                })()
        }, [])

        const [user, setUser] = useState(() => {
                const token = localStorage.getItem('token');
                return token ? jwtDecode(token) : null;
        })

        const stripePromise = loadStripe(config.stripePublicKey);

        stripePromise.then((res) => {
                console.log(res)
        });

        const options = {
                // passing the client secret obtained from the server
                clientSecret: clientSecret,
        };

        const handleRemove = async (id) => {
                const updatedCartItems = cart.filter(item => item.id !== id);
                setCart(updatedCartItems);

                localStorage.setItem('cart', JSON.stringify(updatedCartItems));

                if (localStorage.getItem('token') === null) {
                        window.location.href = '/steam/login';
                }


                const response = await CartService.removeItem(id);

                if (!response.success) {
                        console.error('Failed to remove item from database:', response.message);
                }
        };

        if(loading) {
                return <Loading message={"Chargement de votre panier"} />
        }

        return (
            <div className="flex flex-col min-h-screen">
                    <main className="flex-grow bg-gray-100 p-6">
                            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
                            <div className="flex w-full mx-auto justify-center">
                                    <div className="grid grid-cols-2 gap-6">
                                            {cart.map(item => (
                                                <CartItem key={item.id} item={item} onRemove={handleRemove}/>
                                            ))}
                                    </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                    <div></div>
                                    <div className="text-2xl font-bold">Total : {totalPrice} $</div>
                            </div>
                            <div>
                                    {clientSecret.length > 0 && (
                                        <Elements stripe={stripePromise} options={options}>
                                                <CheckoutForm/>
                                        </Elements>
                                    )}
                            </div>
                    </main>
            </div>
        )
}