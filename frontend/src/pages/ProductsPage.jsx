import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    min_price: '',
    max_price: '',
  });

  useEffect(() => {
    productAPI.categories().then((r) => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;

    productAPI.list(params).then((r) => {
      setProducts(r.data);
    }).finally(() => setLoading(false));
  }, [filters]);

  const handleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>All Products</h1>

      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <SlidersHorizontal size={18} />
            <h3>Filters</h3>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={filters.category} onChange={(e) => handleFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Min Price (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.min_price}
              onChange={(e) => handleFilter('min_price', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input
              type="number"
              placeholder="100000"
              value={filters.max_price}
              onChange={(e) => handleFilter('max_price', e.target.value)}
            />
          </div>

          <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => setFilters({ search: '', category: '', min_price: '', max_price: '' })}>
            Clear Filters
          </button>
        </aside>

        {/* Products */}
        <div className="products-main">
          {/* Search */}
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          {loading ? <Spinner /> : (
            <>
              <p className="results-count">{products.length} products found</p>
              {products.length === 0 ? (
                <div className="empty-state">
                  <p>No products found. Try adjusting your filters.</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
