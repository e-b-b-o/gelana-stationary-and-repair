import { pool } from "../../db/connection.js";

export async function createUser(userData) {
  const { first_name, last_name, email, password, phone } = userData;
  
  // NOTE: Password hashing with bcrypt should happen here before inserting
  const password_hash = password; // Temporarily using raw password

  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, phone)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, phone, role, is_active`,
    [first_name, last_name, email, password_hash, phone]
  );
  
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

export async function getUserById(id) {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, phone, profile_image, role, is_active, email_verified, created_at FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}
