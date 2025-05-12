// Хранение типов/интерфейсов

// Тип для таблицы Users
export interface User {
    orders: boolean;
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
    id: number;
  name: string;
  isDrink: boolean;
  image_url?: string;
}

// Тип для таблицы Products
export interface Product {
    toppings: boolean;
    id: number;
  name: string;
  price: number;
  category: number;
  description: string;
  image_url?: string;
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
  id: number;
  user_id: number;
  username: string;
  phone: string;
  total_amount: string;
  address: string;
  status_id: number;
  status_name: string;
  created_at: string;
  delivery_time: string | null;
  items_count: number;
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
export interface Restaurant {
  image_url: string;
  description: string;
  opening_time: string;
  closing_time: string;
  id: number;
  name: string;
  address: string;
  phone: string;
  coordinates: [number, number]; // [широта, долгота]
  openingHours: string;
  image: string;
}


export interface Promotion {
  id?: number
  title: string
  description: string
  image_url: string
  is_active: boolean
  discount_percent: number
  start_date?: Date | null
  end_date?: Date | null
}

export interface PromotionFormProps {
  promotion?: Promotion
  onSubmit: (data: Promotion) => Promise<void> | void
}