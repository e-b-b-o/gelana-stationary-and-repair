import { pool } from "../../db/connection.js";

export async function getAllCategories() {
  const result = await pool.query(`SELECT * FROM categories`);
  return result.rows;
}

export async function getCategoryById(id) {
  const result = await pool.query(`SELECT * FROM categories WHERE id = $1`, [id]);
  return result.rows[0];
}

export async function createNewCategory(categoryData) {
  const { name } = categoryData;
  const result = await pool.query(
    `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return result.rows[0];
}

export async function updateExistingCategory(id, categoryData) {
  const { name } = categoryData;
  const result = await pool.query(
    `UPDATE categories SET name = $1 WHERE id = $2 RETURNING *`,
    [name, id]
  );
  return result.rows[0];
}

export async function deleteCategory(id) {
  const result = await pool.query(
    `DELETE FROM categories WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
