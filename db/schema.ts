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
  created_at: datetime('created_at').default(new Date())
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
    user_id: int('user_id').notNull().references(() => usersTable.id),
    created_at: datetime('created_at').default(new Date()),
});

// Таблица Cart_Items
export const cartItemsTable = mysqlTable('Cart_Items', {
    id: int('id').primaryKey().autoincrement().notNull(),
    cart_id: int('cart_id').notNull().references(() => cartTable.id),
    product_id: int('product_id').notNull().references(() => productsTable.id),
    quantity: int('quantity').notNull(),
});

// Таблица Orders
export const ordersTable = mysqlTable('Orders', {
    id: int('id').primaryKey().autoincrement().notNull(),
    user_id: int('user_id').notNull().references(() => usersTable.id),
    total_amount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    status_id: int('status_id').notNull().references(() => statusTable.id),
    created_at: datetime('created_at').default(new Date()),
});

// Таблица Order_Items
export const orderItemsTable = mysqlTable('Order_Items', {
    id: int('id').primaryKey().autoincrement().notNull(),
    order_id: int('order_id').notNull().references(() => ordersTable.id),
    product_id: int('product_id').notNull().references(() => productsTable.id),
    quantity: int('quantity').notNull(),
});

// Таблица Reviews
export const reviewTable = mysqlTable('Reviews', {
    id: int('id').primaryKey().autoincrement().notNull(),
    order_id: int('order_id').notNull().references(() => ordersTable.id),
    product_id: int('product_id').notNull().references(() => productsTable.id),
    quantity: int('quantity').notNull(),
});

// Таблица Restaraunts
export const restarauntsTable = mysqlTable('Restaraunts', {
    id: int('id').primaryKey().autoincrement().notNull(),
    address: varchar('address', {length: 255}).notNull(),
});

// Определение связей
export const usersRelations = relations(usersTable, ({ many }) => ({
    carts: many(cartTable),
    orders: many(ordersTable),
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
    reviews: many(reviewTable),
}));