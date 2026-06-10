# Nostra - Full-Stack E-Commerce Application

A modern, full-stack e-commerce web application built with **React (Vite)**, **Node.js/Express**, and **MongoDB**.

## Features

- **User Authentication** - JWT-based login/signup with role-based access (user/admin)
- **Product Catalog** - Browse, filter, sort, and search products by category
- **Shopping Cart** - Add/remove items, update quantities, persisted in database
- **Checkout & Orders** - Complete purchases, view order history
- **Wishlist** - Save favorite products
- **Contact Form** - Submit inquiries stored in database
- **Newsletter** - Email subscription management
- **Admin Dashboard** - Full CRUD for products, user management, order status updates, contact messages, and analytics

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |

## Project Structure

```
Nostra/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, CartContext
│   │   ├── pages/          # Route pages (Home, Collection, Cart, etc.)
│   │   ├── services/       # API client
│   │   ├── App.jsx         # Router + global modals
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Styles
│   ├── index.html
│   ├── vite.config.js      # Dev server with API proxy
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # MongoDB connection
│   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   ├── controllers/        # Request handlers
│   ├── routes/             # API route definitions
│   ├── middleware/         # JWT auth middleware
│   ├── seeders/            # Database seed script
│   ├── .env                # Environment variables
│   ├── server.js           # Express entry point
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (running locally or MongoDB Atlas)

## Getting Started

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Configure Environment

Edit `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nostra
JWT_SECRET=nostra_super_secret_jwt_key_2024_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB

```bash
mongod --dbpath /tmp/mongo-data
```

Or use MongoDB Atlas and update `MONGODB_URI` in `.env`.

### 4. Seed Database (first time only)

```bash
cd server && node seeders/seed.js
```

This creates 12 products and an admin user.

### 5. Run the Application

**Development** - Run both servers:

```bash
# Terminal 1: Backend API (port 5000)
cd server && npm run dev

# Terminal 2: React Frontend (port 3000)
cd client && npm run dev
```

Open `http://localhost:3000` in your browser.

**Production** - Build frontend, then start backend:

```bash
cd client && npm run build
cd ../server && NODE_ENV=production npm start
```

The backend serves the built React app on port 5000.

## Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@nostra.com | admin123 |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |
| PUT | `/api/auth/profile` | Update profile (protected) |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (with filters: category, sort, search, price) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get user's cart |
| POST | `/api/cart/add` | Add item to cart |
| PUT | `/api/cart/:productId` | Update cart item |
| DELETE | `/api/cart/:productId` | Remove item from cart |
| DELETE | `/api/cart` | Clear cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order from cart |
| GET | `/api/orders/my-orders` | Get user's orders |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Wishlist
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/wishlist` | Get user's wishlist |
| POST | `/api/wishlist/add` | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Remove from wishlist |

### Other
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Submit contact message |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |
| GET | `/api/admin/stats` | Dashboard statistics (admin) |
| GET | `/api/admin/users` | List users (admin) |
| GET | `/api/contact` | List contact messages (admin) |

## License

MIT
