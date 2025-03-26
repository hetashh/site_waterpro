const express = require('express');
const path = require('path');
const db = require('./database');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Проверка соединения с БД
app.get('/api/db-check', (req, res) => {
    try {
        const testQuery = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        res.json({
            status: 'OK',
            tables: testQuery.map(t => t.name),
            productsCount: db.prepare("SELECT COUNT(*) as count FROM products").get().count
        });
    } catch (error) {
        res.status(500).json({ error: 'DB connection failed', details: error.message });
    }
});

app.get('/api/products/debug', (req, res) => {
    try {
        const data = {
            tables: db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all(),
            products: db.prepare("SELECT id, name, price FROM products LIMIT 3").all(),
            dbPath: path.join(__dirname, 'data', 'waterpro.db')
        };
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение рекомендуемых товаров (исправленная версия)
app.get('/api/products/featured', (req, res) => {
    try {
        console.log('Fetching featured products...'); // Логирование
        
        const query = `
            SELECT 
                p.id,
                p.name,
                p.description,
                p.price,
                p.image_path,
                p.created_at,
                c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT 3
        `;
        
        console.log('Executing query:', query); // Логирование
        
        const products = db.prepare(query).all();
        console.log('Found products:', products); // Логирование
        
        if (!products || products.length === 0) {
            return res.status(404).json({ 
                error: 'No featured products',
                suggestion: 'Add products to the database'
            });
        }
        
        // Добавляем характеристики для каждого товара
        const enrichedProducts = products.map(product => {
            const specs = db.prepare(`
                SELECT spec_name, spec_value 
                FROM product_specifications 
                WHERE product_id = ?
            `).all(product.id);
            
            return {
                ...product,
                specifications: specs,
                image_url: product.image_path 
                    ? `${req.protocol}://${req.get('host')}/${product.image_path}`
                    : null
            };
        });
        
        res.json(enrichedProducts);
    } catch (error) {
        console.error('Error in /api/products/featured:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

app.get('/api/products', (req, res) => {
    console.log('GET /api/products', req.query); // Логирование запроса
    try {
        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        
        const params = [];
        
        if (req.query.category_id) {
            query += ' AND p.category_id = ?';
            params.push(req.query.category_id);
        }
        
        if (req.query.price_range) {
            const [min, max] = req.query.price_range.split('-');
            if (min && max) {
                query += ' AND p.price BETWEEN ? AND ?';
                params.push(min, max);
            }
        }
        
        if (req.query.sort) {
            const [field, order] = req.query.sort.split('-');
            if (['price', 'name'].includes(field) && ['asc', 'desc'].includes(order)) {
                query += ` ORDER BY p.${field} ${order.toUpperCase()}`;
            }
        }
        
        console.log('Executing query:', query, params); // Логирование SQL
        const products = db.prepare(query).all(...params);
        
        res.json(products);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        console.log(`Fetching product with ID: ${req.params.id}`);
        
        const product = db.prepare(`
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `).get(req.params.id);

        if (!product) {
            return res.status(404).json({ 
                error: 'Product not found',
                availableIds: db.prepare("SELECT id FROM products").all().map(p => p.id)
            });
        }

        // Получаем характеристики товара
        const specs = db.prepare(`
            SELECT spec_name, spec_value 
            FROM product_specifications 
            WHERE product_id = ?
        `).all(req.params.id);

        res.json({
            ...product,
            specifications: specs
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            details: error.message
        });
    }
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
  }));

// Запуск сервера с улучшенной обработкой ошибок
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Тестовый запрос к БД при старте
    try {
        const test = db.prepare("SELECT COUNT(*) as count FROM products").get();
        console.log(`Database connection OK. Products in DB: ${test.count}`);
    } catch (error) {
        console.error('Database connection FAILED:', error);
    }
});


console.log('Database file:', path.join(__dirname, 'data', 'waterpro.db'));
console.log('Tables:', db.prepare("SELECT name FROM sqlite_master").all());
