import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
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
      // Redirect based on user role
      const redirectPath = result.data.user.role === 'admin' ? '/admin' : 
                          result.data.user.role === 'student' ? '/student' : 
                          result.data.user.role === 'donor' ? '/donor' : '/';
      navigate(redirectPath);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <main className="page-wrap my-5">
      <h2>Login</h2>
      <p style={{ color: '#6b7785' }}>Sign in to access your dashboard.</p>
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
                placeholder="you@example.com"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <Link to="/signup" style={{ color: '#6b7785' }}>Create an account</Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
