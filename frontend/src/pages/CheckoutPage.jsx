import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import { fetchCart } from '../store/cartSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { CheckCircle, MapPin } from 'lucide-react';

export default function CheckoutPage() {
  const { cart } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(null);

  if (!user) { navigate('/login'); return null; }

  const items = cart?.items || [];

  if (items.length === 0 && !ordered) return (
    <div className="container empty-state" style={{ paddingTop: '4rem' }}>
      <h2>Your cart is empty</h2>
      <Link to="/products" className="btn btn-primary">Shop Now</Link>
    </div>
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) { toast.error('Please enter shipping address'); return; }
    setLoading(true);
    try {
      const { data } = await orderAPI.create(address);
      setOrdered(data);
      dispatch(fetchCart());
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (ordered) return (
    <div className="container empty-state" style={{ paddingTop: '4rem' }}>
      <CheckCircle size={70} color="#22c55e" />
      <h2>Order Placed Successfully!</h2>
      <p>Your order <strong>#{ordered.id}</strong> has been confirmed.</p>
      <p>Total: <strong>₹{Number(ordered.total_amount).toLocaleString()}</strong></p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/orders" className="btn btn-primary">View My Orders</Link>
        <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Checkout</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-section">
            <h3><MapPin size={18} /> Shipping Address</h3>
            <textarea
              rows={4}
              placeholder="Enter your full shipping address&#10;e.g. 123 MG Road, Koramangala, Bangalore 560001"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="form-section">
            <h3>Payment</h3>
            <div className="payment-mock">
              <div className="payment-option selected">
                <span>💳 Pay on Delivery (Mock)</span>
                <span className="badge">Demo</span>
              </div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              This is a demo project. No real payment is processed.
            </p>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}>
            {loading ? 'Placing Order...' : `Place Order · ₹${Number(cart?.total_price || 0).toLocaleString()}`}
          </button>
        </form>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="checkout-item">
              <span className="checkout-item-name">{item.product.name} × {item.quantity}</span>
              <span>₹{Number(item.subtotal).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{Number(cart?.total_price || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
