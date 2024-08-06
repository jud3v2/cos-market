import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Dropdown from '../components/Dropdown';
import Loading from "../components/Loading.jsx";
import '../index.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkin, setSelectedSkin] = useState('');
  const [skinOptions, setSkinOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/product');
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const { products: fetchedProducts, skins, categories } = processProducts(data);

        setProducts(fetchedProducts);
        setSkinOptions(['Tout afficher', ...Array.from(skins)]);
        setCategoryOptions(['Tout afficher', ...Array.from(categories)]);

        // Calculate the maximum price from the fetched products
        const maxPrice = Math.max(...fetchedProducts.map(product => product.price), 0);
        setMaxPrice(maxPrice);
        setPriceRange([0, maxPrice]);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const processProducts = (data) => {
    const productsArray = Array.isArray(data) ? data : data.products || [];
    const skins = new Set();
    const categories = new Set();

    productsArray.forEach(product => {
      const skin = product.skin;
      const weaponsString = skin?.weapons;
      const categoryString = skin?.category;

      if (weaponsString) {
        try {
          const weapon = JSON.parse(weaponsString);
          skins.add(weapon.name);
        } catch (error) {
          console.error('Error parsing weapons:', error);
        }
      }
      if (categoryString) {
        try {
          const category = JSON.parse(categoryString);
          categories.add(category.name);
        } catch (error) {
          console.error('Error parsing category:', error);
        }
      }
    });

    return { products: productsArray, skins, categories };
  };

  const handleSkinChange = (value) => {
    setSelectedSkin(value === 'Tout afficher' ? '' : value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value === 'Tout afficher' ? '' : value);
  };

  if (loading) return <Loading message={"Chargement des produits disponible"}/>;
  if (error) return <div>Error: {error.message}</div>;

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
              options={categoryOptions}
              onChange={handleCategoryChange}
            />
            <Dropdown
              label="SKINS"
              options={skinOptions}
              onChange={handleSkinChange}
            />
            <Dropdown
              label="PRIX"
              isPriceDropdown={true}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
            />
            <Dropdown label="AFFICHAGE" options={['Affi 1', 'Affi 2', 'Affi 3']}/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products
            .filter(product => {
              const skin = product.skin;
              const categoryString = skin?.category;
              const weaponsString = skin?.weapons;
              let category = null;
              let weapon = null;

              if (categoryString) {
                try {
                  category = JSON.parse(categoryString);
                } catch (error) {
                  console.error('Error parsing category:', error);
                }
              }

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
              const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

              return matchesSearch && matchesCategory && matchesSkin && matchesPrice;
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