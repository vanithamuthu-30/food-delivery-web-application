import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import { ORDER_STATUS_LABELS } from '../utils/constants';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { orders, loading, error } = useOrders();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      on_the_way: 'success',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
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

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <button 
            className="btn btn-light rounded-circle me-3"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft size={20} />
          </button>
          <h4 className="mb-0 fw-bold">Order History</h4>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <Package size={60} className="text-muted mb-3" />
            <h5>No orders yet</h5>
            <p className="text-muted">Start ordering delicious food!</p>
            <button 
              className="btn btn-danger mt-3"
              onClick={() => navigate('/home')}
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.id} className="card mb-3 border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="mb-1 fw-bold">Order #{order.id}</h6>
                      <small className="text-muted">
                        {formatDate(order.created_at)} at {formatTime(order.created_at)}
                      </small>
                    </div>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1"><strong>Total:</strong> {formatCurrency(order.total_amount)}</p>
                      <p className="mb-0 text-muted small">
                        {order.payment_method.replace('_', ' ').toUpperCase()}
                      </p>
                    </div>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                    </button>
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

export default OrderHistory;
