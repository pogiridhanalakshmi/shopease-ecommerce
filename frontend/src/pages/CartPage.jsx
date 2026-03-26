import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeCartItem } from '../store/cartSlice';
import Spinner from '../components/Spinner';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [user]);

  if (!user) return (
    <div className="container empty-state" style={{ paddingTop: '4rem' }}>
      <ShoppingBag size={60} />
      <h2>Please login to view your cart</h2>
      <Link to="/login" className="btn btn-primary">Login</Link>
    </div>
  );

  if (loading && !cart) return <Spinner />;

  const items = cart?.items || [];

  if (items.length === 0) return (
    <div className="container empty-state" style={{ paddingTop: '4rem' }}>
      <ShoppingBag size={60} />
      <h2>Your cart is empty</h2>
      <p>Discover products and start shopping!</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div>
  );

  const handleQtyChange = async (item, qty) => {
    if (qty < 1) {
      await dispatch(removeCartItem(item.id));
      toast.success('Item removed');
    } else {
      await dispatch(updateCartItem({ item_id: item.id, quantity: qty }));
    }
  };

  const handleRemove = async (item) => {
    await dispatch(removeCartItem(item.id));
    toast.success(`${item.product.name} removed`);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <button className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Continue Shopping
      </button>
      <h1 style={{ marginBottom: '1.5rem' }}>Shopping Cart ({items.length} items)</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} />
                ) : (
                  <div className="product-image-placeholder small"><ShoppingBag size={24} /></div>
                )}
              </div>
              <div className="cart-item-info">
                <Link to={`/products/${item.product.id}`} className="cart-item-name">
                  {item.product.name}
                </Link>
                <span className="cart-item-category">{item.product.category_name}</span>
                <div className="cart-item-controls">
                  <div className="qty-controls">
                    <button onClick={() => handleQtyChange(item, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQtyChange(item, item.quantity + 1)}>+</button>
                  </div>
                  <span className="cart-item-price">₹{Number(item.subtotal).toLocaleString()}</span>
                  <button className="btn-icon danger" onClick={() => handleRemove(item)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{Number(cart.total_price).toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="text-green">FREE</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{Number(cart.total_price).toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', display: 'block', textAlign: 'center' }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
