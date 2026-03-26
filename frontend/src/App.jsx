import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { fetchProfile } from './store/authSlice';
import { fetchCart } from './store/cartSlice';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function AppInner() {
  const dispatch = useDispatch();
  const { user, initialized } = useSelector((s) => s.auth);

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      dispatch(fetchProfile());
    } else {
      dispatch({ type: 'auth/profile/rejected' });
    }
  }, []);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user]);

  if (!initialized && localStorage.getItem('access_token')) return null;

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
