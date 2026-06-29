import { pool } from "../../db/connection.js";
import AppError from "../utils/AppError.js";

// Helper: get or create wishlist for a user
export async function getOrCreateWishlist(user_id) {
  let result = await pool.query(`SELECT * FROM wishlists WHERE user_id = $1`, [user_id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  result = await pool.query(
    `INSERT INTO wishlists(user_id) VALUES($1) RETURNING *`,
    [user_id]
  );
  return result.rows[0];
}

export async function getWishlist(user_id) {
  const wishlist = await getOrCreateWishlist(user_id);

  const result = await pool.query(
    `
      SELECT 
        p.id,
        wi.id AS wishlist_item_id,
        p.name,
        p.price,
        p.thumbnail_url AS image,
        p.stock_quantity AS stock,
        p.is_active
      FROM wishlist_items wi 
      JOIN products p ON wi.product_id = p.id
      WHERE wi.wishlist_id = $1
      ORDER BY wi.id DESC
    `,
    [wishlist.id]
  );

  return result.rows;
}

export async function addToWishlist(user_id, product_id) {
  const wishlist = await getOrCreateWishlist(user_id);

  // Check if product exists
  const productRes = await pool.query(`SELECT id FROM products WHERE id = $1`, [product_id]);
  if (productRes.rows.length === 0) {
    throw new AppError("Product not found", 404);
  }

  try {
    const result = await pool.query(
      `INSERT INTO wishlist_items(wishlist_id, product_id) VALUES($1, $2) RETURNING *`,
      [wishlist.id, product_id]
    );
    return result.rows[0];
  } catch (error) {
    // 23505 is the PostgreSQL error code for unique violation
    if (error.code === '23505') {
      throw new AppError("Product is already in the wishlist", 400);
    }
    throw error;
  }
}

export async function removeWishlistItem(user_id, product_id) {
  const wishlist = await getOrCreateWishlist(user_id);

  const result = await pool.query(
    `DELETE FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2 RETURNING *`,
    [wishlist.id, product_id]
  );

  if (result.rows.length === 0) {
    throw new AppError("Item not found in wishlist", 404);
  }

  return result.rows[0];
}

export async function clearWishlist(user_id) {
  const wishlist = await getOrCreateWishlist(user_id);

  await pool.query(`DELETE FROM wishlist_items WHERE wishlist_id = $1`, [wishlist.id]);

  return { message: "Wishlist cleared successfully" };
}
