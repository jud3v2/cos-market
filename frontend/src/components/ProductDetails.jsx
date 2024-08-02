import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

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
  const { price, skin } = product;
  const imageUrl = skin?.image || 'default-image.png';
  const rarity = skin?.rarity?.name || 'Rareté non disponible';
  const wear = JSON.parse(skin?.wears || '[]')[0]?.name || 'Usure non spécifiée';
  const statTrak = product.stattrak ? 'STATTRAK™' : '';
  const isNew = product.stock > 0 ? 'NEUVE' : 'UTILISÉE';
  const weaponsName = JSON.parse(skin?.weapons || '{}').name || 'Nom de l\'arme non disponible';
  const patternName = JSON.parse(skin?.pattern || '{}').name || 'Nom du motif non disponible';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <img src={item.image} alt={item.name} className="mb-4 max-w-full" />
        </div>
        <div className="flex-1 ml-0 md:ml-4">
          <div className="mb-4">
            <span className='font-bold'>Description : </span>{description}
          </div>
          <div className="mb-4">
            <span className="font-bold">Arme :</span> {item.name}
          </div>
          <div className="mb-4">
            <span className="font-bold">Motif :</span> {JSON.parse(pattern).name}
          </div>
          <div className="mb-4">
            <span className="font-bold">Catégorie :</span> {JSON.parse(item.category).name}
          </div>
          <div className="mb-4">
            <span className="font-bold">Rareté :</span> {JSON.parse(item.rarity).name}
          </div>
          <div className="mb-4">
            <span className="font-bold">Collection :</span> {JSON.parse(JSON.parse(collections)).map(collection => {
              return (
                <div key={collection.name}>
                  <img src={collection.image} alt={collection.name} className="w-10 h-10 inline-block mr-2" />
                  <span key={collection.id}>{collection.name}</span> <br />
                </div>
              )
            })}
          </div>
          <div className="mb-4">
            <span className="font-bold">Usure minimale :</span> {min_float}
          </div>
          <div className="mb-4">
            <span className="font-bold">Usure maximale :</span> {max_float}
          </div>
          <div className="mb-4">
            <span className="font-bold">Usure :</span> {product.usage}
          </div>
          <div className="mb-4">
            <h3 className='font-bold text-2xl'>Caisse : </h3>
            <div className="max-h-24 overflow-y-auto" ref={scrollRef}>
              {JSON.parse(JSON.parse(item.crates))?.map(crate => {
                return (
                  <div key={crate.name} className="mb-2">
                    <img src={crate.image} alt={crate.name} className="w-10 h-10 inline-block mr-2" />
                    <span className="font-bold">Caisse :</span> {crate.name} <br />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <span className="font-bold">StatTrak :</span> {product.stattrak ? 'Oui' : 'Non'}
          </div>
          <div className="mb-4">
            <span className="font-bold">Souvenir :</span> {product.souvenir ? 'Oui' : 'Non'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
