import { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useNotification } from './components/Notification';
import Notification from './components/Notification';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import CartModal from './components/CartModal';
import ProductModal from './components/ProductModal';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import UserPanel from './pages/UserPanel';

const App = () => {
  const { user, isAdmin, loading } = useAuth();
  const { addToCart } = useCart();
  const { notifications, showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    if (!loading && !initialCheckDone.current) {
      initialCheckDone.current = true;
      if (user && isAdmin && location.pathname === '/') {
        navigate('/admin', { replace: true });
      }
    }
  }, [user, isAdmin, loading]);

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const handleShowProduct = (id) => {
    setSelectedProductId(id);
  };

  const handleAddToCart = async (id) => {
    if (!user) {
      showNotification('Please login to add items to cart');
      setShowLogin(true);
      return;
    }
    try {
      await addToCart(id);
      showNotification('Added to cart!');
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleAddToWishlist = async (id) => {
    if (!user) {
      showNotification('Please login to add to wishlist');
      setShowLogin(true);
      return;
    }
    try {
      await api.wishlist.add(id);
      showNotification('Added to wishlist!');
    } catch (error) {
      showNotification(error.message);
    }
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    navigate('/cart');
  };

  return (
    <>
      <Navbar
        onCartClick={() => user ? setShowCartModal(true) : setShowLogin(true)}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
      />

      <Routes>
        <Route path="/" element={
          <Home
            showNotification={showNotification}
            onShowProduct={handleShowProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        } />
        <Route path="/collection" element={
          <Collection
            showNotification={showNotification}
            onShowProduct={handleShowProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        } />
        <Route path="/cart" element={<Cart showNotification={showNotification} />} />
        <Route path="/contact" element={<Contact showNotification={showNotification} />} />
        <Route path="/orders" element={<Orders showNotification={showNotification} />} />
        <Route path="/account" element={<UserPanel showNotification={showNotification} />} />
        <Route path="/admin" element={<Admin showNotification={showNotification} />} />
      </Routes>

      <Footer />

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} />
      <CartModal isOpen={showCartModal} onClose={() => setShowCartModal(false)} onCheckout={handleCheckout} />
      <ProductModal isOpen={!!selectedProductId} onClose={() => setSelectedProductId(null)} productId={selectedProductId} />
      <Notification notifications={notifications} />
    </>
  );
};

export default App;
