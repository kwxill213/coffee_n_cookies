import { drizzle } from "drizzle-orm/mysql2";
import dotenv from 'dotenv';

dotenv.config();
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('DATABASE_URL не найдена в .env-файле.');
}
const db = drizzle(databaseUrl);

export default db