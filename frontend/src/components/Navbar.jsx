import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, User, LogOut, Store } from 'lucide-react';
import { logout } from '../store/authSlice';
import { resetCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { cart } = useSelector((s) => s.cart);
  const cartCount = cart?.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <Store size={24} />
          <span>ShopEase</span>
        </Link>
        <div className="navbar-links">
          <Link to="/products" className="nav-link">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="nav-link cart-link">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="nav-link"><User size={20} /> Orders</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
