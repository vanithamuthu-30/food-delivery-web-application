import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
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
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
              <div className="card-body p-4">
                <h2 className="text-center mb-4" style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                  Foodgo
                </h2>
                <h5 className="text-center mb-4">Welcome Back!</h5>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger w-100 py-2 mb-3"
                    style={{ borderRadius: '10px' }}
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <p className="text-center mb-0">
                    Don't have an account? {' '}
                    <Link to="/register" style={{ color: '#ff6b6b', textDecoration: 'none' }}>
                      Register
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

export default Login;