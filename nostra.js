// DOM elements
let userMenuVisible = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadNewArrivals();
    loadMostWanted();
    setupEventListeners();
});

// Load new arrivals (first 4 products)
function loadNewArrivals() {
    const container = document.getElementById('new-arrivals');
    if (!container) return;

    const newArrivals = products.slice(0, 4);
    container.innerHTML = newArrivals.map(product => createProductCard(product)).join('');
}

// Load most wanted (next 4 products)
function loadMostWanted() {
    const container = document.getElementById('most-wanted');
    if (!container) return;

    const mostWanted = products.slice(4, 8);
    container.innerHTML = mostWanted.map(product => createProductCard(product)).join('');
}

// Create product card HTML
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

// Generate star rating HTML
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

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (cart.addItem(productId)) {
        showNotification(`${product.name} added to cart!`);
    }
}

function showCart() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = cart.items.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${item.price}</div>
                ${item.size ? `<div>Size: ${item.size}</div>` : ''}
                ${item.color ? `<div>Color: ${item.color}</div>` : ''}
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button onclick="updateCartQuantity(${index}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" onchange="updateCartQuantity(${index}, this.value)">
                    <button onclick="updateCartQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
                <button onclick="removeFromCart(${index})" class="btn-secondary">Remove</button>
            </div>
        </div>
    `).join('') || '<p>Your cart is empty</p>';

    cartTotal.textContent = cart.getTotal().toFixed(2);
    modal.style.display = 'block';
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

function updateCartQuantity(index, quantity) {
    cart.updateQuantity(index, parseInt(quantity));
    showCart(); // Refresh cart display
}

function removeFromCart(index) {
    cart.removeItem(index);
    showCart(); // Refresh cart display
}

function clearCart() {
    cart.clearCart();
    showCart(); // Refresh cart display
}

function checkout() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    // Redirect to cart page for checkout
    window.location.href = 'cart.html';
}

// Product details modal
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('productModal');
    if (!modal) return;

    const details = document.getElementById('productDetails');
    const title = document.getElementById('productTitle');

    title.textContent = product.name;

    const ratingStars = generateStars(product.rating);

    details.innerHTML = `
        <div class="product-detail-content">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-detail-info">
                <h2>${product.name}</h2>
                <div class="product-rating">
                    <div class="stars">${ratingStars}</div>
                    <span>${product.rating} (${product.reviews} reviews)</span>
                </div>
                <div class="product-price-detail">$${product.price}</div>
                <div class="product-description">${product.description}</div>

                <div class="product-options">
                    ${product.sizes && product.sizes.length > 1 ? `
                        <div class="option-group">
                            <label>Size:</label>
                            <div class="size-options">
                                ${product.sizes.map(size => `<div class="size-option" onclick="selectSize(this)">${size}</div>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${product.colors && product.colors.length > 1 ? `
                        <div class="option-group">
                            <label>Color:</label>
                            <div class="color-options">
                                ${product.colors.map(color => `<div class="color-option" onclick="selectColor(this)">${color}</div>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="add-to-cart-section">
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity-controls">
                            <button onclick="changeQuantity(-1)">-</button>
                            <input type="number" id="productQuantity" value="1" min="1">
                            <button onclick="changeQuantity(1)">+</button>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="addProductToCart(${product.id})">
                        Add to Cart - $${product.price}
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

function selectSize(element) {
    document.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

function selectColor(element) {
    document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

function changeQuantity(delta) {
    const input = document.getElementById('productQuantity');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= 1) {
        input.value = newValue;
    }
}

function addProductToCart(productId) {
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const selectedSize = document.querySelector('.size-option.selected')?.textContent;
    const selectedColor = document.querySelector('.color-option.selected')?.textContent;

    if (cart.addItem(productId, quantity, selectedSize, selectedColor)) {
        const product = products.find(p => p.id === productId);
        showNotification(`${product.name} added to cart!`);
        closeProductModal();
    }
}

// User menu functions
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) {
        userMenuVisible = !userMenuVisible;
        menu.style.display = userMenuVisible ? 'block' : 'none';
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        const menu = document.getElementById('userMenu');
        if (menu) menu.style.display = 'none';
        userMenuVisible = false;
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function showSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) {
        modal.style.display = 'block';
        const menu = document.getElementById('userMenu');
        if (menu) menu.style.display = 'none';
        userMenuVisible = false;
    }
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) modal.style.display = 'none';
}

function addToWishlist(productId) {
    // In a real app, this would save to user account
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} added to wishlist!`);
}

// Utility functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Style the notification
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

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Close modals when clicking outside
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Login functionality would be implemented here!');
            closeLoginModal();
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Account created successfully!');
            closeSignupModal();
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Simulate form submission (in a real app, this would send to a server)
            alert(`Thank you for your message, ${name}! We will get back to you soon.`);

            // Reset form
            contactForm.reset();
        });
    }
}

// Side navigation (existing)
var sidenav = document.querySelector(".side-navbar")

function shownav() {
    sidenav.style.left = "0"
}

function closenav() {
    sidenav.style.left = "-60%"
}

// Newsletter subscription
function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletterEmail');
    const email = emailInput.value.trim();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        showNotification('Please enter your email address');
        return;
    }

    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address');
        return;
    }

    // Clear input and show success message
    emailInput.value = '';
    showNotification('Thank you for subscribing to our newsletter!');
}