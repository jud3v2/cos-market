import { getSteamId } from '../utils/getSteamId';

class CartService {
  constructor() {
    this.cartKey = 'cart';
  }

  getCart() {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cart) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  addProduct(product) {
    const cart = this.getCart();
    const existingProduct = cart.find(p => p.id === product.id);
    if (!existingProduct) {
      cart.push(product);
      this.saveCart(cart);
      return true;
    }
    return false;
  }

  removeProduct(productId) {
    let cart = this.getCart();
    const initialLength = cart.length;
    cart = cart.filter(p => p.id !== productId);
    this.saveCart(cart);
    return cart.length < initialLength;
  }

  emptyCart() {
    this.saveCart([]);
  }

  getTotalPrice() {
    const cart = this.getCart();
    return cart.reduce((total, product) => total + product.price, 0);
  }

  async saveCartToDB(productId) {
    const steamId = getSteamId();
    console.log('Données envoyées à l\'API:', { steam_id: steamId, productId });
    const response = await fetch(`http://localhost:8000/api/cart/0`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ steam_id: steamId, product_id: productId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  }

  async removeItem(produitId) {
    const response = await fetch(`http://localhost:8000/api/cart-remove?product_id=${produitId}&steam_id=${getSteamId()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from database');
    }

    return response.json();
  }
}

export default new CartService();