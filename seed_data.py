import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Category, Product, Cart

print("Seeding database...")

# Create superuser
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print("Created superuser: admin / admin123")

# Create demo user
if not User.objects.filter(username='demo').exists():
    demo = User.objects.create_user('demo', 'demo@example.com', 'demo123', first_name='Demo', last_name='User')
    Cart.objects.get_or_create(user=demo)
    print("Created demo user: demo / demo123")

# Create categories
categories_data = [
    {'name': 'Electronics', 'slug': 'electronics', 'description': 'Gadgets and electronic devices'},
    {'name': 'Clothing', 'slug': 'clothing', 'description': 'Fashion and apparel'},
    {'name': 'Books', 'slug': 'books', 'description': 'Books and literature'},
    {'name': 'Home & Kitchen', 'slug': 'home-kitchen', 'description': 'Home essentials and kitchen items'},
    {'name': 'Sports', 'slug': 'sports', 'description': 'Sports equipment and accessories'},
]

for cat_data in categories_data:
    Category.objects.get_or_create(slug=cat_data['slug'], defaults=cat_data)

print("Created categories")

# Create products
electronics = Category.objects.get(slug='electronics')
clothing = Category.objects.get(slug='clothing')
books = Category.objects.get(slug='books')
home = Category.objects.get(slug='home-kitchen')
sports = Category.objects.get(slug='sports')

products_data = [
    {'name': 'Wireless Bluetooth Headphones', 'slug': 'wireless-bluetooth-headphones', 'category': electronics,
     'price': 2999.00, 'stock': 50, 'description': 'Premium wireless headphones with noise cancellation, 30hr battery life and deep bass.'},
    {'name': 'Smartphone 5G Pro', 'slug': 'smartphone-5g-pro', 'category': electronics,
     'price': 45999.00, 'stock': 20, 'description': '6.5" AMOLED display, 108MP camera, 5000mAh battery, 5G enabled.'},
    {'name': 'USB-C Laptop Charger', 'slug': 'usb-c-laptop-charger', 'category': electronics,
     'price': 1499.00, 'stock': 100, 'description': '65W fast charging USB-C charger compatible with most laptops.'},
    {'name': 'Mechanical Keyboard', 'slug': 'mechanical-keyboard', 'category': electronics,
     'price': 3499.00, 'stock': 35, 'description': 'RGB backlit mechanical keyboard with Cherry MX switches.'},
    {'name': 'Men\'s Casual T-Shirt', 'slug': 'mens-casual-tshirt', 'category': clothing,
     'price': 499.00, 'stock': 200, 'description': '100% cotton comfortable casual t-shirt. Available in multiple colors.'},
    {'name': 'Women\'s Denim Jacket', 'slug': 'womens-denim-jacket', 'category': clothing,
     'price': 1799.00, 'stock': 80, 'description': 'Classic denim jacket with a modern slim fit. Versatile for all seasons.'},
    {'name': 'Running Shoes', 'slug': 'running-shoes', 'category': sports,
     'price': 2499.00, 'stock': 60, 'description': 'Lightweight breathable running shoes with cushioned sole.'},
    {'name': 'Python Programming - Complete Guide', 'slug': 'python-programming-complete-guide', 'category': books,
     'price': 599.00, 'stock': 150, 'description': 'Comprehensive guide to Python programming from beginner to advanced.'},
    {'name': 'The Lean Startup', 'slug': 'the-lean-startup', 'category': books,
     'price': 449.00, 'stock': 75, 'description': 'How constant innovation creates radically successful businesses.'},
    {'name': 'Non-Stick Cookware Set', 'slug': 'non-stick-cookware-set', 'category': home,
     'price': 2199.00, 'stock': 40, 'description': '5-piece non-stick cookware set. Dishwasher safe and heat resistant.'},
    {'name': 'Yoga Mat', 'slug': 'yoga-mat', 'category': sports,
     'price': 899.00, 'stock': 90, 'description': 'Extra thick non-slip yoga mat with carrying strap.'},
    {'name': 'Smart Watch Fitness Tracker', 'slug': 'smart-watch-fitness-tracker', 'category': electronics,
     'price': 4999.00, 'stock': 45, 'description': 'Track heart rate, steps, sleep and receive notifications. 7-day battery.'},
]

for prod_data in products_data:
    Product.objects.get_or_create(slug=prod_data['slug'], defaults=prod_data)

print(f"Created {len(products_data)} products")
print("\nDatabase seeded successfully!")
print("\nLogin credentials:")
print("  Admin panel: http://localhost:8000/admin  ->  admin / admin123")
print("  Demo user:   demo / demo123")
