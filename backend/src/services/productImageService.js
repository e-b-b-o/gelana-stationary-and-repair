import { pool } from "../../db/connection.js";

export async function getImagesByProductId(productId) {
  const result = await pool.query(
    `SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order ASC`,
    [productId]
  );
  return result.rows;
}

export async function addImage(productId, imageData) {
  const { image_url, alt_text, display_order } = imageData;
  const result = await pool.query(
    `INSERT INTO product_images (product_id, image_url, alt_text, display_order)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [productId, image_url, alt_text, display_order || 0]
  );
  return result.rows[0];
}

export async function updateImage(id, imageData) {
  const { image_url, alt_text, display_order } = imageData;
  const result = await pool.query(
    `UPDATE product_images 
     SET image_url = COALESCE($1, image_url), 
         alt_text = COALESCE($2, alt_text), 
         display_order = COALESCE($3, display_order)
     WHERE id = $4 RETURNING *`,
    [image_url, alt_text, display_order, id]
  );
  return result.rows[0];
}

export async function deleteImage(id) {
  const result = await pool.query(
    `DELETE FROM product_images WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}
