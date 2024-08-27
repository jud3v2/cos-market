import React, {useEffect} from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../config/index.js";
import {toast} from "react-toastify";
import CartService from "../services/cartService.js";

export default function PaymentSuccess() {
        const { id} = useParams();
        const getParams = new URLSearchParams(window.location.search);

        const params = {
                id,
                payment_intent: getParams.get('payment_intent'),
                payment_intent_client_secret: getParams.get('payment_intent_client_secret'),
                redirect_status: getParams.get('redirect_status'),
        }

        const url = `${config.backendUrl}/payment/success/${id}/success`;

        useEffect(() => {
                const toastId = toast.loading('Vérification de votre paiement...');
                axios.post(url, params)
                        .then(response => {
                                const data = response.data
                                if(data.success) {
                                        toast.success(data.message);
                                        toast.dismiss(toastId);
                                        setTimeout(() => {
                                                window.location = `/profil`;
                                        }, 1500);
                                        CartService.emptyCart();
                                }
                        })
                        .catch(error => {
                                console.log(error);
                                toast.error('Une erreur est survenue lors de la vérification de votre paiement');
                        });
        }, [])

        return (
                <div>
                        <h1>Payment Success</h1>
                </div>
        );
}