# ShopEase - Full Stack E-Commerce Platform

A full-stack e-commerce web application built with **Django REST Framework** (backend) and **React + Vite** (frontend).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, Django 6, Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite |
| Frontend | React 19, Vite, Redux Toolkit |
| Styling | Custom CSS (no framework) |
| HTTP Client | Axios |

## Features

- User registration & login with JWT authentication
- Browse products with search & category/price filters
- Product detail pages
- Add/remove/update items in cart (per-user)
- Checkout with shipping address
- Order history with status tracking
- Django Admin panel for managing products, orders
- Responsive design (mobile-friendly)
- Sample data seed script (12 products, 5 categories)

## Project Structure

```
ecommerce_project/
├── backend/          # Django project settings
├── store/            # Django app (models, views, serializers, urls)
├── venv/             # Python virtual environment
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/   # Navbar, ProductCard, Spinner
│       ├── pages/        # All page components
│       ├── store/        # Redux slices (auth, cart)
│       └── utils/        # Axios API client
├── manage.py
├── seed_data.py      # Sample data seed script
└── requirements.txt
```

## Setup & Run

### Backend

```bash
# 1. Navigate to project folder
cd ecommerce_project

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# 3. Run migrations (already done)
python manage.py migrate

# 4. Seed sample data (already done)
python seed_data.py

# 5. Start backend server
python manage.py runserver
# Backend runs at: http://localhost:8000
# Admin panel: http://localhost:8000/admin
```

### Frontend

```bash
# In a new terminal
cd ecommerce_project/frontend
npm install
npm run dev
# Frontend runs at: http://localhost:5173
```

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Demo User | demo | demo123 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register/ | Register user |
| POST | /api/auth/login/ | Login |
| GET | /api/auth/profile/ | Get profile |
| GET | /api/products/ | List products (supports ?search=, ?category=, ?min_price=, ?max_price=) |
| GET | /api/products/:id/ | Product detail |
| GET | /api/categories/ | List categories |
| GET | /api/cart/ | View cart |
| POST | /api/cart/ | Add item to cart |
| PUT | /api/cart/items/:id/ | Update cart item |
| DELETE | /api/cart/items/:id/ | Remove cart item |
| GET | /api/orders/ | List user orders |
| POST | /api/orders/ | Place order |
| GET | /api/orders/:id/ | Order detail |
