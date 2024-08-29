import {PaymentElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {useState} from "react";
import {toast} from "react-toastify";
import config from "../config/index.js";



const CheckoutForm = ({ clientSecret, order }) => {
        const stripe = useStripe();
        const elements = useElements();

        const [errorMessage, setErrorMessage] = useState();
        const [loading, setLoading] = useState(false);

        const handleError = (error) => {
                setLoading(false);
                toast.error(error.message);
        }

        const handleSubmit = async (event) => {
                event.preventDefault();

                if (!stripe) {
                        // Stripe.js hasn't yet loaded.
                        // Make sure to disable form submission until Stripe.js has loaded.
                        return;
                }

                setLoading(true);

                const {error: submitError} = await elements.submit();
                if (submitError) {
                        handleError(submitError);
                        return;
                }

                // Confirm the PaymentIntent using the details collected by the Payment Element
                const {error} = await stripe.confirmPayment({
                        elements,
                        clientSecret,
                        confirmParams: {
                                return_url: `${config.frontendUrl}/order/${order.order.id}/success`,
                        },
                });

                if (error) {
                        handleError(error);
                } else {
                        // stripe will redirect automatically to the return_url
                }
        };


        if(order?.order?.id) {
                return (
                    <form onSubmit={handleSubmit}>
                            <PaymentElement />
                            <button className={'bg-yellow-400 hover:bg-orange-400 text-white font-bold py-2 w-full rounded my-3'}>Submit</button>
                    </form>
                );
        } else {
                return null;
        }
};

export default CheckoutForm;