import React from 'react';

const ProductCard = ({ product }) => {
  const { name, price, skin, created_at } = product;
  const imageUrl = skin?.image || 'default-image.png';
  const rarity = skin?.rarity?.name || 'Rareté non disponible';
  const wear = JSON.parse(skin?.wears || '[]')[0]?.name || 'Usure non spécifiée';
  const statTrak = product.stattrak ? 'STATTRAK™' : '';
  const isNew = product.stock > 0 ? 'NEUVE' : 'UTILISÉE';
  const weaponsName = JSON.parse(skin?.weapons || '{}').name || 'Nom de l\'arme non disponible';
  const patternName = JSON.parse(skin?.pattern || '{}').name || 'Nom du motif non disponible';
  const formattedDate = new Date(created_at).toLocaleDateString();

  return (
      <div className="mt-4 border flex w-full max-w-4xl items-center rounded-lg overflow-hidden shadow-xl  bg-white">
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
            <span className="text-sm font-semibold text-gray-700">{wear}</span>
            <span className="text-sm font-semibold text-gray-700">{(skin.min_float * 100).toFixed(2)}%</span>
          </div>
          <div className="flex justify-between items-center mt-2 border-t pt-2">
            <span className="text-sm text-gray-500">Mis en vente le {formattedDate}</span>
            <span className="text-lg font-semibold text-gray-900">{price} $</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(skin.min_float * 100).toFixed(2)}%` }}></div>
          </div>
        </div>
      </div>
  );
};

export default ProductCard;