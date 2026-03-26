import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import Spinner from '../components/Spinner';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

export default function OrdersPage() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.list().then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">
          <Package size={60} />
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here.</p>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div className="order-meta">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="order-right">
                  <span className="order-amount">₹{Number(order.total_amount).toLocaleString()}</span>
                  <span className="order-status" style={{ color: STATUS_COLORS[order.status] }}>
                    ● {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="order-details">
                  <div className="order-address">
                    <strong>Shipping to:</strong> {order.shipping_address}
                  </div>
                  <div className="order-items-list">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item">
                        <span>{item.product_name}</span>
                        <span>× {item.quantity}</span>
                        <span>₹{Number(item.subtotal).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
