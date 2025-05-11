import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
const databaseUrl = process.env.DATABASE_URL;
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Оптимальное количество соединений
  queueLimit: 0
});
const db = drizzle(poolConnection);

export default db;