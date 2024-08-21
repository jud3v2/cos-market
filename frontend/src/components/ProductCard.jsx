import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {
  const { name, price, skin, created_at, id } = product;
  const imageUrl = skin?.image || 'default-image.png';
  const rarity = skin?.rarity?.name || 'Rareté non disponible';
  const statTrak = product.stattrak ? 'STATTRAK™' : '';
  const isNew = product.stock > 0 ? 'NEUVE' : 'UTILISÉE';
  const weaponsName = JSON.parse(skin?.weapons || '{}').name || 'Nom de l\'arme non disponible';
  const patternName = JSON.parse(skin?.pattern || '{}').name || 'Nom du motif non disponible';
  const formattedDate = new Date(created_at).toLocaleDateString();
  const minFloat = parseFloat(skin.min_float);
  const maxFloat = parseFloat(skin.max_float);
  const usage = parseFloat(product.usage);
  const usurePercentage = (usage >= minFloat && usage <= maxFloat)
    ? ((usage - minFloat) / (maxFloat - minFloat)) * 100
    : 0;

  return (
    <Link to={`/product/${id}`} className="mt-4 border flex w-full max-w-4xl items-center rounded-lg overflow-hidden shadow-xl bg-white">
      <div className="w-1/4 p-4">
        <img className="w-full" src={imageUrl} alt={name} />
      </div>
      <div className="w-3/4 px-6 py-4 flex flex-col justify-between">
        <div>
          {statTrak && <div className="font-bold text-orange-500 text-lg mb-2">{statTrak}</div>}
          <div className="font-bold text-xl mb-2">{name}</div>
          <div className="text-sm text-gray-700">{weaponsName}</div>
          <div className="text-sm text-gray-500">{patternName}</div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-2">
            <span className="inline-block bg-green-500 rounded-full w-3 h-3 mr-2"></span>
            <span className="text-sm font-semibold text-gray-700">{isNew}</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">{usage}%</span>
        </div>
        <div className="flex justify-between items-center mt-2 border-t pt-2">
          <span className="text-sm text-gray-500">Mis en vente le {formattedDate}</span>
          <span className="text-lg font-semibold text-gray-900">{price} $</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <AddToCartButton product={product} />
        </div>
        <div className="relative w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <span className="absolute left-0 text-sm text-gray-700">{skin.min_float}</span>
          <span className="absolute right-0 text-sm text-gray-700">{skin.max_float}</span>
          <div
            className="h-2.5 rounded-full"
            style={{
              background: 'linear-gradient(to right, #4CAF50 0%, #FFEB3B 25%, #FF9800 50%, #FF5722 75%, #F44336 100%)',
              width: '100%',
            }}
          ></div>
          <div
            className="absolute top-[-16px] left-0 transform translate-x-[-50%] "
            style={{
              left: `${usurePercentage}%`,
            }}
          >
            <span className="text-sm font-semibold text-gray-700">{usage}%</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
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
    </Link>
  );
};

export default ProductCard;
