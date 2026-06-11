import { useState, useEffect } from 'react';
import Modal from './Modal';
import api from '../services/api';
import { generateStars } from './ProductCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductModal = ({ isOpen, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (productId && isOpen) {
      loadProduct();
      setQuantity(1);
      setSelectedSize(null);
      setSelectedColor(null);
    }
  }, [productId, isOpen]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.products.getById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity, selectedSize, selectedColor);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product?.name || 'Product Details'}>
      {loading ? (
        <p style={{ padding: '20px' }}>Loading...</p>
      ) : product ? (
          <div className="product-details">
            <div className="product-detail-content">
              <div className="product-detail-image">
                <img src={product.image} alt={product.name} referrerPolicy="no-referrer" crossOrigin="anonymous" onError={handleImageError} />
              </div>
              <div className="product-detail-info">
                <h2>{product.name}</h2>
                <div className="product-rating">
                  <div className="stars">{generateStars(product.rating)}</div>
                  <span>{product.rating} ({product.reviewsCount} reviews)</span>
                </div>
                <div className="product-price-detail">
                  ₹{Math.round(product.price)}
                </div>
                <div className="product-description">
                  {product.description}
                </div>

                {product.sizes?.length > 1 && (
                  <div className="option-group">
                    <label>Size:</label>
                    <div className="size-options">
                      {product.sizes.map(size => (
                        <div
                          key={size}
                          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.colors?.length > 1 && (
                  <div className="option-group">
                    <label>Color:</label>
                    <div className="color-options">
                      {product.colors.map(color => (
                        <div
                          key={color}
                          className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="add-to-cart-section">
                  <div className="quantity-selector">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <input type="number" value={quantity} readOnly />
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className="btn-primary" onClick={handleAddToCart}>
                    Add to Cart - ₹{Math.round(product.price * quantity)}
                  </button>
                </div>
              </div>
            </div>
          </div>
      ) : null}
    </Modal>
  );
};

export default ProductModal;
