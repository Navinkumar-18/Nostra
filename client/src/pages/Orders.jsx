import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Orders = ({ showNotification }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await api.orders.getMyOrders();
      setOrders(data);
    } catch (error) {
      showNotification('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="cart-section"><p style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</p></div>;
  }

  return (
    <div className="cart-section">
      <div className="cart-container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-cart">
            <i className="fa-solid fa-box"></i>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here.</p>
            <button className="btn-primary" onClick={() => navigate('/collection')}>Shop Now</button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <strong>Order #{order._id.slice(-8)}</strong>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-card-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img src={item.image} alt={item.name} />
                      <div className="order-item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity} | ₹{Math.round(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="order-card-footer">
                  <strong>Total: ₹{Math.round(order.total)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
