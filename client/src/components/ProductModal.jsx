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
        <div className="product-details" style={{ padding: '20px' }}>
          <div className="product-detail-content" style={{ display: 'flex', gap: '30px' }}>
            <div className="product-detail-image" style={{ flex: 1 }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
            </div>
            <div className="product-detail-info" style={{ flex: 1 }}>
              <h2>{product.name}</h2>
              <div className="product-rating" style={{ marginBottom: '15px' }}>
                <div className="stars">{generateStars(product.rating)}</div>
                <span>{product.rating} ({product.reviewsCount} reviews)</span>
              </div>
              <div className="product-price-detail" style={{ fontSize: '2em', color: 'darkblue', fontWeight: 'bold', marginBottom: '20px' }}>
                ₹{Math.round(product.price)}
              </div>
              <div className="product-description" style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
                {product.description}
              </div>

              {product.sizes?.length > 1 && (
                <div className="option-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Size:</label>
                  <div className="size-options" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.sizes.map(size => (
                      <div
                        key={size}
                        className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                        style={{ padding: '8px 12px', border: `2px solid ${selectedSize === size ? 'darkblue' : '#ddd'}`, borderRadius: '5px', cursor: 'pointer', background: selectedSize === size ? 'darkblue' : 'white', color: selectedSize === size ? 'white' : 'inherit' }}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.colors?.length > 1 && (
                <div className="option-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Color:</label>
                  <div className="color-options" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {product.colors.map(color => (
                      <div
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        style={{ padding: '8px 12px', border: `2px solid ${selectedColor === color ? 'darkblue' : '#ddd'}`, borderRadius: '5px', cursor: 'pointer', background: selectedColor === color ? 'darkblue' : 'white', color: selectedColor === color ? 'white' : 'inherit' }}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="add-to-cart-section" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '25px', height: '25px' }}>-</button>
                    <input type="number" value={quantity} readOnly style={{ width: '40px', textAlign: 'center' }} />
                    <button onClick={() => setQuantity(quantity + 1)} style={{ width: '25px', height: '25px' }}>+</button>
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
