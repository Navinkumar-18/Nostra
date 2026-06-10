import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="footer">
    <div className="footer-container">
      <div className="footer-box1">
        <h2 className="headingtext">Nostra</h2>
        <p>Your premier destination for trendy fashion and style. Discover the latest collections and express your unique personality through fashion.</p>
        <div className="footer-icons">
          <i className="fa-brands fa-instagram" style={{ color: 'white' }}></i>
          <i className="fa-brands fa-twitter" style={{ color: 'white' }}></i>
          <i className="fa-brands fa-facebook" style={{ color: 'white' }}></i>
        </div>
      </div>
    </div>
    <p>@2025 Nostra.com</p>
  </div>
);

export default Footer;
