import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
    }, []);

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

  const { name, description, weapons, pattern, min_float, max_float, rarity, collections } = item;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{name}</h1>
      <div className="flex flex-col md:flex-row">
        <div className="flex-1">
          <img src={item.image} alt={name} className="mb-4 max-w-full" />
        </div>
        <div className="flex-1 ml-0 md:ml-4">
          <div className="text-2xl font-semibold mb-2">{rarity.name}</div>
          <p className="mb-4">{description}</p>
          <div className="mb-4">
            <span className="font-bold">Arme :</span> {weapons.name}
          </div>
          <div className="mb-4">
            <span className="font-bold">Motif :</span> {pattern.name}
          </div>
          <div className="mb-4">
            <span className="font-bold">Usure minimale :</span> {min_float}
          </div>
          <div className="mb-4">
            <span className="font-bold">Usure maximale :</span> {max_float}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
