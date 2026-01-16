// Product data for NOSTRA E-commerce site
const products = [
    {
        id: 1,
        name: "Classic White Shirt",
        price: 29.99,
        originalPrice: 39.99,
        image: "https://picsum.photos/seed/white-shirt-1/400/400",
        category: "shirts",
        description: "A timeless classic white shirt made from premium cotton. Perfect for any occasion.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White"],
        rating: 4.5,
        reviews: 128,
        inStock: true
    },
    {
        id: 2,
        name: "Premium Black Shirt",
        price: 34.99,
        originalPrice: 44.99,
        image: "https://picsum.photos/seed/black-shirt-1/400/400",
        category: "shirts",
        description: "Elegant black shirt with a modern fit. Made from high-quality fabric.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black"],
        rating: 4.7,
        reviews: 95,
        inStock: true
    },
    {
        id: 3,
        name: "Blue Denim Jeans",
        price: 59.99,
        originalPrice: 79.99,
        image: "https://picsum.photos/seed/blue-jeans/400/400",
        category: "pants",
        description: "Comfortable blue denim jeans with a perfect fit. Durable and stylish.",
        sizes: ["28", "30", "32", "34", "36"],
        colors: ["Blue"],
        rating: 4.3,
        reviews: 67,
        inStock: true
    },
    {
        id: 4,
        name: "Red Evening Dress",
        price: 89.99,
        originalPrice: 119.99,
        image: "https://picsum.photos/seed/red-dress/400/400",
        category: "dresses",
        description: "Stunning red evening dress perfect for special occasions. Elegant and sophisticated.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Red"],
        rating: 4.8,
        reviews: 43,
        inStock: true
    },
    {
        id: 5,
        name: "Leather Jacket",
        price: 149.99,
        originalPrice: 199.99,
        image: "https://picsum.photos/seed/leather-jacket/400/400",
        category: "jackets",
        description: "Premium leather jacket with a timeless design. Perfect for any season.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Brown"],
        rating: 4.6,
        reviews: 89,
        inStock: true
    },
    {
        id: 6,
        name: "Running Sneakers",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://picsum.photos/seed/sneakers/400/400",
        category: "shoes",
        description: "Comfortable running sneakers with advanced cushioning technology.",
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["White", "Black", "Blue"],
        rating: 4.4,
        reviews: 156,
        inStock: true
    },
    {
        id: 7,
        name: "Designer Handbag",
        price: 129.99,
        originalPrice: 169.99,
        image: "https://picsum.photos/seed/handbag/400/400",
        category: "accessories",
        description: "Elegant designer handbag made from genuine leather. Spacious and stylish.",
        sizes: ["One Size"],
        colors: ["Black", "Brown", "Red"],
        rating: 4.7,
        reviews: 78,
        inStock: true
    },
    {
        id: 8,
        name: "Luxury Watch",
        price: 299.99,
        originalPrice: 399.99,
        image: "https://picsum.photos/seed/watch/400/400",
        category: "accessories",
        description: "Premium luxury watch with stainless steel case and genuine leather strap.",
        sizes: ["One Size"],
        colors: ["Silver", "Gold"],
        rating: 4.9,
        reviews: 34,
        inStock: true
    },
    {
        id: 9,
        name: "Striped Polo Shirt",
        price: 39.99,
        originalPrice: 49.99,
        image: "https://picsum.photos/seed/striped-shirt/400/400",
        category: "shirts",
        description: "Casual striped polo shirt perfect for weekend outings.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Red"],
        rating: 4.2,
        reviews: 52,
        inStock: true
    },
    {
        id: 10,
        name: "Summer Dress",
        price: 69.99,
        originalPrice: 89.99,
        image: "https://picsum.photos/seed/summer-dress/400/400",
        category: "dresses",
        description: "Light and breezy summer dress with floral patterns.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Floral", "Blue"],
        rating: 4.5,
        reviews: 71,
        inStock: true
    },
    {
        id: 11,
        name: "Casual Hoodie",
        price: 49.99,
        originalPrice: 64.99,
        image: "https://picsum.photos/seed/hoodie/400/400",
        category: "hoodies",
        description: "Comfortable casual hoodie perfect for everyday wear.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gray", "Black", "Navy"],
        rating: 4.3,
        reviews: 98,
        inStock: true
    },
    {
        id: 12,
        name: "Winter Coat",
        price: 179.99,
        originalPrice: 229.99,
        image: "https://picsum.photos/seed/winter-coat/400/400",
        category: "jackets",
        description: "Warm winter coat with premium insulation and waterproof material.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray"],
        rating: 4.6,
        reviews: 45,
        inStock: true
    }
];

// Categories for navigation
const categories = [
    { id: "all", name: "All Products", count: products.length },
    { id: "shirts", name: "Shirts", count: products.filter(p => p.category === "shirts").length },
    { id: "pants", name: "Pants", count: products.filter(p => p.category === "pants").length },
    { id: "dresses", name: "Dresses", count: products.filter(p => p.category === "dresses").length },
    { id: "jackets", name: "Jackets", count: products.filter(p => p.category === "jackets").length },
    { id: "shoes", name: "Shoes", count: products.filter(p => p.category === "shoes").length },
    { id: "accessories", name: "Accessories", count: products.filter(p => p.category === "accessories").length },
    { id: "hoodies", name: "Hoodies", count: products.filter(p => p.category === "hoodies").length }
];

// Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(productId, quantity = 1, size = null, color = null) {
        const product = products.find(p => p.id === productId);
        if (!product) return false;

        const existingItem = this.items.find(item =>
            item.id === productId &&
            item.size === size &&
            item.color === color
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: size,
                color: color
            });
        }

        this.saveCart();
        this.updateCartCount();
        return true;
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        cartCountElements.forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline' : 'none';
        });
    }
}

// Initialize cart
const cart = new ShoppingCart();