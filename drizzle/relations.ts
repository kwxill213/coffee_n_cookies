import { relations } from "drizzle-orm/relations";
import { users, cart, cartItems, products, orders, orderItems, status, category, reviews } from "./schema";

export const cartRelations = relations(cart, ({one, many}) => ({
	user: one(users, {
		fields: [cart.userId],
		references: [users.id]
	}),
	cartItems: many(cartItems),
}));

export const usersRelations = relations(users, ({many}) => ({
	carts: many(cart),
	orders: many(orders),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	cart: one(cart, {
		fields: [cartItems.cartId],
		references: [cart.id]
	}),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	cartItems: many(cartItems),
	orderItems: many(orderItems),
	category: one(category, {
		fields: [products.category],
		references: [category.id]
	}),
	reviews: many(reviews),
}));

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	orderItems: many(orderItems),
	status: one(status, {
		fields: [orders.statusId],
		references: [status.id]
	}),
	user: one(users, {
		fields: [orders.userId],
		references: [users.id]
	}),
	reviews: many(reviews),
}));

export const statusRelations = relations(status, ({many}) => ({
	orders: many(orders),
}));

export const categoryRelations = relations(category, ({many}) => ({
	products: many(products),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	order: one(orders, {
		fields: [reviews.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [reviews.productId],
		references: [products.id]
	}),
}));