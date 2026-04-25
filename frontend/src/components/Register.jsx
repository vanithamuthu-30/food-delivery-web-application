import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4">
                <h2 className="text-center mb-4" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                  Foodgo
                </h2>
                <h5 className="text-center mb-4">Create Account</h5>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Delivery Address</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger w-100 py-2 mb-3"
                    style={{ borderRadius: '10px' }}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>

                  <p className="text-center mb-0">
                    Already have an account? {' '}
                    <Link to="/login" style={{ color: '#ff6b6b', textDecoration: 'none' }}>
                      Login
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;