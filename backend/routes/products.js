const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;
    let query = 'SELECT * FROM products WHERE is_available = true';
    const params = [];

    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = ${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE ${params.length} OR description ILIKE ${params.length})`;
    }

    params.push(limit, offset);
    query += ` ORDER BY id ASC LIMIT ${params.length - 1} OFFSET ${params.length}`;

    const products = await pool.query(query, params);
    res.json(products.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
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

// Create product (Admin only)
router.post('/', authenticateToken, isAdmin, validateProduct, async (req, res) => {
  try {
    const { name, description, price, image, category, spicy_level, portion_size } = req.body;

    const newProduct = await pool.query(
      `INSERT INTO products (name, description, price, image, category, spicy_level, portion_size) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, description, price, image, category, spicy_level, portion_size]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, isAdmin, validateProduct, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category, spicy_level, portion_size, is_available } = req.body;

    const updated = await pool.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, image = $4, 
           category = $5, spicy_level = $6, portion_size = $7, 
           is_available = $8, updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [name, description, price, image, category, spicy_level, portion_size, is_available, id]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete - just mark as unavailable
    const deleted = await pool.query(
      'UPDATE products SET is_available = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (deleted.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;