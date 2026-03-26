from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Category, Product, Cart, CartItem, Order, OrderItem
from .serializers import (
    UserSerializer, RegisterSerializer, CategorySerializer,
    ProductSerializer, CartSerializer, CartItemSerializer, OrderSerializer
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Product.objects.filter(is_available=True).select_related('category')
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_available=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        product = get_object_or_404(Product, id=product_id, is_available=True)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def delete(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = int(request.data.get('quantity', 1))
        if quantity <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        item.delete()
        serializer = CartSerializer(cart)
        return Response(serializer.data)


class OrderListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).prefetch_related('items__product').order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        cart_items = cart.items.select_related('product').all()

        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        shipping_address = request.data.get('shipping_address', '')
        if not shipping_address:
            return Response({'error': 'Shipping address is required'}, status=status.HTTP_400_BAD_REQUEST)

        total = sum(item.subtotal for item in cart_items)
        order = Order.objects.create(
            user=request.user,
            total_amount=total,
            shipping_address=shipping_address,
            status='pending',
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
            )
            item.product.stock = max(0, item.product.stock - item.quantity)
            item.product.save()

        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')
