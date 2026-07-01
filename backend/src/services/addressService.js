import { pool } from "../../db/connection.js";
import AppError from "../utils/AppError.js";

export async function getUserAddresses(user_id) {
  const result = await pool.query(
    `
    SELECT 
    a.id,
    a.title,
    a.country,
    a.city,
    a.address,
    a.postal_code AS "postalCode",
    a.is_default AS "isDefault"
    FROM addresses a
    WHERE a.user_id = $1
    ORDER BY is_default DESC, id ASC`,
    [user_id],
  );

  return result.rows;
}

export async function createUserAddress(user_id, addressData) {
  const { title, country, city, address, postalCode } = addressData;

  const count = await pool.query(
    `
    SELECT COUNT(*)
    FROM addresses
    WHERE user_id=$1
    `,
    [user_id],
  );

  const isDefault = count.rows[0].count === "0";

  const result = await pool.query(
    `
    INSERT INTO addresses (
    user_id,
    title,
    country,
    city,
    address,
    postal_code,
    is_default
    )
    VALUES ($1 , $2 , $3 , $4 ,$5 ,$6 , $7) 
    RETURNING
    id,
    title,
    country,
    city,
    address,
    postal_code AS "postalCode",
    is_default AS "isDefault" `,
    [user_id, title, country, city, address, postalCode, isDefault],
  );

  return result.rows[0];
}

export async function updateUserAddress(user_id, address_id, addressData) {
  const { title, country, city, address, postalCode } = addressData;

  const result = await pool.query(
    `
    UPDATE addresses
    SET
    title = $1,
    country = $2,
    city =$3,
    address = $4,
    postal_code = $5
    WHERE id = $6 
    AND user_id = $7
    RETURNING
    id,
    title,
    country,
    city,
    address,
    postal_code AS "postalCode",
    is_default AS "isDefault"`,
    [title, country, city, address, postalCode, address_id, user_id],
  );

  if (result.rows.length === 0) {
    throw new AppError("Address not found", 404);
  }

  return result.rows[0];
}

export async function deleteUserAddress(user_id, address_id) {
  const result = await pool.query(
    `
  DELETE 
  FROM addresses
  WHERE id = $1 
  AND user_id = $2
  RETURNING id , title`,
    [address_id, user_id],
  );

  if (result.rows.length === 0) throw new AppError("Address not found", 404);
  return result.rows[0];
}

export async function setUserDefaultAddress(user_id, address_id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE addresses SET is_default = false WHERE user_id = $1",
      [user_id],
    );
    const result = await client.query(
      `UPDATE addresses 
      SET is_default = true 
      WHERE id = $1 
      AND user_id = $2 
      RETURNING
      id,
      title,
      country,
      city,
      address,
      postal_code AS "postalCode",
      is_default AS "isDefault"`,
      [address_id, user_id],
    );
    if (result.rows.length === 0) throw new AppError("Address not found", 404);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    await client.release();
  }
}
