import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productAPI.list({ page_size: 8 }),
      productAPI.categories(),
    ]).then(([prodRes, catRes]) => {
      setFeatured(prodRes.data.slice(0, 8));
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <h1>Shop the Latest Trends</h1>
          <p>Discover thousands of products at unbeatable prices. Quality you can trust, delivered to your door.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container features-grid">
          <div className="feature-item">
            <Truck size={36} />
            <h3>Free Shipping</h3>
            <p>On orders above ₹999</p>
          </div>
          <div className="feature-item">
            <ShieldCheck size={36} />
            <h3>Secure Payment</h3>
            <p>100% secure transactions</p>
          </div>
          <div className="feature-item">
            <RefreshCw size={36} />
            <h3>Easy Returns</h3>
            <p>30-day return policy</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`} className="category-card">
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="btn btn-outline">View All</Link>
          </div>
          {loading ? <Spinner /> : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
