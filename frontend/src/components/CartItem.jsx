import React from 'react';
import {Link} from "react-router-dom";

const CartItem = ({ item, onRemove }) => {
  const { name, price, skin, quantity } = item;
  const imageUrl = skin?.image || 'default-image.png';

  return (
    <div className="border flex w-full max-w-4xl items-center rounded-lg overflow-hidden shadow-xl m-4 bg-white">
      <Link to={`/product/${item.id}`} className="w-1/4 p-4 cursor-pointer" >
        <img className="w-full" src={imageUrl} alt={name} />
      </Link>
      <div className="w-3/4 px-6 py-4 flex flex-col justify-between">
        <div>
          <div className="font-bold text-xl mb-2">{name}</div>
          
        </div>
        <div className="flex justify-between items-center mt-2 border-t pt-2">
          <span className="text-lg font-semibold text-gray-900">{price} $</span>
          <button onClick={() => onRemove(item.id)} className="bg-red-500 text-white px-4 py-2 rounded">Supprimer</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
