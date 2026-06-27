# Gelana E-Commerce — Production Roadmap (Part 1: Steps 1–6)

> **Date:** June 27, 2026 | **Status:** Architecture Review Complete
>
> I scanned every file in your project. This roadmap is based on your ACTUAL code, not assumptions.

---

## Current State Audit — What You Did Well

| Area | Verdict |
|------|---------|
| Layered backend (Route→Controller→Service) | ✅ Professional pattern |
| JWT in HttpOnly cookies | ✅ Correct — no localStorage |
| bcrypt password hashing in service layer | ✅ Correct placement |
| Zod validation with middleware | ✅ Clean separation |
| `catchAsync` wrapper | ✅ Prevents crash on unhandled rejections |
| `AppError` custom class | ✅ Operational vs programmer errors |
| Feature-based frontend folders | ✅ Scales well |
| Axios instance with `withCredentials` | ✅ Cookies sent automatically |
| `mergeParams` on image routes | ✅ Correct nested route pattern |
| DB schema has CHECK constraints + indexes | ✅ Already implemented |

---

## Critical Issues Found

### 1. Category and Image routes are UNPROTECTED
```js
// categoriesRoutes.js — anyone can create/update/delete categories
router.route("/").post(validationMiddleware(createCategorySchema), createCategory);
// Missing: protect, restrictTo("ADMIN")
```

### 2. Product validation uses `z.url()` for thumbnail
```js
thumbnail_url: z.url(), // Your images are paths like "/uploads/products/file.png" — not URLs
```
**Fix:** Change to `z.string().optional()`.

### 3. Cart/Wishlist/Orders use localStorage, not the database
Your schema has `carts`, `cart_items`, `wishlists`, `wishlist_items`, `orders`, `order_items` tables, but frontend stores everything in localStorage. Data is lost on browser clear.

### 4. `orderService.js` frontend is broken stub code
References undefined variables: `currentUser`, `items`, `contact`, `payment`.

### 5. `ProtectedRoute` doesn't handle loading state
If auth is still checking (`loading=true`), it immediately redirects to `/login`.

### 6. `secure: false` on JWT cookie — must be conditional
```js
// Fix: secure: process.env.NODE_ENV === "production"
```

### 7. No `sameSite` attribute on cookies
Without `sameSite: "lax"`, cookies are vulnerable to CSRF.

---

# ROADMAP

---

## Step 1: Fix Foundation Issues

### Goal
Harden existing code before building new features.

### Why
Professionals never build on a broken foundation. Every issue above is a security vulnerability or runtime crash.

### Changes Required

**`backend/src/routes/categoriesRoutes.js`** — Add auth:
```js
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/restrictTo.js";

router.route("/")
  .get(getCategories)
  .post(protect, restrictTo("ADMIN"), validationMiddleware(createCategorySchema), createCategory);
router.route("/:id")
  .get(getCategory)
  .patch(protect, restrictTo("ADMIN"), validationMiddleware(updateCategorySchema), updateCategory)
  .delete(protect, restrictTo("ADMIN"), deleteCategory);
```

**`backend/src/validation/product.schema.js`** — Fix thumbnail:
```js
thumbnail_url: z.string().optional(),
```

**`backend/src/controllers/userController.js`** — Fix cookies:
```js
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
res.cookie("jwt", token, cookieOptions);
```

**`frontend/src/features/auth/ProtectedRoute.jsx`** — Handle loading:
```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
}
```

**`backend/src/middleware/uploadMiddleware.js`** — Add file filter:
```js
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new AppError("Only JPEG, PNG, WebP allowed", 400), false);
};
export const uploadProductImage = multer({
  storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 }
});
```

---

## Step 2: Server-Side Cart API

### Goal
Move cart from localStorage to PostgreSQL `carts` + `cart_items` tables.

### Why
localStorage is device-specific, has no stock validation, and gives admin zero visibility.

### Database
Already exists. Add: `CREATE INDEX idx_cart_items_product ON cart_items(product_id);`

### Backend

**`backend/src/routes/cartRoutes.js`:**
```js
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(protect);
router.route("/").get(getCart).delete(clearCart);
router.route("/items").post(addToCart);
router.route("/items/:productId").patch(updateCartItem).delete(removeFromCart);
```

**`backend/src/services/cartService.js`** — Key pattern:
```js
export async function addItem(userId, productId, quantity = 1) {
  // 1. Get or create cart
  let cart = await pool.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
  if (cart.rows.length === 0) {
    cart = await pool.query("INSERT INTO carts (user_id) VALUES ($1) RETURNING id", [userId]);
  }
  const cartId = cart.rows[0].id;

  // 2. Check stock
  const product = await pool.query(
    "SELECT stock_quantity FROM products WHERE id = $1 AND is_active = true", [productId]
  );
  if (product.rows.length === 0) throw new AppError("Product not found", 404);
  if (product.rows[0].stock_quantity < quantity) throw new AppError("Insufficient stock", 400);

  // 3. Upsert
  const result = await pool.query(
    `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)
     ON CONFLICT (cart_id, product_id) DO UPDATE SET quantity = cart_items.quantity + $3
     RETURNING *`, [cartId, productId, quantity]
  );
  return result.rows[0];
}
```

**Register in `app.js`:** `app.use("/api/cart", cartRoutes);`

### Frontend
Create `frontend/src/features/cart/cartService.js`, update `CartContext.jsx` to call API.

### Request Flow
```
Add to Cart click → CartContext.addItem() → cartService.addItem()
  → POST /api/cart/items → protect → cartController → cartService
    → SELECT/INSERT cart → stock check → UPSERT cart_items
      → 201 response → dispatch to reducer → UI updates
```

### Folder Placement
```
backend/src/routes/cartRoutes.js         (NEW)
backend/src/controllers/cartController.js (NEW)
backend/src/services/cartService.js       (NEW)
backend/src/validation/cart.schema.js     (NEW)
frontend/src/features/cart/cartService.js (NEW)
frontend/src/features/cart/CartContext.jsx (UPDATE)
```

---

## Step 3: Server-Side Wishlist API

### Goal
Move wishlist from localStorage to `wishlists` + `wishlist_items` tables.

### Why
Same as cart — persistence, cross-device, admin analytics.

### Backend
Same pattern as cart. Key difference — toggle logic:

**`backend/src/services/wishlistService.js`:**
```js
export async function toggleItem(userId, productId) {
  let wl = await pool.query("SELECT id FROM wishlists WHERE user_id = $1", [userId]);
  if (wl.rows.length === 0) {
    wl = await pool.query("INSERT INTO wishlists (user_id) VALUES ($1) RETURNING id", [userId]);
  }
  const existing = await pool.query(
    "SELECT id FROM wishlist_items WHERE wishlist_id = $1 AND product_id = $2",
    [wl.rows[0].id, productId]
  );
  if (existing.rows.length > 0) {
    await pool.query("DELETE FROM wishlist_items WHERE id = $1", [existing.rows[0].id]);
    return { action: "removed" };
  }
  await pool.query("INSERT INTO wishlist_items (wishlist_id, product_id) VALUES ($1, $2)",
    [wl.rows[0].id, productId]);
  return { action: "added" };
}
```

### Folder Placement
```
backend/src/routes/wishlistRoutes.js, controllers/wishlistController.js, services/wishlistService.js
frontend/src/features/wishlist/wishlistService.js (NEW), WishlistContext.jsx (UPDATE)
```

---

## Step 4: Address Management API

### Goal
CRUD for user addresses. Required before orders work (`orders` references `address_id`).

### Database
Table exists. Add: `CREATE INDEX idx_addresses_user ON addresses(user_id);`

### Backend Key Pattern — Setting default with transaction:
```js
export async function setDefaultAddress(userId, addressId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE addresses SET is_default = false WHERE user_id = $1", [userId]);
    const result = await client.query(
      "UPDATE addresses SET is_default = true WHERE id = $1 AND user_id = $2 RETURNING *",
      [addressId, userId]
    );
    if (result.rows.length === 0) throw new AppError("Address not found", 404);
    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) { await client.query("ROLLBACK"); throw err; }
  finally { client.release(); }
}
```

### Folder Placement
```
backend/src/routes/addressRoutes.js, controllers/addressController.js
backend/src/services/addressService.js, validation/address.schema.js
frontend/src/features/user/addressService.js, AddressForm.jsx, AddressList.jsx
```

---

## Step 5: Orders and Checkout (SQL Transactions)

### Goal
Replace localStorage orders with real server-side checkout using SQL transactions.

### Why
**Most critical e-commerce feature.** Without transactions: stock goes negative, orphaned orders, cart not cleared on failure.

### Backend — THE CRITICAL FUNCTION

**`backend/src/services/orderService.js`:**
```js
export async function checkout(userId, addressId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Get cart with product details
    const cartResult = await client.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.stock_quantity, p.name
       FROM carts c JOIN cart_items ci ON c.id = ci.cart_id
       JOIN products p ON ci.product_id = p.id WHERE c.user_id = $1`, [userId]
    );
    if (cartResult.rows.length === 0) throw new AppError("Cart is empty", 400);

    // 2. Validate stock for ALL items
    for (const item of cartResult.rows) {
      if (item.stock_quantity < item.quantity)
        throw new AppError(`"${item.name}" only has ${item.stock_quantity} left`, 400);
    }

    // 3. Calculate total
    const totalAmount = cartResult.rows.reduce((s, i) => s + i.price * i.quantity, 0);

    // 4. Create order
    const order = await client.query(
      "INSERT INTO orders (user_id, address_id, total_amount) VALUES ($1,$2,$3) RETURNING *",
      [userId, addressId, totalAmount]
    );

    // 5. Insert items + deduct stock
    for (const item of cartResult.rows) {
      await client.query(
        "INSERT INTO order_items (order_id,product_id,quantity,price_at_purchase) VALUES ($1,$2,$3,$4)",
        [order.rows[0].id, item.product_id, item.quantity, item.price]
      );
      await client.query(
        "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    // 6. Clear cart
    const cart = await client.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.rows[0].id]);

    await client.query("COMMIT");
    return order.rows[0];
  } catch (err) { await client.query("ROLLBACK"); throw err; }
  finally { client.release(); }
}
```

> **Why `client` not `pool`?** Transactions MUST use ONE connection. `pool.query()` may use different connections per query, breaking transaction boundaries.

### Request Flow
```
"Place Order" click → orderService.checkout(addressId)
  → POST /api/orders { addressId }
    → protect → orderController.checkout → orderService.checkout(userId, addressId)
      → BEGIN → fetch cart → validate stock → calculate total
        → INSERT order → INSERT items → UPDATE stock → DELETE cart_items
      → COMMIT → 201 { order }
        → Navigate to /order/confirmation → CartContext re-fetches (empty)
```

### Folder Placement
```
backend/src/routes/orderRoutes.js, controllers/orderController.js
backend/src/services/orderService.js, validation/order.schema.js
frontend/src/features/order/orderService.js (REPLACE broken stub)
frontend/src/features/order/OrderContext.jsx (UPDATE)
frontend/src/features/checkout/Checkout.jsx (UPDATE)
```

---

## Step 6: User Profile Update and Password Change

### Goal
Backend endpoints your frontend already calls but don't exist yet.

### Why
`authService.js` calls `PATCH /auth/profile` and `PATCH /auth/change-password` — these routes are missing.

### Backend

**Add to `userRoutes.js`:**
```js
router.patch("/profile", protect, validationMiddleware(updateProfileSchema), updateProfile);
router.patch("/change-password", protect, validationMiddleware(changePasswordSchema), changePassword);
```

**Add to `userService.js`:**
```js
export async function updateUserProfile(userId, data) {
  const { first_name, last_name, phone } = data;
  const result = await pool.query(
    `UPDATE users SET first_name=COALESCE($1,first_name), last_name=COALESCE($2,last_name),
     phone=COALESCE($3,phone), updated_at=CURRENT_TIMESTAMP WHERE id=$4
     RETURNING id,first_name,last_name,email,phone,role`, [first_name,last_name,phone,userId]
  );
  return result.rows[0];
}

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await pool.query("SELECT password_hash FROM users WHERE id=$1", [userId]);
  const isValid = await bcrypt.compare(currentPassword, user.rows[0].password_hash);
  if (!isValid) throw new AppError("Current password is incorrect", 400);
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password_hash=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2", [hash, userId]);
}
```

---

> **Continue to ROADMAP_PART2.md for Steps 7–12:** Admin APIs, Pagination/Search/Sort, Inventory Management, Analytics, Security Hardening, Production Checklist.
