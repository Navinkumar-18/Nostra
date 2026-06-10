import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = ({ showNotification, onShowProduct, onAddToCart, onAddToWishlist }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [mostWanted, setMostWanted] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const [newData, wantedData] = await Promise.all([
        api.products.getNewArrivals(),
        api.products.getMostWanted(),
      ]);
      setNewArrivals(newData.products);
      setMostWanted(wantedData.products);
    } catch (error) {
      showNotification('Error loading products');
    }
  };

  const handleNewsletter = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newsletterEmail) {
      showNotification('Please enter your email address');
      return;
    }
    if (!emailRegex.test(newsletterEmail)) {
      showNotification('Please enter a valid email address');
      return;
    }
    try {
      await api.newsletter.subscribe(newsletterEmail);
      setNewsletterEmail('');
      showNotification('Thank you for subscribing to our newsletter!');
    } catch (error) {
      showNotification(error.message);
    }
  };

  return (
    <>
      <div className="header">
        <div>
          <h1>Level up your style</h1>
          <p>with our stunning collections</p>
          <button className="header-button" onClick={() => navigate('/collection')}>Shop Now</button>
        </div>
        <div>
          <img className="header-image" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop" alt="Fashion" />
        </div>
      </div>

      <div className="service">
        <div className="service-container1">
          <div>
            <h2>We provide Best</h2>
            <h2>Customer Experience</h2>
          </div>
          <div>
            <p>||We ensure that our Customers have the best Shopping Experience</p>
          </div>
        </div>
        <div className="service-container2">
          <div>
            <i className="fa-regular fa-face-smile"></i>
            <h4>Satisfaction Guarantee</h4>
            <p>We stand behind our products with a 30-day satisfaction guarantee. Love it or return it.</p>
          </div>
          <div>
            <i className="fa-regular fa-face-smile"></i>
            <h4>New Arrival everyday</h4>
            <p>Discover fresh fashion pieces added to our collection daily. Stay ahead of the trends.</p>
          </div>
          <div>
            <i className="fa-regular fa-face-smile"></i>
            <h4>Fast and free shipping</h4>
            <p>Free shipping on orders over $50. Express delivery available. Your style arrives quickly.</p>
          </div>
        </div>
      </div>

      <div className="products-section">
        <h2>New Arrival</h2>
        <div className="products-grid">
          {newArrivals.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onShowDetails={onShowProduct}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          ))}
        </div>
      </div>

      <div className="products-section">
        <h2>Most Wanted</h2>
        <div className="products-grid">
          {mostWanted.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onShowDetails={onShowProduct}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          ))}
        </div>
      </div>

      <div className="news">
        <h2>Join Our News Letter</h2>
        <p>Signup for our email newsletter to get exclusive discounts, updates and more</p>
        <div>
          <input
            type="email"
            className="searchbar"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleNewsletter}>Subscribe</button>
        </div>
      </div>
    </>
  );
};

export default Home;
