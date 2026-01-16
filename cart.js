// Cart page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartSummary();
    setupCartEventListeners();
});

function loadCartItems() {
    const cartItemsSection = document.getElementById('cartItemsSection');

    if (cart.items.length === 0) {
        cartItemsSection.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <a href="collection.html" class="btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsSection.innerHTML = cart.items.map((item, index) => `
        <div class="cart-item-card">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">$${item.price}</p>
                ${item.size ? `<p>Size: ${item.size}</p>` : ''}
                ${item.color ? `<p>Color: ${item.color}</p>` : ''}
                <div class="quantity-controls">
                    <button onclick="updateCartItemQuantity(${index}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" onchange="updateCartItemQuantity(${index}, this.value)">
                    <button onclick="updateCartItemQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <button onclick="removeCartItem(${index})" class="btn-secondary">Remove</button>
            </div>
        </div>
    `).join('');
}

function updateCartSummary() {
    const subtotal = cart.getTotal();
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function updateCartItemQuantity(index, quantity) {
    cart.updateQuantity(index, parseInt(quantity));
    loadCartItems();
    updateCartSummary();
}

function removeCartItem(index) {
    cart.removeItem(index);
    loadCartItems();
    updateCartSummary();
    showNotification('Item removed from cart');
}

function proceedToCheckout() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    document.getElementById('checkoutModal').style.display = 'block';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function setupCartEventListeners() {
    // Checkout form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // In a real app, this would process payment
        showNotification('Order placed successfully! Thank you for shopping with NOSTRA.');
        cart.clearCart();
        loadCartItems();
        updateCartSummary();
        closeCheckoutModal();
        setTimeout(() => {
            window.location.href = 'nostra.html';
        }, 2000);
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('checkoutModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
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