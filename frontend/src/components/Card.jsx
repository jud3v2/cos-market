import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ product }) => {
  const { id, name, price, skin } = product;
  const imageUrl = skin?.image || 'default-image.png';
  const rarity = skin?.rarity?.name || 'Rareté non disponible';
  const wear = JSON.parse(skin?.wears || '[]')[0]?.name || 'Usure non spécifiée';
  const statTrak = product.stattrak ? 'STATTRAK™' : '';
  const isNew = product.stock > 0 ? 'NEUVE' : 'UTILISÉE';
  const weaponsName = JSON.parse(skin?.weapons || '{}').name || 'Nom de l\'arme non disponible';
  const patternName = JSON.parse(skin?.pattern || '{}').name || 'Nom du motif non disponible';

  return (
    <Link to={`/product/${id}`} className="block max-w-xs rounded-lg overflow-hidden shadow-xl m-4 bg-white">
      <div className="px-4 py-2">
        <img className="w-full p-2" src={imageUrl} alt={name} />
      </div>
      <div className="px-6 py-4">
        {statTrak && <div className="font-bold text-orange-500 text-lg mb-2">{statTrak}</div>}
        <div className="font-bold text-xl ">{weaponsName}</div>
        <div className="text-md text-gray-500">{patternName}</div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center mb-2">
          <span className="inline-block bg-green-500 rounded-full w-3 h-3 mr-2"></span>
          <span className="text-sm font-semibold text-gray-700">{isNew}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">{wear}</span>
          <span className="text-sm font-semibold text-gray-700">{(skin.min_float * 100).toFixed(2)}%</span>
        </div>
        <div className="flex justify-end items-center mt-2 border-t pt-2">
          <span className="text-lg font-semibold text-gray-900">{price} $</span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
