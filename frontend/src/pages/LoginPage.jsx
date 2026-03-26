import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../store/authSlice';
import { fetchCart } from '../store/cartSlice';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(res)) {
      dispatch(fetchCart());
      toast.success(`Welcome back, ${res.payload.first_name || res.payload.username}!`);
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <LogIn size={32} />
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="alert alert-error">{typeof error === 'string' ? error : 'Login failed'}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-demo">
          <p>Demo credentials: <strong>demo</strong> / <strong>demo123</strong></p>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
