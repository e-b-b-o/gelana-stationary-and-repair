import { pool } from "../../db/connection.js";
import AppError from "../utils/AppError.js";

// Helper: get or create cart for a user
export async function getOrCreateCart(user_id) {
  let result = await pool.query(`SELECT * FROM carts WHERE user_id = $1`, [
    user_id,
  ]);

  if (result.rows.length > 0) {
    return result.rows[0];
  }

  result = await pool.query(
    `INSERT INTO carts(user_id) VALUES($1) RETURNING *`,
    [user_id],
  );
  return result.rows[0];
}

export async function getCart(user_id) {
  const cart = await getOrCreateCart(user_id);

  const result = await pool.query(
    `
      SELECT 
        p.id,
        ci.id AS cart_item_id,
        ci.quantity,
        p.name,
        p.price,
        p.thumbnail_url AS image,
        p.stock_quantity AS stock
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = $1
      ORDER BY ci.id ASC
    `,
    [cart.id],
  );

  return result.rows;
}

export async function addToCart(user_id, product_id, quantity = 1) {
  if (quantity < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  // Use a transaction to ensure stock validation and updates are atomic
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Check product stock
    const productRes = await client.query(
      `SELECT stock_quantity FROM products WHERE id = $1`,
      [product_id],
    );
    if (productRes.rows.length === 0) {
      throw new AppError("Product not found", 404);
    }
    const stock = productRes.rows[0].stock_quantity;

    const cart = await getOrCreateCart(user_id);

    // Check if item already in cart
    const existingRes = await client.query(
      `SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
      [cart.id, product_id],
    );

    let newQuantity = quantity;
    if (existingRes.rows.length > 0) {
      newQuantity = existingRes.rows[0].quantity + quantity;
    }

    if (newQuantity > stock) {
      throw new AppError(
        `Not enough stock available. Only ${stock} left.`,
        400,
      );
    }

    let item;
    if (existingRes.rows.length > 0) {
      const updateRes = await client.query(
        `UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
        [newQuantity, cart.id, product_id],
      );
      item = updateRes.rows[0];
    } else {
      const insertRes = await client.query(
        `INSERT INTO cart_items(cart_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *`,
        [cart.id, product_id, quantity],
      );
      item = insertRes.rows[0];
    }

    await client.query("COMMIT");
    return item;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateCart(user_id, product_id, quantity) {
  if (quantity < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const productRes = await client.query(
      `SELECT stock_quantity FROM products WHERE id = $1`,
      [product_id],
    );
    if (productRes.rows.length === 0) {
      throw new AppError("Product not found", 404);
    }
    const stock = productRes.rows[0].stock_quantity;

    if (quantity > stock) {
      throw new AppError(
        `Not enough stock available. Only ${stock} left.`,
        400,
      );
    }

    const cart = await getOrCreateCart(user_id);

    const result = await client.query(
      `UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`,
      [quantity, cart.id, product_id],
    );

    if (result.rows.length === 0) {
      throw new AppError("Item not found in cart", 404);
    }

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteCart(user_id, product_id) {
  const cart = await getOrCreateCart(user_id);

  const result = await pool.query(
    `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
    [cart.id, product_id],
  );

  if (result.rows.length === 0) {
    throw new AppError("Item not found in cart", 404);
  }

  return result.rows[0];
}

export async function clearCart(user_id) {
  const cart = await getOrCreateCart(user_id);

  await pool.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);

  return { message: "Cart cleared successfully" };
}
