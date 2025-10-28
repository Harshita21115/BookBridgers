import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
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

    const result = await register(formData);
    
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
      <h2>Signup</h2>
      <p style={{ color: '#6b7785' }}>Create a new account to start requesting and donating books.</p>
      <div className="row justify-content-center mt-4">
        <div className="col-6">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Your Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="mb-3">
              <label>Role</label>
              <select 
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Choose role</option>
                <option value="student">Student</option>
                <option value="donor">Donor</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Signup'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Signup;
