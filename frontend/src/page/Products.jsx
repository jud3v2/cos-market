import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Dropdown from '../components/Dropdown';
import Loading from "../components/Loading.jsx";
import '../index.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Constantes pour le filtrage des produits par nom
  const [searchTerm, setSearchTerm] = useState('');
  // Constantes pour le filtrage des produits par catégorie
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkin, setSelectedSkin] = useState('');
  // Constantes pour le filtrage des produits par type d'arme
  const [skinOptions, setSkinOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  // Constantes pour le filtrage des produits par prix
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortOrder, setSortOrder] = useState('asc');
  // Constantes pour afficher les filtres actifs
  const [activeFilters, setActiveFilters] = useState([]);

  const updateActiveFilters = (filter) => {
    const filters = [];
    if (searchTerm) filters.push(`Search: ${searchTerm}`);
    if (selectedCategory) filters.push(`Category: ${selectedCategory}`);
    if (selectedSkin) filters.push(`Skin: ${selectedSkin}`);
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) filters.push(`Price: ${priceRange[0]} - ${priceRange[1]}`);
    setActiveFilters(filters);
  };

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

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSortChange = (value) => {
    setSortOrder(value === 'Croissant' ? 'asc' : 'desc');
  };

  const removeFilter = (filter) => {
    const newFilters = activeFilters.filter(f => f !== filter);
    setActiveFilters(newFilters);

    if (filter.startsWith('Search:')) {
      setSearchTerm('');
    } else if (filter.startsWith('Category:')) {
      setSelectedCategory('');
    } else if (filter.startsWith('Skin:')) {
      setSelectedSkin('');
    } else if (filter.startsWith('Price:')) {
      setPriceRange([0, maxPrice]);
    }
  };

  useEffect(() => {
    updateActiveFilters();
  }, [searchTerm, selectedCategory, selectedSkin, priceRange]);

  useEffect(() => {
    const filteredSkins = new Set();
    products.forEach(product => {
      const skin = product.skin;
      const weaponsString = skin?.weapons;
      const categoryString = skin?.category;
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

      if (!selectedCategory || (category && category.name.toLowerCase() === selectedCategory.toLowerCase())) {
        if (weapon) {
          filteredSkins.add(weapon.name);
        }
      }
    });

    setSkinOptions(['Tout afficher', ...Array.from(filteredSkins)]);
  }, [selectedCategory, products]);

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
          <div className="flex space-x-4 z-10">
            <Dropdown
              label="TYPE D'ARMES"
              options={categoryOptions}
              onChange={handleCategoryChange}
            />
            <Dropdown
              label="ARMES"
              options={skinOptions}
              onChange={handleSkinChange}
            />
            <Dropdown
              label="PRIX"
              options={['Croissant', 'Décroissant']}
              onChange={handleSortChange}
              isPriceDropdown={true}
              priceRange={priceRange}
              setPriceRange={handlePriceChange}
              maxPrice={maxPrice}
            />
            <Dropdown label="AFFICHAGE" options={['Affi 1', 'Affi 2', 'Affi 3']}/>
          </div>
        </div>
        <div className='mb-4 gap-4 flex flex-wrap'>
          {activeFilters.map((filter, index) => (
            <span key={index} className='bg-yellow-300 text-black px-2 py-2 rounded-md'>
              {filter}
              <button
                className="ml-2"
                onClick={() => removeFilter(filter)}
                aria-label={`Remove ${filter}`}
              >
                &times;
              </button>
            </span>
          ))}
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
            .sort((a, b) => {
              return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
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