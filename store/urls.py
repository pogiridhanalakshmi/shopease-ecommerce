from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView,
    CategoryListView, ProductListView, ProductDetailView,
    CartView, CartItemView,
    OrderListView, OrderDetailView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),

    path('categories/', CategoryListView.as_view(), name='category-list'),

    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    path('cart/', CartView.as_view(), name='cart'),
    path('cart/items/<int:item_id>/', CartItemView.as_view(), name='cart-item'),

    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]
