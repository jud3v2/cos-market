import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import Title from '../components/Title';
import '../index.css';
import Loading from "../components/Loading.jsx";

const Home = () => {
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
    return <Loading message={"Bienvenue Chez CosMarket"} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-white p-6">
        <Title text="Meilleures offres" />
        <div className="flex flex-wrap justify-center">
          {products.map(product => <Card key={product.id} product={product} />)}
        </div>
      </main>
    </div>
  );
};

export default Home;