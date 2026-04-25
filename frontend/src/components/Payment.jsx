import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = getCartTotal();
  const taxes = subtotal * 0.1;
  const deliveryFee = 2.6;
  const total = subtotal + taxes + deliveryFee;

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const orderData = {
        delivery_address: user.address || '123 Main St',
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          customizations: item.customizations
        }))
      };

      await axios.post('http://localhost:5000/api/orders', orderData);
      
      setShowSuccess(true);
      await clearCart();
      
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/home');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-light rounded-circle me-3"
            onClick={() => navigate('/cart')}
          >
            <ArrowLeft size={20} />
          </button>
          <h4 className="mb-0 fw-bold">Payment</h4>
        </div>

        {/* Order Summary */}
        <h5 className="fw-bold mb-3">Order summary</h5>
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Delivery fees</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <small className="text-muted">Estimated delivery time</small>
          <p className="fw-bold">25 min</p>
        </div>

        {/* Payment Methods */}
        <h5 className="fw-bold mb-3">Payment methods</h5>

        <div 
          className="card mb-3 border-0 shadow-sm" 
          style={{ 
            borderRadius: '15px', 
            backgroundColor: paymentMethod === 'credit_card' ? '#2d2d2d' : 'white',
            color: paymentMethod === 'credit_card' ? 'white' : 'black',
            cursor: 'pointer'
          }}
          onClick={() => setPaymentMethod('credit_card')}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div style={{ 
                width: '40px', 
                height: '30px', 
                background: 'linear-gradient(to right, #ff6b6b, #ffa500)',
                borderRadius: '5px'
              }}></div>
              <div>
                <div className="fw-bold">Credit card</div>
                <small>**** **** **** 4921</small>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              checked={paymentMethod === 'credit_card'}
              onChange={() => setPaymentMethod('credit_card')}
            />
          </div>
        </div>

        <div 
          className="card mb-3 border shadow-sm" 
          style={{ borderRadius: '15px', cursor: 'pointer' }}
          onClick={() => setPaymentMethod('debit_card')}
        >
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <div style={{ fontSize: '1.5rem' }}>💳</div>
              <div>
                <div className="fw-bold">Debit card</div>
                <small>**** **** **** 8765</small>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              checked={paymentMethod === 'debit_card'}
              onChange={() => setPaymentMethod('debit_card')}
            />
          </div>
        </div>

        <div className="form-check mb-4">
          <input className="form-check-input" type="checkbox" id="saveCard" />
          <label className="form-check-label" htmlFor="saveCard">
            Save card details for future payment
          </label>
        </div>

        <button 
          className="btn btn-dark w-100 py-3 rounded-3 mb-2"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay now'}
        </button>
        
        <div className="text-center">
          <h5 className="fw-bold">${total.toFixed(2)}</h5>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div className="bg-white p-5 rounded-4 text-center" style={{ maxWidth: '400px' }}>
            <div 
              className="mx-auto mb-4 d-flex justify-content-center align-items-center"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#ff6b6b'
              }}
            >
              <Check size={40} color="white" />
            </div>
            <h3 className="fw-bold mb-3">Success !</h3>
            <p className="text-muted mb-4">
              Your payment has successfully been completed. You will receive a notification with updates and your order will be delivered to your address.
            </p>
            <button 
              className="btn btn-danger px-5 py-2 rounded-3"
              onClick={() => {
                setShowSuccess(false);
                navigate('/home');
              }}
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
