import mysql from 'mysql2/promise';

// Create a connection pool (reuses connections efficiently)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'inventory_assistant',
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
