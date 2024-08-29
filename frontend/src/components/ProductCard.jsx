import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const ProductCard = ({ product }) => {
    const { name, price, skin, created_at, id } = product;
    const imageUrl = skin?.image || 'default-image.png';
    const statTrak = product.stattrak ? 'STATTRAK™' : '';
    const weaponsName = JSON.parse(skin?.weapons || '{}').name || 'Nom de l\'arme non disponible';
    const patternName = JSON.parse(skin?.pattern || '{}').name || 'Nom du motif non disponible';
    const formattedDate = new Date(created_at).toLocaleDateString();
    const minFloat = parseFloat(skin.min_float);
    const maxFloat = parseFloat(skin.max_float);
    const usage = parseFloat(product.usage);
    const usurePercentage = (usage >= minFloat && usage <= maxFloat)
        ? ((usage - minFloat) / (maxFloat - minFloat)) * 100
        : 0;

    const [isInCart, setIsInCart] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockedUntil, setBlockedUntil] = useState(null);
    const user = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null;

    const checkProductInCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productInCart = cart.some(item => parseInt(item.id) === parseInt(product.id) && parseInt(item.user_id) === parseInt(user.sub));
        setIsInCart(productInCart);
    };

    const checkProductAvailability = () => {
        const blockedAt = dayjs(product.blocked_at);
        const unblockedAt = dayjs(product.blocked_at).add(15, 'minutes');

        if (blockedAt.isBefore(dayjs()) && unblockedAt.isAfter(dayjs())) {
            setIsBlocked(true);
            setBlockedUntil(unblockedAt);
        }

        if (blockedAt.isBefore(dayjs()) && unblockedAt.isBefore(dayjs())) {
            setIsBlocked(false);
            setBlockedUntil(null);
        }
    };

    useEffect(() => {
        return () => {
            checkProductInCart();
            checkProductAvailability();
        };
    }, []);


    const getWearCategory = (usurePercentage) => {
        if (usurePercentage >= 0 && usurePercentage < 7) return { category: 'Neuve', color: 'bg-green-500' };
        if (usurePercentage >= 7 && usurePercentage < 15) return { category: 'Très peu usée', color: 'bg-yellow-500' };
        if (usurePercentage >= 15 && usurePercentage < 38) return { category: 'Testée sur le terrain', color: 'bg-orange-500' };
        if (usurePercentage >= 38 && usurePercentage < 45) return { category: 'Usée', color: 'bg-red-500' };
        if (usurePercentage >= 45 && usurePercentage <= 100) return { category: 'Marquée par les combats', color: 'bg-red-900' };
        return { category: 'Inconnu', color: 'bg-gray-500' };
    };

    const { category, color } = getWearCategory(usurePercentage);

    return (
        <Link to={`/product/${id}`}
              className="mt-4 border flex w-full max-w-4xl items-center rounded-lg overflow-hidden shadow-xl bg-white">
            <div className="w-1/4 p-4">
                <img className="w-full" src={imageUrl} alt={name} />
            </div>
            <div className="w-3/4 px-6 py-4 flex flex-col justify-between">
                <div>
                    {statTrak && (
                        <div className="font-bold text-orange-500 text-lg mb-2">{statTrak}</div>
                    )}
                    <div className="font-bold text-xl mb-2">{name}</div>
                    <div className="text-sm text-gray-700">{weaponsName}</div>
                    <div className="text-sm text-gray-500">{patternName}</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center mb-2">
                        <span className={`inline-block rounded-full w-3 h-3 mr-2 ${color}`}></span>
                        <span className="text-sm font-semibold text-gray-700">{category}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{usage}%</span>
                </div>
                <div className="flex justify-between items-center mt-2 border-t pt-2">
                    <span className="text-sm text-gray-500">Mis en vente le {formattedDate}</span>
                    <span className="text-lg font-semibold text-gray-900">{price} $</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <AddToCartButton product={product}
                                     isInCart={isInCart}
                                     isBlocked={isBlocked}
                                     blockedUntil={blockedUntil}
                                     setIsBlocked={setIsBlocked}
                                     setIsInCart={setIsInCart}
                                     setBlockedUntil={setBlockedUntil}
                                     user={user}
                    />
                </div>
                <div className="relative w-full mt-4">
                    <div className="absolute left-2 transform -translate-x-full text-sm text-gray-700">
                        {skin.min_float}
                    </div>
                    <div className="absolute right-2 transform translate-x-full text-sm text-gray-700">
                        {skin.max_float}
                    </div>
                    <div className="relative bg-gray-200 rounded-full h-2.5 mx-6">
                        <div
                            className="h-2.5 rounded-full"
                            style={{
                                background: 'linear-gradient(to right, #4CAF50 0%, #FFEB3B 25%, #FF9800 50%, #FF5722 75%, #F44336 100%)',
                                width: '100%',
                                margin: '0 auto',
                            }}
                        >
                        </div>
                        <div
                            className="absolute top-[-16px] transform translate-x-[-20%]"
                            style={{
                                left: `${usurePercentage}%`,
                            }}
                        >
                            <span className="text-sm font-semibold text-gray-700">{usage}%</span>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 -3 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-700 z-0"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 0L6 10H18L12 0Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
