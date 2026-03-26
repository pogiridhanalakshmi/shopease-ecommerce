<div align="center">

# 🛍️ ShopEase

### A Full Stack E-Commerce Platform

**Django REST Framework** • **React 19** • **Redux Toolkit** • **JWT Auth** • **SQLite**

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?style=flat&logo=django&logoColor=white)](https://djangoproject.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat&logo=redux&logoColor=white)](https://redux-toolkit.js.org)

</div>

---

## 📌 Overview

ShopEase is a fully functional e-commerce web application with a clean, modern UI. It supports user authentication, product browsing with filters, a persistent shopping cart, order placement, and an admin dashboard — all built from scratch without any UI framework.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Authentication | Register / Login with JWT (access + refresh tokens) |
| 🛒 Shopping Cart | Add, update, remove items — persisted per user |
| 📦 Product Catalog | 12 sample products across 5 categories |
| 🔍 Search & Filter | Filter by category, price range, keyword search |
| 💳 Checkout | Shipping address form + mock payment flow |
| 📋 Order History | View past orders with expandable item details |
| ⚙️ Admin Panel | Django admin to manage products, categories, orders |
| 📱 Responsive UI | Mobile-friendly layout, works on all screen sizes |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.12+** / **Django 6.0**
- **Django REST Framework** — API endpoints
- **djangorestframework-simplejwt** — JWT authentication
- **django-cors-headers** — Cross-origin requests
- **Pillow** — Image handling
- **SQLite** — Database

### Frontend
- **React 19** + **Vite 8**
- **Redux Toolkit** — Global state (auth, cart)
- **React Router v6** — Client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Lucide React** — Icons
- **React Hot Toast** — Notifications
- **Custom CSS** — No UI framework, hand-crafted styles

---

## 📁 Project Structure

```
shopease-ecommerce/
│
├── backend/                  # Django project config
│   ├── settings.py           # App settings, JWT config, CORS
│   └── urls.py               # Root URL routing
│
├── store/                    # Main Django app
│   ├── models.py             # Category, Product, Cart, CartItem, Order, OrderItem
│   ├── serializers.py        # DRF serializers (nested, read-only fields)
│   ├── views.py              # API views (class-based)
│   ├── urls.py               # API URL patterns
│   └── admin.py              # Admin panel registration
│
├── frontend/                 # React + Vite app
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx    # Sticky nav with cart badge
│       │   ├── ProductCard.jsx
│       │   └── Spinner.jsx
│       ├── pages/
│       │   ├── HomePage.jsx        # Hero, categories, featured products
│       │   ├── ProductsPage.jsx    # Catalog with filters sidebar
│       │   ├── ProductDetailPage.jsx
│       │   ├── CartPage.jsx
│       │   ├── CheckoutPage.jsx
│       │   ├── OrdersPage.jsx
│       │   ├── LoginPage.jsx
│       │   └── RegisterPage.jsx
│       ├── store/
│       │   ├── authSlice.js        # Redux auth state
│       │   ├── cartSlice.js        # Redux cart state
│       │   └── index.js
│       └── utils/
│           └── api.js              # Axios instance + all API calls
│
├── manage.py
├── seed_data.py              # Seeds 12 products, 5 categories, 2 users
├── requirements.txt
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/pogiridhanalakshmi/shopease-ecommerce.git
cd shopease-ecommerce
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Mac / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Seed sample data (products, categories, users)
python seed_data.py

# Start the backend server
python manage.py runserver
```

Backend runs at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

### 3. Frontend Setup

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Demo Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| 👑 Admin | `admin` | `admin123` | Django admin panel + full API |
| 👤 Demo User | `demo` | `demo123` | Full shopping experience |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register/` | ❌ | Register new user |
| `POST` | `/api/auth/login/` | ❌ | Login, returns JWT tokens |
| `GET` | `/api/auth/profile/` | ✅ | Get logged-in user profile |

### Products & Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/categories/` | ❌ | List all categories |
| `GET` | `/api/products/` | ❌ | List products (filter: `?search=`, `?category=`, `?min_price=`, `?max_price=`) |
| `GET` | `/api/products/:id/` | ❌ | Product detail |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/cart/` | ✅ | View cart with items |
| `POST` | `/api/cart/` | ✅ | Add item (`product_id`, `quantity`) |
| `PUT` | `/api/cart/items/:id/` | ✅ | Update item quantity |
| `DELETE` | `/api/cart/items/:id/` | ✅ | Remove item |
| `DELETE` | `/api/cart/` | ✅ | Clear entire cart |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/orders/` | ✅ | List user's orders |
| `POST` | `/api/orders/` | ✅ | Place order from cart |
| `GET` | `/api/orders/:id/` | ✅ | Order detail with items |

---

## 🗃️ Data Models

```
User ──────────── Cart ──── CartItem ──── Product ──── Category
  │                                           │
  └─────────────── Order ── OrderItem ────────┘
```

**Order statuses:** `pending` → `processing` → `shipped` → `delivered` / `cancelled`

---

## 🏗️ Architecture

```
React Frontend (Port 5173)
        │
        │  HTTP / JSON (Axios)
        ▼
Django REST API (Port 8000)
        │
        │  ORM Queries
        ▼
    SQLite DB
```

- JWT tokens stored in `localStorage`, auto-attached via Axios interceptor
- Refresh token rotation on 401 responses
- CORS enabled for local development

---

## 📸 Pages

- **Home** — Hero banner, feature highlights, category grid, featured products
- **Products** — Filterable catalog with search + sidebar filters
- **Product Detail** — Image, description, quantity selector, add to cart
- **Cart** — Item list with quantity controls, order summary
- **Checkout** — Shipping form, mock payment, success screen
- **Orders** — Expandable order history with status badges
- **Login / Register** — Clean auth forms with demo credentials hint

---

<div align="center">

Built with ❤️ as a portfolio project | Python Full Stack Developer

</div>
