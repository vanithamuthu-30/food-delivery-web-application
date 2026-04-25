import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/profile', formData);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
        padding: '3rem 2rem',
        borderRadius: '0 0 30px 30px'
      }}>
        <button 
          className="btn btn-light rounded-circle mb-3"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="text-center text-white">
          <img 
            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: '100px', height: '100px', border: '4px solid white' }}
          />
          <h4 className="fw-bold mb-1">{formData.name.split(' ')[0]}</h4>
          <h5 className="mb-0">{formData.name}</h5>
        </div>
      </div>

      <div className="container py-4">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ borderRadius: '10px' }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Phone</label>
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
              <label className="form-label fw-bold">Delivery Address</label>
              <textarea
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                style={{ borderRadius: '10px' }}
              />
            </div>

            <div className="d-flex gap-3">
              <button type="submit" className="btn btn-danger flex-grow-1 rounded-pill py-2">
                Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-outline-danger flex-grow-1 rounded-pill py-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-muted mb-2"><strong>Email</strong></p>
            <p>{user?.email}</p>

            <p className="text-muted mb-2 mt-4"><strong>Phone</strong></p>
            <p>{formData.phone || 'Not provided'}</p>

            <p className="text-muted mb-2 mt-4"><strong>Delivery address</strong></p>
            <p>{formData.address || 'Not provided'}</p>

            <hr className="my-4" />

            <div 
              className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/orders')}
            >
              <span className="fw-bold">Order history</span>
              <span>›</span>
            </div>

            <div 
              className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/support')}
            >
              <span className="fw-bold">Customer Support</span>
              <span>›</span>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button 
                className="btn btn-outline-danger flex-grow-1 rounded-pill py-2"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={16} className="me-2" />
                Edit Profile
              </button>
              <button 
                className="btn btn-danger flex-grow-1 rounded-pill py-2"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;