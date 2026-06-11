import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartModal = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const subtotal = cart.items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Shopping Cart">
      <div className="cart-items">
        {!user ? (
          <p className="cart-empty-msg">Please login to view your cart.</p>
        ) : cart.items.length === 0 ? (
          <p className="cart-empty-msg">Your cart is empty</p>
        ) : (
          cart.items.map((item) => (
            <div key={`${item.product._id}-${item.size}-${item.color}`} className="cart-item">
              <img src={item.product?.image} alt={item.product?.name} referrerPolicy="no-referrer" crossOrigin="anonymous" onError={(e) => { e.target.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=N/A'; }} />
              <div className="cart-item-details">
                <h4>{item.product?.name}</h4>
                <div className="cart-item-price">₹{Math.round(item.product?.price || 0)}</div>
                {item.size && <div className="cart-item-meta">Size: {item.size}</div>}
                {item.color && <div className="cart-item-meta">Color: {item.color}</div>}
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.size, item.color)}>-</button>
                  <input type="number" value={item.quantity} readOnly className="qty-input" />
                  <button onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.size, item.color)}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.product._id, item.size, item.color)} className="btn-secondary btn-sm">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-footer">
        <div className="cart-total">
          <strong>Total: ₹{Math.round(subtotal)}</strong>
        </div>
        <div className="cart-actions">
          {cart.items.length > 0 && (
            <>
              <button onClick={() => clearCart()} className="btn-secondary">Clear Cart</button>
              <button onClick={onCheckout} className="btn-primary">Checkout</button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CartModal;
