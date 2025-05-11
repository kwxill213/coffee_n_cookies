import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, int, datetime, unique, varchar, decimal } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const cart = mysqlTable("cart", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id),
	createdAt: datetime("created_at", { mode: 'string'}).default('2025-05-09 14:57:24'),
},
(table) => [
	primaryKey({ columns: [table.id], name: "cart_id"}),
]);

export const cartItems = mysqlTable("cart_items", {
	id: int().autoincrement().notNull(),
	cartId: int("cart_id").notNull().references(() => cart.id),
	productId: int("product_id").notNull().references(() => products.id),
	quantity: int().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "cart_items_id"}),
]);

export const category = mysqlTable("category", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 100 }),
	isDrink: tinyint(),
	imageUrl: varchar("image_url", { length: 200 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "category_id"}),
	unique("Category_name_unique").on(table.name),
]);

export const orderItems = mysqlTable("order_items", {
	id: int().autoincrement().notNull(),
	orderId: int("order_id").notNull().references(() => orders.id),
	productId: int("product_id").notNull().references(() => products.id),
	quantity: int().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "order_items_id"}),
]);

export const orders = mysqlTable("orders", {
	id: int().autoincrement().notNull(),
	userId: int("user_id").notNull().references(() => users.id),
	totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
	address: varchar({ length: 255 }).notNull(),
	statusId: int("status_id").notNull().references(() => status.id),
	createdAt: datetime("created_at", { mode: 'string'}).default('2025-05-09 14:57:24'),
},
(table) => [
	primaryKey({ columns: [table.id], name: "orders_id"}),
]);

export const products = mysqlTable("products", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 150 }),
	description: varchar({ length: 255 }),
	price: decimal({ precision: 10, scale: 2 }).notNull(),
	category: int().notNull().references(() => category.id),
	imageUrl: varchar("image_url", { length: 255 }),
},
(table) => [
	primaryKey({ columns: [table.id], name: "products_id"}),
	unique("Products_name_unique").on(table.name),
]);

export const restaraunts = mysqlTable("restaraunts", {
	id: int().autoincrement().notNull(),
	address: varchar({ length: 255 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "restaraunts_id"}),
]);

export const reviews = mysqlTable("reviews", {
	id: int().autoincrement().notNull(),
	orderId: int("order_id").notNull().references(() => orders.id),
	productId: int("product_id").notNull().references(() => products.id),
	quantity: int().notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "reviews_id"}),
]);

export const status = mysqlTable("status", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 50 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "status_id"}),
	unique("Status_name_unique").on(table.name),
]);

export const users = mysqlTable("users", {
	id: int().autoincrement().notNull(),
	username: varchar({ length: 50 }).default('Пользователь').notNull(),
	password: varchar({ length: 255 }).notNull(),
	gender: tinyint(),
	email: varchar({ length: 100 }),
	phone: varchar({ length: 20 }),
	adress: varchar({ length: 255 }),
	isAdmin: tinyint().default(0).notNull(),
	createdAt: datetime("created_at", { mode: 'string'}).default('2025-05-09 14:57:24'),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
	unique("Users_email_unique").on(table.email),
	unique("Users_phone_unique").on(table.phone),
]);
