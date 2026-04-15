import 'dotenv/config';
import pool from './db.js';

async function migrate() {
  console.log('Running database migration...\n');

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(12, 2) NOT NULL,
      stock_quantity INT NOT NULL DEFAULT 0,
      condition_status ENUM('new', 'used', 'refurbished') DEFAULT 'new',
      manufacturer VARCHAR(255),
      model_number VARCHAR(255),
      year INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('✓ inventory_items table created');
  console.log('\nMigration complete!');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
