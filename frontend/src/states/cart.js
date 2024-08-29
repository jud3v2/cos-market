import { atom, selector } from 'recoil';

export const cartState = atom({
    key: 'cart',
    default: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
});

export const cartCountState = selector({
    key: 'cartCount',
    get: ({ get }) => {
        const cart = get(cartState);
        return cart.length;
    },
});