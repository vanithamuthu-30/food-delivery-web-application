import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigate('/home');
      } else {
        navigate('/login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div 
      style={{
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Foodgo
      </h1>
      <img 
        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" 
        alt="Burger"
        style={{ 
          width: '300px', 
          borderRadius: '20px', 
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)' 
        }}
      />
      <div className="spinner-border text-white mt-4" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default SplashScreen;