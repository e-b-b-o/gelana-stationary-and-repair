import { pool } from "../../db/connection.js";

export async function getAllProducts() {
  const result = await pool.query(`
    SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity AS stock, 
        p.thumbnail_url AS image, 
        p.is_active, 
        p.rating,
        p.category_id,
        c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);

  return result.rows;
}

export async function getProductById(id) {
  const result = await pool.query(
    `
    SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.price, 
        p.stock_quantity AS stock, 
        p.thumbnail_url AS image, 
        p.is_active, 
        p.rating,
        p.category_id,
        c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0];
}

export async function createProduct(product) {
  const {
    category_id,
    name,
    description,
    price,
    stock_quantity,
    thumbnail_url,
    is_active,
    rating = 0.0,
  } = product;

  const result = await pool.query(
    `INSERT INTO products (
    category_id , name , description , price , stock_quantity , thumbnail_url , is_active, rating) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      category_id,
      name,
      description,
      price,
      stock_quantity,
      thumbnail_url,
      is_active,
      rating,
    ],
  );
  return result.rows[0];
}

export async function updateProduct(id, productData) {
  const {
    category_id,
    name,
    description,
    price,
    stock_quantity,
    thumbnail_url,
    is_active,
    rating,
  } = productData;

  const result = await pool.query(
    `UPDATE products SET 
    category_id = $1,
    name = $2,
    description = $3,
    price =$4,
    stock_quantity = $5,
    thumbnail_url = $6,
    is_active = $7,
    rating = COALESCE($8, rating),
    updated_at =  CURRENT_TIMESTAMP
    WHERE id = $9
    RETURNING *
    `,
    [
      category_id,
      name,
      description,
      price,
      stock_quantity,
      thumbnail_url,
      is_active,
      rating,
      id,
    ],
  );
  return result.rows[0];
}

export async function deleteProduct(id) {
  const result = await pool.query(
    `DELETE FROM products WHERE id = $1 RETURNING *`,
    [id],
  );

  return result.rows[0];
}
