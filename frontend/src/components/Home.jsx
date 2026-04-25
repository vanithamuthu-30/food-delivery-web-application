import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Heart } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchFavorites();
  }, [category, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products', {
        params: { category, search: searchQuery }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      setFavorites(response.data.map(f => f.product_id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (productId) => {
    try {
      if (favorites.includes(productId)) {
        await axios.delete(`http://localhost:5000/api/favorites/${productId}`);
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        await axios.post('http://localhost:5000/api/favorites', { product_id: productId });
        setFavorites([...favorites, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: 0 }}>Foodgo</h2>
            <small className="text-muted">Order your favorite food</small>
          </div>
          <div className="position-relative" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
            <User size={40} style={{ color: '#ff6b6b' }} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="position-relative mb-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px', borderRadius: '15px', border: '1px solid #ddd' }}
          />
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }} />
          <button 
            className="btn btn-danger position-absolute end-0 top-0 m-1"
            style={{ borderRadius: '12px' }}
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-white text-danger">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="d-flex gap-2 mb-4 overflow-auto">
          <button 
            className={`btn ${category === 'all' ? 'btn-danger' : 'btn-light'} rounded-pill px-4`}
            onClick={() => setCategory('all')}
          >
            All
          </button>
          <button 
            className={`btn ${category === 'burgers' ? 'btn-danger' : 'btn-light'} rounded-pill px-4`}
            onClick={() => setCategory('burgers')}
          >
            Burgers
          </button>
          <button 
            className={`btn ${category === 'combos' ? 'btn-danger' : 'btn-light'} rounded-pill px-4`}
            onClick={() => setCategory('combos')}
          >
            Combos
          </button>
          <button 
            className={`btn ${category === 'sides' ? 'btn-danger' : 'btn-light'} rounded-pill px-4`}
            onClick={() => setCategory('sides')}
          >
            Sides
          </button>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            {products.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <div 
                  className="card h-100 border-0 shadow-sm" 
                  style={{ borderRadius: '15px', cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ borderRadius: '15px 15px 0 0', height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h6 className="card-title" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {product.name}
                    </h6>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>${product.price}</span>
                      <Heart 
                        size={20} 
                        fill={favorites.includes(product.id) ? '#ff6b6b' : 'none'}
                        color="#ff6b6b"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;