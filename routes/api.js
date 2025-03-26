const express = require('express');
const db = require('../database');
const router = express.Router();

// Получение всех товаров
router.get('/products', (req, res) => {
    try {
        let query = 'SELECT * FROM products';
        const params = [];
        
        // Добавьте здесь логику фильтрации и сортировки, если нужно
        // Например:
        if (req.query.category_id) {
            query += ' WHERE category_id = ?';
            params.push(req.query.category_id);
        }
        
        if (req.query.sort) {
            const [field, order] = req.query.sort.split('-');
            if (['price', 'name'].includes(field)) {
                query += ` ORDER BY ${field} ${order === 'desc' ? 'DESC' : 'ASC'}`;
            }
        }
        
        const products = db.prepare(query).all(...params);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение товара по ID
router.get('/products/:id', (req, res) => {
    try {
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const specs = db.prepare('SELECT * FROM product_specifications WHERE product_id = ?').all(req.params.id);
        const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(product.category_id);
        
        res.json({
            ...product,
            specifications: specs,
            category: category
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Получение товаров по категории
router.get('/categories/:id/products', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products WHERE category_id = ?').all(req.params.id);
        res.json(products);
    } catch (error) {
        console.error('Error fetching category products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
