import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../store/authSlice';
import { fetchCart } from '../store/cartSlice';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const res = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(res)) {
      dispatch(fetchCart());
      toast.success('Account created successfully!');
      navigate('/');
    }
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <UserPlus size={32} />
          <h2>Create Account</h2>
          <p>Join ShopEase today</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {typeof error === 'object' ? Object.values(error).flat().join(', ') : error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="John" value={form.first_name} onChange={set('first_name')} />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" value={form.last_name} onChange={set('last_name')} />
            </div>
          </div>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="johndoe" value={form.username} onChange={set('username')} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
