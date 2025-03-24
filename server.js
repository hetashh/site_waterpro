const express = require('express');
const path = require('path');
const db = require('./database'); // Подключаем БД

const app = express();
const PORT = 3000;

// Middleware для парсинга JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Указываем папку для статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для получения всех товаров
app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
});

// Маршрут для получения товара по ID
app.get('/api/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    // Получаем технические характеристики товара
    const specs = db.prepare('SELECT * FROM product_specifications WHERE product_id = ?').all(req.params.id);
    
    // Получаем категорию товара
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(product.category_id);
    
    res.json({
        ...product,
        specifications: specs,
        category: category
    });
});

// Маршрут для получения товаров по категории
app.get('/api/categories/:id/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products WHERE category_id = ?').all(req.params.id);
    res.json(products);
});

// Обслуживаем корневую страницу, если она не находится в public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});