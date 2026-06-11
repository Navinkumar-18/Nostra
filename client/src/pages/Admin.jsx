import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Admin = ({ showNotification }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyProductForm = { name: '', price: '', originalPrice: '', category: '', image: '', description: '', stockQuantity: 0, sizes: '', colors: '', isNewArrival: false, isMostWanted: false };
  const [newProduct, setNewProduct] = useState({ ...emptyProductForm });
  const [editingProductId, setEditingProductId] = useState(null);
  const minimumProductPrice = 501;

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, productsData, usersData, contactsData, reviewsData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getAllOrders(),
        api.products.getAll({ limit: 100 }),
        api.admin.getUsers(),
        api.admin.getContacts(),
        api.admin.getReviews(),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders || ordersData);
      setProducts(productsData.products || productsData);
      setUsers(usersData.users || usersData);
      setContacts(contactsData.contacts || contactsData);
      setReviews(reviewsData.reviews || reviewsData);
    } catch (error) {
      showNotification('Error loading admin data');
    } finally {
      setLoading(false);
    }
  };

  const buildProductPayload = (data) => ({
    ...data,
    price: parseFloat(data.price),
    originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : undefined,
    stockQuantity: parseInt(data.stockQuantity) || 0,
    inStock: true,
    sizes: data.sizes ? data.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
    colors: data.colors ? data.colors.split(',').map(c => c.trim()).filter(Boolean) : [],
  });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = buildProductPayload(newProduct);
      if (payload.price < minimumProductPrice) {
        showNotification('Product price must be above ₹500');
        return;
      }
      if (editingProductId) {
        await api.admin.updateProduct(editingProductId, payload);
        showNotification('Product updated');
      } else {
        await api.admin.createProduct(payload);
        showNotification('Product added');
      }
      setNewProduct({ ...emptyProductForm });
      setEditingProductId(null);
      loadData();
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name || '',
      price: String(product.price || ''),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      category: product.category || '',
      image: product.image || '',
      description: product.description || '',
      stockQuantity: String(product.stockQuantity || 0),
      sizes: (product.sizes || []).join(', '),
      colors: (product.colors || []).join(', '),
      isNewArrival: product.isNewArrival || false,
      isMostWanted: product.isMostWanted || false,
    });
    setEditingProductId(product._id);
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.admin.deleteProduct(id);
      showNotification('Product deleted');
      loadData();
    } catch (error) {
      showNotification(error.message);
    }
  };

  const cancelEdit = () => {
    setNewProduct({ ...emptyProductForm });
    setEditingProductId(null);
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.admin.updateOrderStatus(orderId, status);
      showNotification('Order status updated');
      loadData();
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await api.admin.updateUserRole(userId, role);
      showNotification('User role updated');
      loadData();
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleUpdateContactStatus = async (contactId, status) => {
    try {
      await api.admin.updateContactStatus(contactId, status);
      showNotification('Contact status updated');
      loadData();
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.admin.deleteReview(id);
      showNotification('Review deleted');
      loadData();
    } catch (error) {
      showNotification(error.message);
    }
  };

  const sidebarTabs = [
    { key: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
    { key: 'orders', label: 'Orders', icon: 'fa-truck' },
    { key: 'products', label: 'Products', icon: 'fa-boxes' },
    { key: 'users', label: 'Users', icon: 'fa-users' },
    { key: 'contacts', label: 'Contacts', icon: 'fa-envelope' },
    { key: 'reviews', label: 'Reviews', icon: 'fa-star' },
  ];

  if (loading) {
    return <div className="cart-section"><p style={{ textAlign: 'center', padding: '50px' }}>Loading...</p></div>;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar admin-sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h3>Admin Panel</h3>
          <p>{user.name}</p>
        </div>
        <nav className="sidebar-nav">
          {sidebarTabs.map((tab) => (
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
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={() => navigate('/')}>
            <i className="fa-solid fa-store"></i>
            <span>Back to Store</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'dashboard' && (
          <>
            <h1 className="dashboard-title">Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card"><h3>Total Users</h3><div className="stat-value">{stats?.totalUsers || 0}</div></div>
              <div className="stat-card"><h3>Total Products</h3><div className="stat-value">{stats?.totalProducts || 0}</div></div>
              <div className="stat-card"><h3>Total Orders</h3><div className="stat-value">{stats?.totalOrders || 0}</div></div>
              <div className="stat-card"><h3>Total Revenue</h3><div className="stat-value">₹{Math.round(stats?.totalRevenue || 0)}</div></div>
              <div className="stat-card"><h3>Subscribers</h3><div className="stat-value">{stats?.totalSubscribers || 0}</div></div>
              <div className="stat-card"><h3>Contacts</h3><div className="stat-value">{stats?.totalContacts || 0}</div></div>
            </div>

            <h2 style={{ margin: '40px 0 20px', color: '#1d232c' }}>Recent Orders</h2>
            {stats?.recentOrders?.length > 0 ? (
              <div className="orders-mini-list">
                {stats.recentOrders.map((order) => (
                  <div key={order._id} className="order-mini-card">
                    <div className="order-mini-header">
                      <strong>Order #{order._id.slice(-8)}</strong>
                      <span className={`status-badge status-${order.status}`}>{order.status}</span>
                    </div>
                    <div className="order-mini-body">
                      <span>{order.user?.name || 'N/A'}</span>
                      <span>₹{Math.round(order.total || 0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No orders yet</p>
            )}

            {stats?.lowStock?.length > 0 && (
              <>
                <h2 style={{ margin: '40px 0 20px', color: '#d9534f' }}>Low Stock Products</h2>
                <div className="orders-mini-list">
                  {stats.lowStock.map((product) => (
                    <div key={product._id} className="order-mini-card">
                      <div className="order-mini-header">
                        <strong>{product.name}</strong>
                        <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{product.stockQuantity} left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <h1 className="dashboard-title">Orders Management</h1>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.user?.name || order.shippingAddress?.firstName || 'N/A'}</td>
                      <td>{order.items?.length || 0}</td>
                      <td>₹{Math.round(order.total || 0)}</td>
                      <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                      <td><span className={`status-badge status-${order.paymentStatus}`}>{order.paymentStatus || 'pending'}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <select onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} value={order.status}>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <h1 className="dashboard-title">Products Management</h1>
            <div className="admin-section-card">
              <h2>{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleAddProduct}>
                <div className="add-product-grid">
                  <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required />
                  <input type="number" placeholder="Price" min={minimumProductPrice} step="1" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} required />
                  <input type="number" placeholder="Original Price" step="0.01" value={newProduct.originalPrice} onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })} />
                  <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required>
                    <option value="">Select Category</option>
                    {['shirts','pants','dresses','jackets','shoes','accessories','hoodies'].map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} required />
                  <input type="number" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })} />
                  <input type="text" placeholder="Sizes (comma-separated, e.g. S, M, L)" value={newProduct.sizes} onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })} />
                  <input type="text" placeholder="Colors (comma-separated, e.g. Red, Blue)" value={newProduct.colors} onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })} />
                </div>
                <textarea placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows="3" required />
                <div className="add-product-options">
                  <label><input type="checkbox" checked={newProduct.isNewArrival} onChange={(e) => setNewProduct({ ...newProduct, isNewArrival: e.target.checked })} /> New Arrival</label>
                  <label><input type="checkbox" checked={newProduct.isMostWanted} onChange={(e) => setNewProduct({ ...newProduct, isMostWanted: e.target.checked })} /> Most Wanted</label>
                  <button type="submit" className="btn-primary">{editingProductId ? 'Update Product' : 'Add Product'}</button>
                  {editingProductId && <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>}
                </div>
              </form>
            </div>
            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sizes</th>
                    <th>Colors</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td><img src={product.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} referrerPolicy="no-referrer" crossOrigin="anonymous" onError={(e) => { e.target.src = 'https://placehold.co/50x50/e2e8f0/64748b?text=N/A'; }} /></td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{Math.round(product.price)}</td>
                      <td>{product.stockQuantity || 0}</td>
                      <td>{(product.sizes || []).join(', ')}</td>
                      <td>{(product.colors || []).join(', ')}</td>
                      <td>
                        <button onClick={() => handleEditProduct(product)} className="btn-primary" style={{ padding: '5px 10px', marginRight: '5px' }}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="btn-secondary" style={{ padding: '5px 10px' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <>
            <h1 className="dashboard-title">Users Management</h1>
            <div className="table-wrapper">
              <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone || '-'}</td>
                    <td><span className={`status-badge ${u.role === 'admin' ? 'status-delivered' : 'status-pending'}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select onChange={(e) => handleUpdateUserRole(u._id, e.target.value)} value={u.role}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <h1 className="dashboard-title">Contact Messages</h1>
            <div className="table-wrapper">
              <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.subject}</td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{contact.message}</td>
                    <td><span className={`status-badge ${contact.status === 'read' ? 'status-delivered' : 'status-pending'}`}>{contact.status}</span></td>
                    <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select onChange={(e) => handleUpdateContactStatus(contact._id, e.target.value)} value={contact.status}>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}

        {activeTab === 'reviews' && (
          <>
            <h1 className="dashboard-title">Reviews Management</h1>
            {reviews.length === 0 ? (
              <p style={{ color: '#666' }}>No reviews yet.</p>
            ) : (
              <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr><th>User</th><th>Product</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td>{review.user?.name || 'Unknown'}</td>
                      <td>{review.product?.name || 'Unknown'}</td>
                      <td>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
                      <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.comment || review.title || '-'}</td>
                      <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleDeleteReview(review._id)} className="btn-secondary" style={{ padding: '5px 10px', color: '#d9534f' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  </tbody>
              </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
