const { addCategory, addProduct, addProductSpec } = require('./db-utils');

// Добавляем категории
const filtrationId = addCategory('Фильтрация воды', 'Системы для фильтрации воды в доме');
const softenerId = addCategory('Смягчители воды', 'Системы для смягчения воды');
const uvId = addCategory('УФ-очистка', 'Системы УФ-дезинфекции воды');

// Добавляем товары
const product1Id = addProduct(
    'Система фильтрации воды',
    'Высокопроизводительная система для вашего дома',
    129900,
    'test.jpg',
    filtrationId
);

const product2Id = addProduct(
    'Смягчитель воды',
    'Передовая система смягчения воды',
    89900,
    'test.jpg',
    softenerId
);

const product3Id = addProduct(
    'Система УФ-очистки',
    'Эффективная УФ-очистка для безопасности',
    59900,
    'test.jpg',
    uvId
);

const product4Id = addProduct(
    'Фильтр для воды',
    'Компактный фильтр для офиса и дома',
    45900,
    'test.jpg',
    filtrationId
);

const product5Id = addProduct(
    'Очиститель воды',
    'Надёжный очиститель для ежедневного использования',
    75900,
    'test.jpg',
    filtrationId
);

const product6Id = addProduct(
    'Комплексное решение',
    'Полный набор оборудования для очистки воды',
    199900,
    'test.jpg',
    filtrationId
);

// Добавляем характеристики товаров
addProductSpec(product1Id, 'Производительность', '10 л/мин');
addProductSpec(product1Id, 'Тип фильтра', 'Обратный осмос');
addProductSpec(product1Id, 'Срок службы', '5 лет');

addProductSpec(product2Id, 'Производительность', '8 л/мин');
addProductSpec(product2Id, 'Тип фильтра', 'Ионообменный');
addProductSpec(product2Id, 'Срок службы', '7 лет');

addProductSpec(product3Id, 'Мощность УФ', '30 мДж/см²');
addProductSpec(product3Id, 'Производительность', '12 л/мин');
addProductSpec(product3Id, 'Срок службы лампы', '9000 часов');

addProductSpec(product4Id, 'Производительность', '2 л/мин');
addProductSpec(product4Id, 'Тип фильтра', 'Угольный');
addProductSpec(product4Id, 'Срок службы', '1 год');

addProductSpec(product5Id, 'Производительность', '5 л/мин');
addProductSpec(product5Id, 'Тип фильтра', 'Многоступенчатый');
addProductSpec(product5Id, 'Срок службы', '3 года');

addProductSpec(product6Id, 'Производительность', '15 л/мин');
addProductSpec(product6Id, 'Компоненты', 'Фильтрация, смягчение, УФ-очистка');
addProductSpec(product6Id, 'Срок службы', '10 лет');

console.log('Тестовые данные добавлены!');
