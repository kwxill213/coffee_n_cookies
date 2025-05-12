import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
const databaseUrl = process.env.DATABASE_URL;
const poolConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 30, // Увеличиваем лимит соединений
  queueLimit: 30, // Добавляем лимит очереди
  enableKeepAlive: true, // Включаем поддержание соединений
  keepAliveInitialDelay: 10000, // Начальная задержка для keep-alive (10 секунд)
  connectTimeout: 10000, // Таймаут подключения (10 секунд)
  maxIdle: 10, // Максимальное количество простаивающих соединений
  idleTimeout: 30000 // Таймаут простоя (1 минута)
});
const db = drizzle(poolConnection);

export default db;