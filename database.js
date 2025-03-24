const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Создаем директорию для БД, если её нет
const dbDir = path.join(__dirname, 'data');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// Путь к файлу БД
const dbPath = path.join(dbDir, 'waterpro.db');

// Инициализация БД
const db = new Database(dbPath);

// Включаем foreign keys
db.pragma('foreign_keys = ON');

// Создаем таблицы, если они не существуют
function initDb() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image_path TEXT,
            category_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        );

        CREATE TABLE IF NOT EXISTS product_specifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            spec_name TEXT NOT NULL,
            spec_value TEXT NOT NULL,
            FOREIGN KEY (product_id) REFERENCES products (id)
        );
    `);
    
    console.log('Database initialized!');
}

// Инициализируем БД при запуске
initDb();

module.exports = db;