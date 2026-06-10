import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Collection = ({ showNotification, onShowProduct, onAddToCart, onAddToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async (searchTerm) => {
    try {
      setLoading(true);
      const params = { limit: 50, sort: 'newest' };
      if (category !== 'all') {
        params.category = category;
      }
      if (searchTerm || search) {
        params.search = searchTerm || search;
      }
      const data = await api.products.getAll(params);
      setProducts(data.products);
    } catch (error) {
      showNotification('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  return (
    <div className="collections-section">
      <div className="collections-header">
        <h1>Collections</h1>
        <div className="filters">
          <form onSubmit={handleSearch} className="search-bar" style={{ marginRight: '10px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="icon-btn"><i className="fa-solid fa-search"></i></button>
          </form>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="shirts">Shirts</option>
            <option value="pants">Pants</option>
            <option value="dresses">Dresses</option>
            <option value="jackets">Jackets</option>
            <option value="shoes">Shoes</option>
            <option value="accessories">Accessories</option>
            <option value="hoodies">Hoodies</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '50px' }}>Loading products...</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onShowDetails={onShowProduct}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collection;
