import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Dropdown from '../components/Dropdown';
import '../index.css';
import Loading from "../components/Loading.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkin, setSelectedSkin] = useState('');
  const [skinOptions, setSkinOptions] = useState([]);

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
          // Extraire les options de skins
          const skins = new Set();
          data.forEach(product => {
            const skin = product.skin;
            const weaponsString = skin?.weapons;
            if (weaponsString) {
              try {
                const weapon = JSON.parse(weaponsString);
                skins.add(weapon.name);
              } catch (error) {
                console.error('Error parsing weapons:', error);
              }
            }
          });
          const skinArray = Array.from(skins);
          setSkinOptions(['Tout afficher', ...skinArray]);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
          // Extraire les options de skins
          const skins = new Set();
          data.products.forEach(product => {
            const skin = product.skin;
            const weaponsString = skin?.weapons;
            if (weaponsString) {
              try {
                const weapon = JSON.parse(weaponsString);
                skins.add(weapon.name);
              } catch (error) {
                console.error('Error parsing weapons:', error);
              }
            }
          });
          const skinArray = Array.from(skins);
          setSkinOptions(['Tout afficher', ...skinArray]);
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

  const handleSkinChange = (value) => {
    if (value === 'Tout afficher') {
      setSelectedSkin('');
    } else {
      setSelectedSkin(value);
    }
  };

  if (loading) {
    return <Loading message={"Chargement des produits disponible"}/>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Rechercher..."
            className="p-2 border rounded w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex space-x-4">
            <Dropdown
              label="TYPE D'ARMES"
              options={['', 'Pistols', 'Rifles', 'SMGs', 'Heavy', 'Knives', 'Gloves']}
              onChange={(value) => setSelectedCategory(value)}
            />
            <Dropdown
              label="SKINS"
              options={skinOptions}
              onChange={handleSkinChange}
            />
            <Dropdown label="PRIX" options={['Prix 1', 'Prix 2', 'Prix 3']}/>
          </div>
          <Dropdown label="AFFICHAGE" options={['Affi 1', 'Affi 2', 'Affi 3']}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products
            .filter(product => {
              const skin = product.skin;
              const categoryString = skin?.category;
              const weaponsString = skin?.weapons;
              let category = null;
              let weapon = null;

              // Vérifier si la chaîne de catégorie est définie et non vide
              if (categoryString) {
                try {
                  category = JSON.parse(categoryString);
                } catch (error) {
                  console.error('Error parsing category:', error);
                }
              }

              // Vérifier si la chaîne de weapons est définie et non vide
              if (weaponsString) {
                try {
                  weapon = JSON.parse(weaponsString);
                } catch (error) {
                  console.error('Error parsing weapons:', error);
                }
              }

              const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = selectedCategory ? category?.name.toLowerCase() === selectedCategory.toLowerCase() : true;
              const matchesSkin = selectedSkin ? weapon?.name.toLowerCase() === selectedSkin.toLowerCase() : true;

              return matchesSearch && matchesCategory && matchesSkin;
            })
            .map(product => (
              <ProductCard key={product.id} product={product}/>
            ))}
        </div>
      </main>
    </div>
  );
};

export default Products;