// Хранение типов/интерфейсов

// Тип для таблицы Users
export interface User {
    id: number; // идентификатор пользователя
    username: string; // имя пользователя
    password: string; // пароль
    gender?: boolean; // пол
    email?: string; // электронная почта
    phone?: string; // телефон
    adress?: string; // адрес
    isAdmin: boolean; // является ли администратором
    created_at: Date; // дата создания
}

// Тип для таблицы Status
export interface Status {
    id: number; // идентификатор статуса
    name: string; // название статуса
}

// Тип для таблицы Category
export interface Category {
    id: number; // идентификатор категории
    name: string; // название категории
    isDrink?: boolean; // является ли напитком
}

// Тип для таблицы Products
export interface Product {
    id: number; // идентификатор продукта
    name: string; // название продукта
    description?: string; // описание продукта
    price: number; // цена
    category: number; // идентификатор категории
    image_url?: string; // URL изображения
}

// Тип для таблицы Cart
export interface Cart {
    id: number; // идентификатор корзины
    user_id: number; // идентификатор пользователя
    created_at: Date; // дата создания
}

// Тип для таблицы Cart_Items
export interface CartItem {
    id: number; // идентификатор элемента корзины
    cart_id: number; // идентификатор корзины
    product_id: number; // идентификатор продукта
    quantity: number; // количество
}

// Тип для таблицы Orders
export interface Order {
    id: number; // идентификатор заказа
    user_id: number; // идентификатор пользователя
    total_amount: number; // общая сумма заказа
    address: string; // адрес
    status_id: number; // идентификатор статуса
    created_at: Date; // дата создания
}

// Тип для таблицы Order_Items
export interface OrderItem {
    id: number; // идентификатор элемента заказа
    order_id: number; // идентификатор заказа
    product_id: number; // идентификатор продукта
    quantity: number; // количество
}

// Тип для таблицы Reviews
export interface Review {
    id: number; // идентификатор отзыва
    order_id: number; // идентификатор заказа
    product_id: number; // идентификатор продукта
    quantity: number; // количество
}

// Тип для таблицы Restaraunts
export interface Restaraunt {
    id: number; // идентификатор ресторана
    address: string; // адрес
}
