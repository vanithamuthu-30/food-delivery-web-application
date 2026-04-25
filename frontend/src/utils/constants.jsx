export const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'combos', name: 'Combos' },
  { id: 'sides', name: 'Sides' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' }
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '💰' },
  { id: 'cash', name: 'Cash on Delivery', icon: '💵' }
];

export const SPICY_LEVELS = {
  1: 'Mild',
  2: 'Medium',
  3: 'Spicy',
  4: 'Very Spicy',
  5: 'Extremely Hot'
};

export const PORTION_SIZES = {
  1: 'Small',
  2: 'Regular',
  3: 'Large',
  4: 'Extra Large',
  5: 'Family Size'
};

export const TAX_RATE = 0.1; // 10%
export const DELIVERY_FEE = 2.60;
export const ESTIMATED_DELIVERY_TIME = 25; // minutes