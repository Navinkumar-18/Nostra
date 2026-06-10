import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const UserPanel = ({ showNotification }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [profile, setProfile] = useState({ name: '', phone: '', address: {} });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, wishlistData] = await Promise.all([
        api.orders.getMyOrders(),
        api.wishlist.get(),
      ]);
      setOrders(ordersData);
      setWishlist(wishlistData);
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || {},
      });
    } catch (error) {
      showNotification('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.auth.updateProfile(profile);
      api.setUser(updated);
      showNotification('Profile updated');
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match');
      return;
    }
    try {
      await api.auth.updatePassword(passwordData.currentPassword, passwordData.newPassword);
      showNotification('Password updated');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      await api.wishlist.remove(id);
      setWishlist(wishlist.filter((item) => item._id !== id));
      showNotification('Removed from wishlist');
    } catch (error) {
      showNotification(error.message);
    }
  };

  const recentOrders = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  if (loading) {
    return <div className="cart-section"><p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p></div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <nav className="sidebar-nav">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
            { key: 'orders', label: 'My Orders', icon: 'fa-box' },
            { key: 'wishlist', label: 'Wishlist', icon: 'fa-heart' },
            { key: 'profile', label: 'Profile Settings', icon: 'fa-user-gear' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`sidebar-link ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <>
            <h1 className="dashboard-title">Welcome back, {user.name}</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <div className="stat-value">{orders.length}</div>
              </div>
              <div className="stat-card">
                <h3>Wishlist Items</h3>
                <div className="stat-value">{wishlist.length}</div>
              </div>
              <div className="stat-card">
                <h3>Total Spent</h3>
                <div className="stat-value">₹{Math.round(totalSpent)}</div>
              </div>
            </div>

            <h2 style={{ marginTop: '40px', marginBottom: '20px', color: '#1d232c' }}>Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <p style={{ color: '#666' }}>No orders yet. <a href="/collection" style={{ color: 'darkblue' }}>Start shopping</a></p>
            ) : (
              <div className="orders-mini-list">
                {recentOrders.map((order) => (
                  <div key={order._id} className="order-mini-card">
                    <div className="order-mini-header">
                      <strong>Order #{order._id.slice(-8)}</strong>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-mini-body">
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>₹{Math.round(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h1 className="dashboard-title">My Orders</h1>
            {orders.length === 0 ? (
              <div className="empty-state">
                <i className="fa-solid fa-box"></i>
                <h2>No orders yet</h2>
                <p>Start shopping to see your orders here.</p>
                <button className="btn-primary" onClick={() => navigate('/collection')}>Shop Now</button>
              </div>
            ) : (
              <div className="orders-full-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-card-header">
                      <div>
                        <strong>Order #{order._id.slice(-8)}</strong>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="order-header-right">
                        <span className={`status-badge status-${order.status}`}>{order.status}</span>
                        <strong>₹{Math.round(order.total)}</strong>
                      </div>
                    </div>
                    <div className="order-card-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img src={item.image} alt={item.name} />
                          <div className="order-item-info">
                            <h4>{item.name}</h4>
                            <p>Qty: {item.quantity} x ₹{Math.round(item.price)}</p>
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                          </div>
                          <div className="order-item-total">₹{Math.round(item.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>
                    {order.shippingAddress && (
                      <div className="order-card-footer">
                        <p>Ship to: {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'wishlist' && (
          <>
            <h1 className="dashboard-title">My Wishlist</h1>
            {wishlist.length === 0 ? (
              <div className="empty-state">
                <i className="fa-solid fa-heart"></i>
                <h2>Your wishlist is empty</h2>
                <p>Save your favorite items here.</p>
                <button className="btn-primary" onClick={() => navigate('/collection')}>Browse Products</button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map((product) => (
                  <div key={product._id} className="wishlist-card">
                    <img src={product.image} alt={product.name} />
                    <div className="wishlist-card-info">
                      <h3>{product.name}</h3>
                      <p className="wishlist-price">₹{Math.round(product.price)}</p>
                    </div>
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      title="Remove from wishlist"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <>
            <h1 className="dashboard-title">Profile Settings</h1>
            <div className="profile-settings-grid">
              <div className="profile-section-card">
                <h2>Personal Information</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text" value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={user.email} disabled />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text" value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <fieldset className="form-fieldset">
                    <legend>Address</legend>
                    <div className="form-group">
                      <input
                        type="text" value={profile.address.street || ''}
                        onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
                        placeholder="Street address"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <input
                          type="text" value={profile.address.city || ''}
                          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                          placeholder="City"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <input
                          type="text" value={profile.address.state || ''}
                          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <input
                          type="text" value={profile.address.zipCode || ''}
                          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, zipCode: e.target.value } })}
                          placeholder="ZIP code"
                        />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <input
                          type="text" value={profile.address.country || ''}
                          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, country: e.target.value } })}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </fieldset>
                  <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>Save Changes</button>
                </form>
              </div>

              <div className="profile-section-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password" value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password" value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required minLength={6}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password" value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required minLength={6}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>Update Password</button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPanel;
