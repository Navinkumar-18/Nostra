// Collections page functionality
let currentProducts = [...products];
let currentCategory = 'all';
let currentSort = 'name';

document.addEventListener('DOMContentLoaded', function() {
    loadCollections();
    setupCollectionEventListeners();
});

function loadCollections() {
    const grid = document.getElementById('collectionsGrid');
    grid.innerHTML = currentProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const ratingStars = generateStars(product.rating);

    return `
        <div class="product-card" onclick="showProductDetails(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <div class="product-rating">
                    <div class="stars">${ratingStars}</div>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="btn-secondary" onclick="event.stopPropagation(); addToWishlist(${product.id})">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fa-solid fa-star"></i>';
    }

    // Half star
    if (hasHalfStar) {
        stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="fa-regular fa-star"></i>';
    }

    return stars;
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    currentCategory = categoryFilter.value;

    if (currentCategory === 'all') {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(product => product.category === currentCategory);
    }

    sortProducts();
    loadCollections();
}

function sortProducts() {
    const sortFilter = document.getElementById('sortFilter');
    currentSort = sortFilter.value;

    currentProducts.sort((a, b) => {
        switch (currentSort) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    loadCollections();
}

function setupCollectionEventListeners() {
    // Search functionality (if there's a search input)
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredProducts = currentProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );

            const grid = document.getElementById('collectionsGrid');
            grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
        });
    }
}

// Utility functions (shared with main site)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (cart.addItem(productId)) {
        showNotification(`${product.name} added to cart!`);
    }
}

function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} added to wishlist!`);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'darkblue',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '5px',
        zIndex: '3000',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        animation: 'slideIn 0.3s ease-out'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Side navigation
var sidenav = document.querySelector(".side-navbar")

function shownav() {
    sidenav.style.left = "0"
}

function closenav() {
    sidenav.style.left = "-60%"
}