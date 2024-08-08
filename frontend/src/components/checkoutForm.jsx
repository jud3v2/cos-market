import {PaymentElement} from '@stripe/react-stripe-js';

const CheckoutForm = () => {
        return (
            <form>
                    <PaymentElement />
                    <button className={'bg-yellow-400 hover:bg-orange-400 text-white font-bold py-2 px-52 rounded my-3'}>Submit</button>
            </form>
        );
};

export default CheckoutForm;