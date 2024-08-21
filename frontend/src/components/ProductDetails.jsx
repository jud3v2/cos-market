import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CartService from '../services/cartService';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollAmount = 0;

    const scrollStep = () => {
      scrollAmount += 0.5;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollAmount;
        if (scrollAmount >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollAmount = 0;
        }
      }
    };

    const interval = setInterval(scrollStep, 20);

    return () => clearInterval(interval); 
  }, [item]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/product/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProduct(data.product);
      setItem(data.item);
      setLoading(false);

      return data;
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération des données');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (await CartService.addProduct(product)) {
        toast('Produit ajouté au panier', {
                type: 'success',
        });
        // Sauvegarder le panier dans la base de données
        const response = await CartService.saveCartToDB(product.id);
        if (response.success) {
            //console.info('Panier sauvegardé dans la base de données');
        } else {
            //console.info('Erreur lors de la sauvegarde du panier : ' + response.message);
        }
    } else {
        toast('Produit déjà dans le panier', {
                type: 'error',
        });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Aucun produit trouvé</div>;
  }

  const { description, weapons, pattern, min_float, max_float, collections, wears } = item;
  const imageUrl = skin?.image || 'default-image.png';
  const rarity = skin?.rarity?.name || 'Rareté non disponible';
  const wear = JSON.parse(skin?.wears || '[]')[0]?.name || 'Usure non spécifiée';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <img src={item.image} alt={item.name} className="mb-4 max-w-full" />
          <div className="items-center mb-4">
            <button onClick={handleAddToCart} className="bg-yellow-400 hover:bg-orange-400 text-white text-xl font-bold py-3 px-52 rounded">
              Ajouter au panier
            </button>
          </div>
            <span className="text-4xl font-semibold text-gray-900">Prix : {price} $</span>
        </div>
        <div className="flex-1 ml-0 md:ml-4">
          <div className="mb-4">
            <span className="font-bold">Arme :</span> <span className='text-gray-400'>{item.name}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Motif :</span> <span className='text-gray-400'>{JSON.parse(pattern).name}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Catégorie :</span> <span className='text-gray-400'>{JSON.parse(item.category).name}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Rareté :</span> <span className='text-gray-400'>{JSON.parse(item.rarity).name} </span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Collection :</span> {JSON.parse(JSON.parse(collections)).map(collection => {
              return (
                <div key={collection.name}>
                  <img src={collection.image} alt={collection.name} className="w-10 h-10 inline-block mr-2" />
                  <span className='text-gray-400' key={collection.id}>{collection.name}</span> <br />
                </div>
              )
            })}
          </div>
          <div className="mb-4 text-center">
            <div className="grid grid-cols-3 border border-gray-300">
              <div className="font-bold border-r border-b border-gray-300 p-2">Usure minimale</div>
              <div className="font-bold border-r border-b border-gray-300 p-2">Usure maximale</div>
              <div className="font-bold border-b border-gray-300 p-2">Usure</div>
              <div className="border-r border-gray-300 p-2 text-gray-400">{min_float}</div>
              <div className="border-r border-gray-300 p-2 text-gray-400">{max_float}</div>
              <div className="p-2 text-gray-400">{product.usage}</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="max-h-32 overflow-y-auto" ref={scrollRef}>
              {JSON.parse(JSON.parse(item.crates))?.map(crate => {
                return (
                  <div key={crate.name} className="mb-2">
                    <img src={crate.image} alt={crate.name} className="w-10 h-10 inline-block mr-2" />
                    <span className="font-bold">Caisse :</span> <span className='text-gray-400'>{crate.name}</span> <br />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <span className="font-bold">StatTrak :</span> <span className='text-gray-400'>{product.stattrak ? 'Oui' : 'Non'}</span>
          </div>
          <div className="mb-4">
            <span className="font-bold">Souvenir :</span><span className='text-gray-400'>{product.souvenir ? 'Oui' : 'Non'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
