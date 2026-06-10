import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartClick, onLoginClick, onSignupClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const closeMobileMenu = () => setShowMobileMenu(false);

  useEffect(() => {
    if (!showMobileMenu) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowMobileMenu(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMobileMenu]);

  const navItems = [
    { to: '/', label: 'Home', icon: 'fa-house' },
    { to: '/collection', label: 'Collections', icon: 'fa-shirt' },
    { to: '/contact', label: 'Contact Us', icon: 'fa-envelope' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: 'fa-user-shield' }] : []),
  ];

  return (
    <>
      <nav className="navbar">
        <h1><Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Nostra</Link></h1>

        <div className="navbar-links">
          {navItems.map((item) => (
            <p className="navbar-link" key={item.to}>
              <NavLink to={item.to} end={item.to === '/'}>{item.label}</NavLink>
            </p>
          ))}
        </div>

        <div className="navbar-actions">
          <div className="user-actions">
            <button className="icon-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              <i className="fa-solid fa-user"></i>
            </button>
            <button className="icon-btn cart-btn" onClick={onCartClick}>
              <i className="fa-solid fa-shopping-cart"></i>
              <span className="cart-count" style={{ display: getItemCount() > 0 ? 'inline' : 'none' }}>
                {getItemCount()}
              </span>
            </button>
          </div>
        </div>

        <button
          className="navbar-menu-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={showMobileMenu}
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileMenu(true);
          }}
        >
          <i className="fa-solid fa-bars"></i>
        </button>
      </nav>

      {showUserMenu && (
        <div className="user-menu" style={{ display: 'block' }}>
          {user ? (
            <>
              <p style={{ padding: '8px 15px', fontWeight: 'bold' }}>Hi, {user.name}</p>
              <button onClick={() => { navigate('/account'); setShowUserMenu(false); }}>My Account</button>
              <button onClick={() => { navigate('/orders'); setShowUserMenu(false); }}>My Orders</button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { onLoginClick(); setShowUserMenu(false); }}>Login</button>
              <button onClick={() => { onSignupClick(); setShowUserMenu(false); }}>Sign Up</button>
            </>
          )}
        </div>
      )}

      <button
        className={`side-navbar-backdrop ${showMobileMenu ? 'open' : ''}`}
        type="button"
        aria-label="Close navigation menu"
        onClick={closeMobileMenu}
      />

      <aside className={`side-navbar ${showMobileMenu ? 'open' : ''}`} aria-hidden={!showMobileMenu} aria-modal="true" role="dialog">
        <div className="side-navbar-header">
          <div>
            <span className="side-navbar-label">Menu</span>
            <h2>Nostra</h2>
          </div>
          <button className="side-navbar-close" type="button" aria-label="Close navigation menu" onClick={closeMobileMenu}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="side-navbar-links">
          {navItems.map((item) => (
            <NavLink
              className="side-navbar-link"
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={closeMobileMenu}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
