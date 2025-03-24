const { addCategory, addProduct, addProductSpec } = require('./db-utils');

// Добавляем категории
const filtrationId = addCategory('Фильтрация воды', 'Системы для фильтрации воды в доме');
const softenerId = addCategory('Смягчители воды', 'Системы для смягчения воды');
const uvId = addCategory('УФ-очистка', 'Системы УФ-дезинфекции воды');

// Добавляем товары
const product1Id = addProduct(
    'Система фильтрации воды',
    'Высокопроизводительная система фильтрации воды для всего дома',
    1239900,
    '/public/test.jpg',
    filtrationId
);

const product2Id = addProduct(
    'test',
    'test',
    111,
    '/public/test.jpg',
    filtrationId
)

// Добавляем характеристики товара
addProductSpec(product1Id, 'Производительность', '10 л/мин');
addProductSpec(product1Id, 'Тип фильтра', 'Обратный осмос');
addProductSpec(product1Id, 'Срок службы', '5 лет');

addProductSpec(product2Id, 'Производительность', '1l');
addProductSpec(product2Id, 'Тип фильтра', '1t');
addProductSpec(product2Id, 'Срок службы', '1y');

console.log('Тестовые данные добавлены!');