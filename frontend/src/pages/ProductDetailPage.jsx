import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { productAPI } from '../utils/api';
import { addToCart } from '../store/cartSlice';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowLeft, Star, Package } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    productAPI.detail(id).then((r) => setProduct(r.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    setAdding(true);
    try {
      await dispatch(addToCart({ product_id: product.id, quantity })).unwrap();
      toast.success(`${quantity} × ${product.name} added to cart!`);
    } catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  if (loading) return <Spinner />;
  if (!product) return <div className="container" style={{ paddingTop: '2rem' }}>Product not found.</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <button className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="product-detail">
        <div className="product-detail-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="product-image-placeholder large">
              <Package size={80} />
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-category">{product.category_name}</span>
          <h1>{product.name}</h1>

          <div className="product-rating" style={{ margin: '0.5rem 0' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={18} fill={i <= 4 ? '#f59e0b' : 'none'} color="#f59e0b" />)}
            <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>(128 reviews)</span>
          </div>

          <div className="product-price-large">₹{Number(product.price).toLocaleString()}</div>

          <p className="product-description">{product.description}</p>

          <div className="stock-info">
            <Package size={16} />
            {product.stock > 0 ? (
              <span className="in-stock">{product.stock} in stock</span>
            ) : (
              <span className="out-of-stock">Out of stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary"
            style={{ marginTop: '1.5rem', width: '100%', padding: '0.875rem' }}
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
          >
            <ShoppingCart size={20} />
            {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
