import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Star } from 'lucide-react';
import { addToCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await dispatch(addToCart({ product_id: product.id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">
            <ShoppingCart size={40} />
          </div>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category_name}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {[1,2,3,4,5].map(i => <Star key={i} size={14} fill={i <= 4 ? '#f59e0b' : 'none'} color="#f59e0b" />)}
        </div>
        <div className="product-footer">
          <span className="product-price">₹{Number(product.price).toLocaleString()}</span>
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <span className="low-stock">Only {product.stock} left!</span>
        )}
      </div>
    </Link>
  );
}
