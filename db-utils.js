const db = require('./database');

// Функция для добавления категории
function addCategory(name, description = '') {
    const stmt = db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)');
    const info = stmt.run(name, description);
    console.log(`Added category with ID: ${info.lastInsertRowid}`);
    return info.lastInsertRowid;
}

// Функция для добавления товара
function addProduct(name, description, price, imagePath, categoryId) {
    const stmt = db.prepare('INSERT INTO products (name, description, price, image_path, category_id) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, description, price, imagePath, categoryId);
    console.log(`Added product with ID: ${info.lastInsertRowid}`);
    return info.lastInsertRowid;
}

// Функция для добавления характеристики товара
function addProductSpec(productId, specName, specValue) {
    const stmt = db.prepare('INSERT INTO product_specifications (product_id, spec_name, spec_value) VALUES (?, ?, ?)');
    const info = stmt.run(productId, specName, specValue);
    console.log(`Added product specification with ID: ${info.lastInsertRowid}`);
    return info.lastInsertRowid;
}

// Экспортируем функции
module.exports = {
    addCategory,
    addProduct,
    addProductSpec
};