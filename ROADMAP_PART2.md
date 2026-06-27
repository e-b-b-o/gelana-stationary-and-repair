# Gelana E-Commerce — Production Roadmap (Part 2: Steps 7–12)

> Continuation from ROADMAP_PART1.md. Steps build on each other — do not skip.

---

## Step 7: Admin Dashboard APIs

### Goal
Replace `adminMockData.js` with real backend endpoints so the admin dashboard shows live data.

### Why
Your dashboard currently imports hardcoded mock data. A real admin needs to see actual revenue, actual orders, actual user counts. Every admin page (`Dashboard`, `ProductsManagement`, `CategoriesManagement`, `OrdersManagement`, `UsersManagement`) needs its own API endpoint.

### Backend

**`backend/src/routes/adminRoutes.js`:**
```js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/restrictTo.js";
import { getDashboardStats, getAllUsers, updateUserStatus } from "../controllers/adminController.js";
const router = express.Router();
router.use(protect, restrictTo("ADMIN"));

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
// Orders admin routes are in orderRoutes.js (Step 5)
```

**`backend/src/services/adminService.js`:**
```js
export async function getDashboardStats() {
  const stats = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM orders) AS total_orders,
      (SELECT COALESCE(SUM(total_amount), 0) FROM orders) AS total_revenue,
      (SELECT COUNT(*) FROM users WHERE role = 'CUSTOMER') AS total_customers,
      (SELECT COUNT(*) FROM products WHERE is_active = true) AS active_products,
      (SELECT COUNT(*) FROM products WHERE stock_quantity = 0) AS out_of_stock
  `);
  return stats.rows[0];
}

export async function getRevenueByMonth() {
  const result = await pool.query(`
    SELECT TO_CHAR(created_at, 'Mon') AS name,
           SUM(total_amount)::numeric AS revenue
    FROM orders
    WHERE created_at >= NOW() - INTERVAL '7 months'
    GROUP BY TO_CHAR(created_at, 'Mon'), EXTRACT(MONTH FROM created_at)
    ORDER BY EXTRACT(MONTH FROM created_at)
  `);
  return result.rows;
}

export async function getAllUsers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, role, is_active, created_at,
     (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
     FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const countResult = await pool.query("SELECT COUNT(*) FROM users");
  return { users: result.rows, total: parseInt(countResult.rows[0].count) };
}
```

**Register in `app.js`:** `app.use("/api/admin", adminRoutes);`

### Frontend
Create `frontend/src/features/admin/adminService.js`:
```js
import { api } from "../../lib/axios";
export const adminService = {
  getStats: () => api.get("/admin/stats").then(r => r.data.data),
  getRevenue: () => api.get("/admin/stats/revenue").then(r => r.data.data),
  getUsers: (page) => api.get(`/admin/users?page=${page}`).then(r => r.data.data),
};
```

Update `Dashboard.jsx` — replace `adminMockData` import with `useEffect` + `adminService.getStats()`.

Update `ProductsManagement.jsx` — replace mock import with `getProducts()` from existing `productService.js`.

### Request Flow
```
Admin opens /admin → Dashboard.jsx mounts
  → adminService.getStats()
    → GET /api/admin/stats
      → protect → restrictTo("ADMIN") → adminController → adminService
        → Single aggregate SQL query
          → 200 { totalOrders, totalRevenue, totalCustomers, ... }
            → setState → Dashboard re-renders with real data
```

### Folder Placement
```
backend/src/routes/adminRoutes.js         (NEW)
backend/src/controllers/adminController.js (NEW)
backend/src/services/adminService.js       (NEW)
frontend/src/features/admin/adminService.js (NEW)
frontend/src/features/admin/dashboard/Dashboard.jsx (UPDATE)
frontend/src/features/admin/products/ProductsManagement.jsx (UPDATE)
frontend/src/features/admin/orders/OrdersManagement.jsx (UPDATE)
frontend/src/features/admin/users/UsersManagement.jsx (UPDATE)
frontend/src/data/adminMockData.js (DELETE after migration)
```

---

## Step 8: Pagination, Search, Sorting, and Filtering

### Goal
Add server-side pagination, search, sort, and category filter to the products API.

### Why
Your current `getAllProducts()` returns ALL products with no limit. With 1000+ products, this crashes the browser and wastes bandwidth. Your `ProductFilters.jsx` has hardcoded category options (`stationery`, `laptop`) that don't match your actual database categories (`Laptops`, `Accessories`, `Stationary`, `Repairs`). Filtering currently happens client-side — it should happen in SQL.

### Backend

**Update `productService.js`:**
```js
export async function getAllProducts({ page = 1, limit = 12, search, category, sort, order = "ASC" }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`p.name ILIKE $${paramIndex}`);
    params.push(`%${search}%`);
    paramIndex++;
  }
  if (category && category !== "all") {
    conditions.push(`c.name = $${paramIndex}`);
    params.push(category);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Sort mapping to prevent SQL injection
  const sortMap = { price: "p.price", name: "p.name", rating: "p.rating", newest: "p.created_at" };
  const sortColumn = sortMap[sort] || "p.created_at";
  const sortOrder = order === "DESC" ? "DESC" : "ASC";

  const dataQuery = `
    SELECT p.id, p.name, p.description, p.price, p.stock_quantity AS stock,
           p.thumbnail_url AS image, p.is_active, p.rating, p.category_id, c.name AS category
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  params.push(limit, offset);

  const countQuery = `
    SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}
  `;

  const [data, count] = await Promise.all([
    pool.query(dataQuery, params),
    pool.query(countQuery, params.slice(0, paramIndex - 1)),
  ]);

  return {
    products: data.rows,
    total: parseInt(count.rows[0].count),
    page,
    totalPages: Math.ceil(count.rows[0].count / limit),
  };
}
```

**Why `ILIKE` instead of `LIKE`?** Case-insensitive search. Users type "macbook" but DB has "MacBook".

**Why sort mapping?** Never interpolate user input directly into SQL. Map allowed sort fields explicitly.

### Database
Add search index:
```sql
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
-- The trgm index requires: CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Frontend

**Update `ProductFilters.jsx`** — fetch categories from API:
```jsx
const [categories, setCategories] = useState([]);
useEffect(() => {
  api.get("/categories").then(r => setCategories(r.data));
}, []);
// Render dynamic options instead of hardcoded
```

**Update `Products.jsx`** — pass query params to API:
```jsx
const [searchParams] = useSearchParams();
useEffect(() => {
  const params = {
    page: searchParams.get("page") || 1,
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "all",
    sort: searchParams.get("sort") || "newest",
  };
  productService.getProducts(params).then(data => {
    setProducts(data.products);
    setTotalPages(data.totalPages);
  });
}, [searchParams]);
```

**Update `frontend/src/features/products/productService.js`:**
```js
export async function getProducts(params = {}) {
  const response = await api.get("/products", { params });
  return response.data; // { products, total, page, totalPages }
}
```

**New component** — `Pagination.jsx`:
```jsx
export default function Pagination({ currentPage, totalPages }) {
  const [, setSearchParams] = useSearchParams();
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i + 1}
          onClick={() => setSearchParams(prev => { prev.set("page", i + 1); return prev; })}
          className={currentPage === i + 1 ? "bg-primary text-white" : "bg-white"}>
          {i + 1}
        </button>
      ))}
    </div>
  );
}
```

### Request Flow
```
User types "keyboard" + selects "Accessories" + clicks page 2
  → URL becomes /products?q=keyboard&category=Accessories&page=2
    → useEffect triggers → productService.getProducts({ q, category, page })
      → GET /api/products?q=keyboard&category=Accessories&page=2&limit=12
        → productController → productService.getAllProducts(query)
          → SQL: WHERE name ILIKE '%keyboard%' AND c.name = 'Accessories' LIMIT 12 OFFSET 12
            → 200 { products: [...], total: 5, page: 2, totalPages: 1 }
              → setProducts → UI updates grid + pagination
```

### Folder Placement
```
backend/src/services/productService.js     (UPDATE)
backend/src/controllers/productController.js (UPDATE)
frontend/src/features/products/Products.jsx  (UPDATE)
frontend/src/features/products/ProductFilters.jsx (UPDATE — dynamic categories)
frontend/src/features/products/productService.js (UPDATE)
frontend/src/ui/Pagination.jsx (NEW)
```

---

## Step 9: Inventory Management and Product Status

### Goal
Proper stock tracking and product activation/deactivation (soft delete pattern).

### Why
- Hard deleting products breaks `order_items` foreign keys — an order references a product that no longer exists
- `is_active = false` acts as soft delete: product hidden from shop but preserved in order history
- Stock reaching 0 should auto-deactivate or show "Out of Stock"

### Backend

**Add to `productService.js`:**
```js
export async function toggleProductStatus(productId) {
  const result = await pool.query(
    "UPDATE products SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
    [productId]
  );
  return result.rows[0];
}

export async function getLowStockProducts(threshold = 5) {
  const result = await pool.query(
    "SELECT * FROM products WHERE stock_quantity <= $1 AND is_active = true ORDER BY stock_quantity ASC",
    [threshold]
  );
  return result.rows;
}
```

**Update `getAllProducts`** — Public API only shows active:
```js
// Add to WHERE clause for public requests:
conditions.push("p.is_active = true");
// Admin endpoint returns ALL products (active + inactive)
```

**Update `deleteProduct`** — Soft delete instead of hard delete:
```js
export async function deleteProduct(id) {
  // Soft delete: deactivate instead of DELETE
  const result = await pool.query(
    "UPDATE products SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}
```

### Why Soft Delete?
If you `DELETE FROM products WHERE id = 5` and order #42 has `product_id = 5` in `order_items`, the order history breaks. With soft delete, the product stays in DB but is hidden from the storefront.

### Frontend
Admin products table should show status badge and toggle button. Low stock alerts on dashboard.

---

## Step 10: Reviews System

### Goal
Allow customers to review purchased products. Already have `reviews` table.

### Why
Reviews drive purchasing decisions. Your `products` table has a `rating` column — it should be calculated from actual reviews, not manually set.

### Backend

**`backend/src/routes/reviewRoutes.js`:**
```js
router.get("/", getProductReviews);  // Public
router.post("/", protect, validationMiddleware(createReviewSchema), createReview);
router.delete("/:id", protect, deleteReview);
```

**Mount as nested route:**
```js
app.use("/api/products/:productId/reviews", reviewRoutes);
```

**Service key logic** — Only allow review if user purchased the product:
```js
export async function createReview(userId, productId, { rating, comment }) {
  // Check if user bought this product
  const purchased = await pool.query(
    `SELECT 1 FROM orders o JOIN order_items oi ON o.id = oi.order_id
     WHERE o.user_id = $1 AND oi.product_id = $2 AND o.order_status = 'delivered'`,
    [userId, productId]
  );
  if (purchased.rows.length === 0) throw new AppError("You can only review purchased products", 403);

  // Check duplicate
  const existing = await pool.query(
    "SELECT 1 FROM reviews WHERE user_id = $1 AND product_id = $2", [userId, productId]
  );
  if (existing.rows.length > 0) throw new AppError("You already reviewed this product", 400);

  // Insert review
  const result = await pool.query(
    "INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1,$2,$3,$4) RETURNING *",
    [userId, productId, rating, comment]
  );

  // Update product average rating
  await pool.query(
    `UPDATE products SET rating = (SELECT AVG(rating)::numeric(2,1) FROM reviews WHERE product_id = $1) WHERE id = $1`,
    [productId]
  );
  return result.rows[0];
}
```

### Database
Add unique constraint and index:
```sql
ALTER TABLE reviews ADD CONSTRAINT unique_user_product_review UNIQUE (user_id, product_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
```

### Folder Placement
```
backend/src/routes/reviewRoutes.js, controllers/reviewController.js
backend/src/services/reviewService.js, validation/review.schema.js
frontend/src/features/products/ReviewList.jsx, ReviewForm.jsx (NEW)
frontend/src/features/products/ProductDetails.jsx (UPDATE — show reviews)
```

---

## Step 11: Security Hardening

### Goal
Add rate limiting, HTTP security headers, and request logging.

### Why
Without rate limiting, attackers can brute-force login. Without security headers, XSS/clickjacking is possible. Without logging, you can't debug production issues.

### Backend

**Install packages:**
```bash
npm install express-rate-limit helmet morgan
```

**Update `app.js`:**
```js
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

app.use(helmet());  // Sets security headers (X-Frame-Options, CSP, etc.)
app.use(morgan("combined"));  // Logs every request to stdout

// Rate limit auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: { status: "fail", message: "Too many attempts, try again in 15 minutes" },
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
```

### Why Each Package?
| Package | Why |
|---------|-----|
| `helmet` | Sets 15+ HTTP headers that prevent XSS, clickjacking, MIME sniffing |
| `morgan` | Logs method, URL, status, response time — essential for debugging |
| `express-rate-limit` | Prevents brute-force attacks on login/register |

### CORS — Tighten for production
```js
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
```
Use env var so you can change it per environment without code changes.

---

## Step 12: Production Deployment Checklist

### Goal
Final items before deploying.

### Environment Variables
Create `.env.example` (committed to git, no secrets):
```env
PORT=5000
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=5432
JWT_SECRET=
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Database
- [ ] Run all schema changes from this roadmap
- [ ] Add `updated_at` trigger for auto-updating timestamps:
```sql
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = CURRENT_TIMESTAMP; RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- Repeat for users, orders
```

### Frontend
- [ ] Set `VITE_API_URL` env var for production backend URL
- [ ] Remove all `console.log` statements
- [ ] Error boundaries around route components
- [ ] 404 page for unknown routes (already have `PageNotFound`)

### Backend
- [ ] Set `NODE_ENV=production`
- [ ] Cookie `secure: true` (requires HTTPS)
- [ ] Remove the old audit file `PROJECT_AUDIT_AND_PRODUCTION_ROADMAP.md` (outdated)
- [ ] Add `pg` to `package.json` dependencies

### Axios Interceptor — Global error handling
```js
// frontend/src/lib/axios.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);
```

---

## Priority Summary

| Priority | Step | Feature | Depends On |
|----------|------|---------|------------|
| 🔴 1 | Fix Foundation | Security + validation fixes | Nothing |
| 🔴 2 | Cart API | Server-side cart | Step 1 |
| 🔴 3 | Wishlist API | Server-side wishlist | Step 1 |
| 🟡 4 | Addresses | Address CRUD | Step 1 |
| 🔴 5 | Orders/Checkout | Transactional checkout | Steps 2 + 4 |
| 🟡 6 | User Profile | Update profile + password | Step 1 |
| 🟡 7 | Admin APIs | Replace mock data | Steps 2-5 |
| 🟢 8 | Pagination/Search | Server-side filtering | Step 1 |
| 🟢 9 | Inventory | Soft delete + stock tracking | Step 5 |
| 🟢 10 | Reviews | Product reviews | Step 5 |
| 🟢 11 | Security | Rate limiting + headers | Step 1 |
| 🟢 12 | Production | Deployment prep | All steps |

🔴 = Must have | 🟡 = Should have | 🟢 = Nice to have (but expected in production)

---

## Architecture After Completing All Steps

```
backend/
├── db/
│   ├── connection.js
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── controllers/
│   │   ├── adminController.js      ← NEW
│   │   ├── addressController.js     ← NEW
│   │   ├── cartController.js        ← NEW
│   │   ├── categoryController.js
│   │   ├── orderController.js       ← NEW
│   │   ├── productController.js
│   │   ├── productImageController.js
│   │   ├── reviewController.js      ← NEW
│   │   ├── userController.js
│   │   └── wishlistController.js    ← NEW
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── restrictTo.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   ├── routes/
│   │   ├── adminRoutes.js           ← NEW
│   │   ├── addressRoutes.js         ← NEW
│   │   ├── cartRoutes.js            ← NEW
│   │   ├── categoriesRoutes.js
│   │   ├── orderRoutes.js           ← NEW
│   │   ├── productImageRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js          ← NEW
│   │   ├── userRoutes.js
│   │   └── wishlistRoutes.js        ← NEW
│   ├── services/
│   │   ├── adminService.js          ← NEW
│   │   ├── addressService.js        ← NEW
│   │   ├── cartService.js           ← NEW
│   │   ├── categoriesService.js
│   │   ├── orderService.js          ← NEW
│   │   ├── productImageService.js
│   │   ├── productService.js
│   │   ├── reviewService.js         ← NEW
│   │   ├── userService.js
│   │   └── wishlistService.js       ← NEW
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── catchAsync.js
│   │   └── jwt.js
│   ├── validation/
│   │   ├── address.schema.js        ← NEW
│   │   ├── cart.schema.js           ← NEW
│   │   ├── category.schema.js
│   │   ├── order.schema.js          ← NEW
│   │   ├── product.schema.js
│   │   ├── productImage.schema.js
│   │   ├── review.schema.js         ← NEW
│   │   └── user.schema.js
│   └── app.js
├── uploads/products/
└── server.js

frontend/src/
├── features/
│   ├── admin/
│   │   ├── adminService.js          ← NEW
│   │   └── ... (existing components — UPDATE to use API)
│   ├── cart/
│   │   ├── cartService.js           ← NEW
│   │   └── CartContext.jsx          (UPDATE)
│   ├── order/
│   │   ├── orderService.js          (REPLACE)
│   │   └── OrderContext.jsx         (UPDATE)
│   ├── products/
│   │   ├── ReviewList.jsx           ← NEW
│   │   ├── ReviewForm.jsx           ← NEW
│   │   └── productService.js       (UPDATE)
│   ├── user/
│   │   ├── addressService.js        ← NEW
│   │   ├── AddressForm.jsx          ← NEW
│   │   └── AddressList.jsx          ← NEW
│   └── wishlist/
│       ├── wishlistService.js       ← NEW
│       └── WishlistContext.jsx      (UPDATE)
├── ui/
│   ├── Pagination.jsx               ← NEW
│   └── ... (existing)
└── lib/
    └── axios.js                     (UPDATE — add interceptor)
```

---

> **Start today with Step 1.** It takes 30 minutes and makes everything else safer. Then move to Step 2 (Cart API) — it's the backbone of Steps 3-5.
