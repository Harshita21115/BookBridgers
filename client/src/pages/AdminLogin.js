import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      // Check if user is admin
      if (result.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('You do not have admin privileges');
        logout();
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <main className="page-wrap my-5">
      <h2>Admin Login</h2>
      <p style={{ color: '#6b7785' }}>Sign in with your admin credentials to manage requests and users.</p>
      <p style={{ color: '#6b7785', fontSize: '0.9rem' }}>Note: Use an account with admin role to access this page.</p>
      <div className="row justify-content-center mt-4">
        <div className="col-6">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
            <div className="links">
              <Link to="/login">Back to User Login</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;


