import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Dropdown from '../components/Dropdown';
import '../index.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/product')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setError(new Error('Invalid API response structure'));
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <input type="text" placeholder="Rechercher..." className="p-2 border rounded w-full max-w-xs" />
          <div className="flex space-x-4">
            <Dropdown label="ARMES" options={['Arme 1', 'Arme 2', 'Arme 3']} />
            <Dropdown label="SKINS" options={['Skins 1', 'Skins2', 'Skins 3']} />
            <Dropdown label="PRIX" options={['Prix 1', 'Prix 2', 'Prix 3']} />
          </div>
          <Dropdown label="AFFICHAGE" options={['Affi 1', 'Affi 2', 'Affi 3']} />
        </div>
        <div className="grid grid-cols-1 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
