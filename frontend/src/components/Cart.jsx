import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart, getCartTotal, loading } = useCart();

  const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      await updateCartItem(itemId, newQuantity);
    }
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
  };

  const subtotal = getCartTotal();
  const taxes = subtotal * 0.1;
  const deliveryFee = 2.6;
  const total = subtotal + taxes + deliveryFee;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-light rounded-circle me-3"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft size={20} />
          </button>
          <h4 className="mb-0 fw-bold">Shopping Cart</h4>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <h5>Your cart is empty</h5>
            <button 
              className="btn btn-danger mt-3"
              onClick={() => navigate('/home')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="mb-4">
              {cart.map((item) => (
                <div key={item.id} className="card mb-3 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ height: '80px', objectFit: 'cover' }}
                        />
                      </div>
                      <div className="col-6">
                        <h6 className="mb-1 fw-bold">{item.name}</h6>
                        <p className="mb-1 text-danger fw-bold">${item.price}</p>
                      </div>
                      <div className="col-3">
                        <div className="d-flex flex-column align-items-end">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <button 
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              style={{ width: '30px', height: '30px', padding: 0 }}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="fw-bold">{item.quantity}</span>
                            <button 
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              style={{ width: '30px', height: '30px', padding: 0 }}
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button 
                            className="btn btn-sm text-danger"
                            onClick={() => handleRemove(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Taxes</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-danger">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button 
              className="btn btn-danger w-100 py-3 rounded-3 mt-4"
              onClick={() => navigate('/payment')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;