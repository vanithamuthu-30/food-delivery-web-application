const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'foody_db',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone, address } = req.body;

    // Check if user exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, name, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name',
      [email, hashedPassword, name, phone, address]
    );

    // Generate token
    const token = jwt.sign(
      { id: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.rows[0].id, email: user.rows[0].email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.rows[0].id,
        email: user.rows[0].email,
        name: user.rows[0].name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// PRODUCT ROUTES
// ============================================

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = ${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE ${params.length}`;
    }

    query += ' ORDER BY id ASC';

    const products = await pool.query(query, params);
    res.json(products.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create product (Admin)
app.post('/api/products', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, image, category, spicy_level, portion_size } = req.body;

    const newProduct = await pool.query(
      'INSERT INTO products (name, description, price, image, category, spicy_level, portion_size) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, image, category, spicy_level, portion_size]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// CART ROUTES
// ============================================

// Get user cart
app.get('/api/cart', authenticateToken, async (req, res) => {
  try {
    const cartItems = await pool.query(
      `SELECT c.*, p.name, p.price, p.image, p.description 
       FROM cart c 
       JOIN products p ON c.product_id = p.id 
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    res.json(cartItems.rows);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to cart
app.post('/api/cart', authenticateToken, async (req, res) => {
  try {
    const { product_id, quantity, customizations } = req.body;

    // Check if item already in cart
    const existingItem = await pool.query(
      'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      const updated = await pool.query(
        'UPDATE cart SET quantity = quantity + $1, customizations = $2 WHERE id = $3 RETURNING *',
        [quantity, JSON.stringify(customizations), existingItem.rows[0].id]
      );
      res.json(updated.rows[0]);
    } else {
      // Add new item
      const newItem = await pool.query(
        'INSERT INTO cart (user_id, product_id, quantity, customizations) VALUES ($1, $2, $3, $4) RETURNING *',
        [req.user.id, product_id, quantity, JSON.stringify(customizations)]
      );
      res.status(201).json(newItem.rows[0]);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item
app.put('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const updated = await pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [quantity, id, req.user.id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from cart
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await pool.query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear cart
app.delete('/api/cart', authenticateToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// ORDER ROUTES
// ============================================

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(orders.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get order by ID
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await pool.query(
      'SELECT o.*, oi.* FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id WHERE o.id = $1 AND o.user_id = $2',
      [id, req.user.id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order.rows);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create order
app.post('/api/orders', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { delivery_address, payment_method, items } = req.body;

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      const product = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );
      subtotal += product.rows[0].price * item.quantity;
    }

    const taxes = subtotal * 0.1;
    const delivery_fee = 2.6;
    const total = subtotal + taxes + delivery_fee;

    // Create order
    const newOrder = await client.query(
      `INSERT INTO orders (user_id, total_amount, subtotal, taxes, delivery_fee, delivery_address, payment_method, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.user.id, total, subtotal, taxes, delivery_fee, delivery_address, payment_method, 'pending']
    );

    const orderId = newOrder.rows[0].id;

    // Add order items
    for (const item of items) {
      const product = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );

      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, customizations) 
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, product.rows[0].price, JSON.stringify(item.customizations || {})]
      );
    }

    // Clear user cart
    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Update order status
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await pool.query(
      'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, id, req.user.id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// FAVORITES ROUTES
// ============================================

// Get user favorites
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await pool.query(
      `SELECT f.*, p.name, p.price, p.image, p.description 
       FROM favorites f 
       JOIN products p ON f.product_id = p.id 
       WHERE f.user_id = $1`,
      [req.user.id]
    );

    res.json(favorites.rows);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add to favorites
app.post('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.body;

    // Check if already favorited
    const existing = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    const newFavorite = await pool.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, product_id]
    );

    res.status(201).json(newFavorite.rows[0]);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove from favorites
app.delete('/api/favorites/:product_id', authenticateToken, async (req, res) => {
  try {
    const { product_id } = req.params;

    const deleted = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [req.user.id, product_id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// USER PROFILE ROUTES
// ============================================

// Get user profile
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, name, phone, address, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updated = await pool.query(
      'UPDATE users SET name = $1, phone = $2, address = $3 WHERE id = $4 RETURNING id, email, name, phone, address',
      [name, phone, address, req.user.id]
    );

    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// SUPPORT ROUTES
// ============================================

// Get support messages
app.get('/api/support/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await pool.query(
      'SELECT * FROM support_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [req.user.id]
    );

    res.json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send support message
app.post('/api/support/messages', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    const newMessage = await pool.query(
      'INSERT INTO support_messages (user_id, message, sender) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, message, 'user']
    );

    res.status(201).json(newMessage.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});