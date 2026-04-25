/**
 * Calculate order totals
 */
const calculateOrderTotals = (items, products) => {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.product_id);
    return sum + (product.price * item.quantity);
  }, 0);
  
  const taxes = subtotal * 0.1; // 10% tax
  const deliveryFee = 2.60;
  const total = subtotal + taxes + deliveryFee;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    taxes: parseFloat(taxes.toFixed(2)),
    deliveryFee,
    total: parseFloat(total.toFixed(2))
  };
};

/**
 * Generate order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORD-${timestamp}-${random}`;
};

/**
 * Format date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

module.exports = {
  calculateOrderTotals,
  generateOrderNumber,
  formatDate,
  sanitizeInput
};