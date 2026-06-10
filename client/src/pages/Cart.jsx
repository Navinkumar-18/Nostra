import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const emptyForm = {
  firstName: '', lastName: '', email: '',
  address: '', city: '', zipCode: '',
  cardNumber: '', mmYY: '', cvv: '',
};

const Cart = ({ showNotification }) => {
  const { cart, updateQuantity, removeFromCart, loadCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const shippingAddress = {
        firstName: checkoutForm.firstName,
        lastName: checkoutForm.lastName,
        email: checkoutForm.email,
        address: checkoutForm.address,
        city: checkoutForm.city,
        zipCode: checkoutForm.zipCode,
      };
      await api.orders.create(shippingAddress, 'card');
      setCheckoutForm({ ...emptyForm });
      setShowCheckout(false);
      showNotification('Order placed successfully! Thank you for shopping with NOSTRA.');
      await loadCart();
      navigate('/');
    } catch (error) {
      showNotification(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-section">
      <div className="cart-container">
        <h1>Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="empty-cart">
            <i className="fa-solid fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button className="btn-primary" onClick={() => navigate('/collection')}>Continue Shopping</button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              {cart.items.map((item) => (
                <div key={`${item.product._id}-${item.size}-${item.color}`} className="cart-item-card">
                  <img src={item.product?.image} alt={item.product?.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.product?.name}</h3>
                    <p className="cart-item-price">₹{Math.round(item.product?.price || 0)}</p>
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.size, item.color)}>-</button>
                      <input type="number" value={item.quantity} readOnly />
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.size, item.color)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button onClick={() => { removeFromCart(item.product._id, item.size, item.color); showNotification('Item removed'); }} className="btn-secondary btn-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{Math.round(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{shipping === 0 ? 'FREE' : `₹${Math.round(shipping)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{Math.round(tax)}</span>
              </div>
              <div className="summary-row total">
                <strong>Total:</strong>
                <strong>₹{Math.round(total)}</strong>
              </div>
              <button className="btn-primary checkout-btn" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {showCheckout && (
        <div className="modal modal-open checkout-overlay" onClick={(e) => e.target === e.currentTarget && !submitting && setShowCheckout(false)}>
          <div className="modal-content checkout-modal-content">
            <div className="modal-header">
              <h2>Checkout</h2>
              <span className="close" onClick={() => !submitting && setShowCheckout(false)}>&times;</span>
            </div>
            <div className="checkout-form-body">
              <div className="checkout-summary-card">
                <h3>Order Summary</h3>
                {cart.items.map((item, i) => (
                  <div key={i} className="checkout-summary-row">
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span>₹{Math.round((item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
                <hr />
                <div className="checkout-summary-total">
                  <span>Total</span>
                  <span>₹{Math.round(total)}</span>
                </div>
              </div>
              <form onSubmit={handleCheckout}>
                <div className="form-section">
                  <h3>Shipping Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <input type="text" name="firstName" placeholder="First Name" value={checkoutForm.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <input type="text" name="lastName" placeholder="Last Name" value={checkoutForm.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <input type="email" name="email" placeholder="Email" value={checkoutForm.email} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="address" placeholder="Address" value={checkoutForm.address} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input type="text" name="city" placeholder="City" value={checkoutForm.city} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <input type="text" name="zipCode" placeholder="ZIP Code" value={checkoutForm.zipCode} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Payment Information</h3>
                  <div className="form-group">
                    <input type="text" name="cardNumber" placeholder="Card Number" value={checkoutForm.cardNumber} onChange={handleInputChange} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <input type="text" name="mmYY" placeholder="MM/YY" value={checkoutForm.mmYY} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <input type="text" name="cvv" placeholder="CVV" value={checkoutForm.cvv} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-block" disabled={submitting}>
                  {submitting ? 'Processing...' : `Complete Order - ₹${Math.round(total)}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
