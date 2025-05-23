import { relations } from 'drizzle-orm';
import { boolean, datetime, decimal, mysqlTable, int, varchar } from 'drizzle-orm/mysql-core';

// Таблица Users
export const usersTable = mysqlTable('Users', {
  id: int('id').primaryKey().autoincrement().notNull(),
  username: varchar('username', { length: 50 }).notNull().default("Пользователь"),
  password: varchar('password', { length: 255 }).notNull(),
  gender: boolean('gender'),
  email: varchar('email', { length: 100 }).unique(),
  phone: varchar('phone', {length: 20}).unique(),
  adress: varchar('adress', { length: 255}),
  isAdmin: boolean('isAdmin').notNull().default(false),
  created_at: datetime('created_at').default(new Date()),
  image_url: varchar('image_url', { length: 255 }),
});

// Таблица Status
export const statusTable = mysqlTable('Status', {
    id: int('id').primaryKey().autoincrement().notNull(),
    name: varchar('name', { length: 50 }).notNull().unique(),
});

// Таблица Category
export const categoryTable = mysqlTable('Category', {
    id: int('id').primaryKey().autoincrement().notNull(),
    name: varchar('name', {length: 100}).unique(),
    isDrink: boolean('isDrink'),
    image_url: varchar('image_url', { length: 255 }),
});

// Таблица Products
export const productsTable = mysqlTable('Products', {
    id: int('id').primaryKey().autoincrement().notNull(),
    name: varchar('name', { length: 150 }).unique(),
    description: varchar('description', { length: 255 }),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    category: int('category').notNull().references(() => categoryTable.id),
    image_url: varchar('image_url', { length: 255 }),
});

// Таблица Cart
export const cartTable = mysqlTable('Cart', {
    id: int('id').primaryKey().autoincrement().notNull(),
    user_id: int('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    created_at: datetime('created_at').default(new Date()),
});

// Таблица Cart_Items
export const cartItemsTable = mysqlTable('Cart_Items', {
    id: int('id').primaryKey().autoincrement().notNull(),
    cart_id: int('cart_id').notNull().references(() => cartTable.id, { onDelete: 'cascade' }),
    product_id: int('product_id').notNull().references(() => productsTable.id, { onDelete: 'cascade' }),
    quantity: int('quantity').notNull(),
});

// Таблица Orders
export const ordersTable = mysqlTable('Orders', {
  id: int('id').primaryKey().autoincrement().notNull(),
  user_id: int('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  restaurant_id: int('restaurant_id').references(() => restaurantsTable.id),
  total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  address: varchar('address', { length: 255 }),
  status_id: int('status_id').notNull().references(() => statusTable.id),
  created_at: datetime('created_at').default(new Date()),
  delivery_time: datetime('delivery_time'),
});

// Таблица Order_Items
export const orderItemsTable = mysqlTable('Order_Items', {
    id: int('id').primaryKey().autoincrement().notNull(),
    order_id: int('order_id').notNull().references(() => ordersTable.id, { onDelete: 'cascade' }),
    product_id: int('product_id').notNull().references(() => productsTable.id),
    quantity: int('quantity').notNull(),
});

// // Таблица Reviews
// export const reviewTable = mysqlTable('Reviews', {
//     id: int('id').primaryKey().autoincrement().notNull(),
//     order_id: int('order_id').notNull().references(() => ordersTable.id, { onDelete: 'cascade' }),
//     product_id: int('product_id').notNull().references(() => productsTable.id),
//     quantity: int('quantity').notNull(),
// });

// Таблица Restaurants
export const restaurantsTable = mysqlTable('Restaurants', {
  id: int('id').primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  coordinateX: decimal('coordinateX', { precision: 10, scale: 7 }).notNull(), // Широта для карты
  coordinateY: decimal('coordinateY', { precision: 10, scale: 7 }).notNull(), // Долгота для карты
  opening_time: varchar('opening_time', { length: 5 }).notNull(), // Формат "HH:MM"
  closing_time: varchar('closing_time', { length: 5 }).notNull(), // Формат "HH:MM"
  image_url: varchar('image_url', { length: 255 }),
  description: varchar('description', { length: 500 }),
  is_active: boolean('is_active').notNull().default(true), // Активен ли ресторан
  delivery_radius: int('delivery_radius').notNull().default(5000), // Радиус доставки в метрах
});

// Таблица Promotions
export const promotionsTable = mysqlTable('Promotions', {
  id: int('id').primaryKey().autoincrement().notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  description: varchar('description', { length: 500 }),
  image_url: varchar('image_url', { length: 255 }),
  is_active: boolean('is_active').notNull().default(true),
  discount_percent: int('discount_percent'),
  product_id: int('product_id').references(() => productsTable.id, { onDelete: 'cascade' }),
  category_id: int('category_id').references(() => categoryTable.id),
  created_at: datetime('created_at').default(new Date()),
  conditions: varchar('conditions', { length: 500 }),
});

// Таблица ContactMessages
export const contactMessagesTable = mysqlTable('ContactMessages', {
  id: int('id').primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  message: varchar('message', { length: 2000 }).notNull(),
  created_at: datetime('created_at').default(new Date()),
  is_processed: boolean('is_processed').notNull().default(false),
});


export const promotionsRelations = relations(promotionsTable, ({ one }) => ({
  product: one(productsTable, {
    fields: [promotionsTable.product_id],
    references: [productsTable.id],
  }),
  category: one(categoryTable, {
    fields: [promotionsTable.category_id],
    references: [categoryTable.id],
  }),
}));


export const restaurantsRelations = relations(restaurantsTable, ({ many }) => ({
  orders: many(ordersTable),
}));

// Определение связей
export const usersRelations = relations(usersTable, ({ many }) => ({
    carts: many(cartTable),
    orders: many(ordersTable),
}));

// Обновите связи для ordersTable
export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, { fields: [ordersTable.user_id], references: [usersTable.id] }),
  restaurant: one(restaurantsTable, { fields: [ordersTable.restaurant_id], references: [restaurantsTable.id] }), // Добавлено
  status: one(statusTable, { fields: [ordersTable.status_id], references: [statusTable.id] }),
  items: many(orderItemsTable),
}));

export const cartsRelations = relations(cartTable, ({ one, many }) => ({
    user: one(usersTable, { fields: [cartTable.user_id], references: [usersTable.id] }),
    items: many(cartItemsTable),
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
    cart: one(cartTable, { fields: [cartItemsTable.cart_id], references: [cartTable.id] }),
    product: one(productsTable, { fields: [cartItemsTable.product_id], references: [productsTable.id] }),
}));

export const productsRelations = relations(productsTable, ({ one, many }) => ({
    category: one(categoryTable, { fields: [productsTable.category], references: [categoryTable.id] }),
    cartItems: many(cartItemsTable),
    orderItems: many(orderItemsTable),
}));