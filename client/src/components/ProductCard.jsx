import { useAuth } from '../context/AuthContext';

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {Array.from({ length: fullStars }, (_, i) => <i key={`full-${i}`} className="fa-solid fa-star"></i>)}
      {hasHalfStar && <i className="fa-solid fa-star-half-stroke"></i>}
      {Array.from({ length: emptyStars }, (_, i) => <i key={`empty-${i}`} className="fa-regular fa-star"></i>)}
    </>
  );
};

const ProductCard = ({ product, onShowDetails, onAddToCart, onAddToWishlist }) => {
  const { user } = useAuth();

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=No+Image';
  };

  return (
    <div className="product-card" onClick={() => onShowDetails(product._id)}>
      <img src={product.image} alt={product.name} className="product-image" referrerPolicy="no-referrer" crossOrigin="anonymous" onError={handleImageError} />
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">₹{Math.round(product.price)}</div>
        <div className="product-rating">
          <div className="stars">{generateStars(product.rating)}</div>
          <span>({product.reviewsCount})</span>
        </div>
        <div className="product-actions">
          <button className="btn-primary" onClick={(e) => { e.stopPropagation(); onAddToCart(product._id); }}>
            Add to Cart
          </button>
          <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); user && onAddToWishlist(product._id); }}>
            <i className="fa-solid fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export { generateStars };
export default ProductCard;
