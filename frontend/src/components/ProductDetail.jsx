import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spicyLevel, setSpicyLevel] = useState(3);
  const [portionSize, setPortionSize] = useState(2);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setSpicyLevel(response.data.spicy_level || 3);
      setPortionSize(response.data.portion_size || 2);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product, quantity, {
      spicy_level: spicyLevel,
      portion_size: portionSize
    });
    
    if (result.success) {
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container py-5"><h3>Product not found</h3></div>;
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div style={{ position: 'relative' }}>
        <button 
          className="btn btn-light position-absolute top-0 start-0 m-3 rounded-circle"
          onClick={() => navigate('/home')}
          style={{ width: '40px', height: '40px', zIndex: 10 }}
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle"
          style={{ width: '40px', height: '40px', zIndex: 10 }}
        >
          <Search size={20} />
        </button>
        <img 
          src={product.image} 
          alt={product.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />
      </div>

      <div className="container py-4">
        <h3 style={{ fontWeight: 'bold' }}>{product.name}</h3>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
          {product.description}
        </p>

        {/* Spicy Level */}
        <div className="mt-4">
          <label className="form-label fw-bold">Spicy Level</label>
          <input 
            type="range" 
            className="form-range" 
            min="1" 
            max="5" 
            value={spicyLevel}
            onChange={(e) => setSpicyLevel(parseInt(e.target.value))}
          />
          <div className="d-flex justify-content-between">
            <small>Mild</small>
            <small>Hot</small>
          </div>
        </div>

        {/* Portion Size */}
        <div className="mt-4">
          <label className="form-label fw-bold">Portion Size</label>
          <input 
            type="range" 
            className="form-range" 
            min="1" 
            max="5" 
            value={portionSize}
            onChange={(e) => setPortionSize(parseInt(e.target.value))}
          />
          <div className="d-flex justify-content-between">
            <small>Small</small>
            <small>Large</small>
          </div>
        </div>

        {/* Quantity */}
        <div className="mt-4">
          <label className="form-label fw-bold">Quantity</label>
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-outline-danger"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </button>
            <span className="fw-bold fs-5">{quantity}</span>
            <button 
              className="btn btn-outline-danger"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="row g-3 mt-4">
          <div className="col-6">
            <button 
              className="btn btn-danger w-100 py-3 rounded-3"
              style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
            >
              ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
          <div className="col-6">
            <button 
              className="btn btn-dark w-100 py-3 rounded-3"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;