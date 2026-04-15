import pool from './db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Helper: convert snake_case DB rows to camelCase for GraphQL
function toCamelCase(row: any) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    price: parseFloat(row.price),
    stockQuantity: row.stock_quantity,
    conditionStatus: row.condition_status,
    manufacturer: row.manufacturer,
    modelNumber: row.model_number,
    year: row.year,
    createdAt: row.created_at?.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
  };
}

const resolvers = {
  Query: {
    // Get all items, optionally filtered by category or search term
    items: async (_: any, { category, search }: { category?: string; search?: string }) => {
      let query = 'SELECT * FROM inventory_items WHERE 1=1';
      const params: any[] = [];

      if (category) {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ? OR manufacturer LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';

      const [rows] = await pool.execute<RowDataPacket[]>(query, params);
      return rows.map(toCamelCase);
    },

    // Get a single item by ID
    item: async (_: any, { id }: { id: number }) => {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM inventory_items WHERE id = ?',
        [id]
      );
      return rows[0] ? toCamelCase(rows[0]) : null;
    },

    // Get all unique categories
    categories: async () => {
      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT DISTINCT category FROM inventory_items ORDER BY category'
      );
      return rows.map((row) => row.category);
    },

    // Get inventory summary stats
    inventorySummary: async () => {
      const [totals] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as totalItems, COALESCE(SUM(price * stock_quantity), 0) as totalValue, COALESCE(SUM(stock_quantity), 0) as totalStock FROM inventory_items'
      );

      const [categories] = await pool.execute<RowDataPacket[]>(
        'SELECT category, COUNT(*) as count FROM inventory_items GROUP BY category ORDER BY count DESC'
      );

      return {
        totalItems: totals[0].totalItems,
        totalValue: parseFloat(totals[0].totalValue),
        totalStock: totals[0].totalStock,
        categoryBreakdown: categories.map((row) => ({
          category: row.category,
          count: row.count,
        })),
      };
    },
  },

  Mutation: {
    // Create a new inventory item
    createItem: async (_: any, { input }: { input: any }) => {
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO inventory_items (name, category, description, price, stock_quantity, condition_status, manufacturer, model_number, year)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          input.name,
          input.category,
          input.description || null,
          input.price,
          input.stockQuantity,
          input.conditionStatus || 'new',
          input.manufacturer || null,
          input.modelNumber || null,
          input.year || null,
        ]
      );

      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM inventory_items WHERE id = ?',
        [result.insertId]
      );
      return toCamelCase(rows[0]);
    },

    // Update an existing item
    updateItem: async (_: any, { id, input }: { id: number; input: any }) => {
      const fields: string[] = [];
      const values: any[] = [];

      // Only update fields that were provided
      if (input.name !== undefined) { fields.push('name = ?'); values.push(input.name); }
      if (input.category !== undefined) { fields.push('category = ?'); values.push(input.category); }
      if (input.description !== undefined) { fields.push('description = ?'); values.push(input.description); }
      if (input.price !== undefined) { fields.push('price = ?'); values.push(input.price); }
      if (input.stockQuantity !== undefined) { fields.push('stock_quantity = ?'); values.push(input.stockQuantity); }
      if (input.conditionStatus !== undefined) { fields.push('condition_status = ?'); values.push(input.conditionStatus); }
      if (input.manufacturer !== undefined) { fields.push('manufacturer = ?'); values.push(input.manufacturer); }
      if (input.modelNumber !== undefined) { fields.push('model_number = ?'); values.push(input.modelNumber); }
      if (input.year !== undefined) { fields.push('year = ?'); values.push(input.year); }

      if (fields.length === 0) throw new Error('No fields to update');

      values.push(id);
      await pool.execute(`UPDATE inventory_items SET ${fields.join(', ')} WHERE id = ?`, values);

      const [rows] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM inventory_items WHERE id = ?',
        [id]
      );
      return toCamelCase(rows[0]);
    },

    // Delete an item
    deleteItem: async (_: any, { id }: { id: number }) => {
      const [result] = await pool.execute<ResultSetHeader>(
        'DELETE FROM inventory_items WHERE id = ?',
        [id]
      );
      return result.affectedRows > 0;
    },
  },
};

export default resolvers;
