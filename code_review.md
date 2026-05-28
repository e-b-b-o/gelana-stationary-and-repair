# GelanaTech — Comprehensive Code Review

> This review covers every file in the project. Issues are ordered by severity within each section: 🔴 Critical bugs → 🟠 Important → 🟡 Improvement → 🟢 Nice-to-have.

---

## 1. Full Project Review

### 🔴 CRITICAL BUG #1 — `useCart()` hook never returns its value

**File:** [CartContext.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/CartContext.jsx#L61-L66)

```js
function useCart() {
  const context = useContext(CartContext);
  if (context === undefined)
    throw new Error("CartContext was used outside of CartProvider");
  // ❌ Missing: return context;
}
```

**Why it matters:** Every component that calls `useCart()` — including your Navbar — receives `undefined` instead of the cart state. The cart badge, add-to-cart, quantity buttons — **nothing works**. This is a runtime crash waiting to happen (or already happening silently).

**How to fix:** Add `return context;` as the last line of `useCart()`, identical to how your `useAuth()` hook does it in [AuthContext.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/AuthContext.jsx#L49-L56).

---

### 🔴 CRITICAL BUG #2 — Reducer default case wraps state in extra object

**File:** [cartReducer.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/cartReducer.jsx#L50-L51)

```js
default:
  return { state };  // ❌ Returns { state: { cartItems: [...] } }
```

**Why it matters:** If any unknown action type is dispatched (even accidentally), your entire state shape breaks. `state.cartItems` becomes `undefined` on the next render, crashing `reduce()`, `map()`, and `filter()` calls.

**Best practice:** The default case should either return `state` unchanged or throw an error (like your `authReducer` does).

```js
default:
  return state;  // ✅ or: throw new Error(`Unknown cart action: ${action.type}`);
```

---

### 🔴 CRITICAL BUG #3 — Action type mismatch between CartContext and cartReducer

**File:** [CartContext.jsx L26](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/CartContext.jsx#L25-L27) dispatches `"cart/removeid"`, but [cartReducer.jsx L26](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/cartReducer.jsx#L26) handles `"cart/removeItem"`.

```
CartContext dispatches → "cart/removeid"
cartReducer handles   → "cart/removeItem"
```

**Why it matters:** Clicking "Remove" will never remove the item. The action falls through to the `default` case (which, combined with Bug #2, also corrupts state).

**How to fix:** Change the dispatch in `CartContext.jsx` to match:
```js
const removeItem = (id) => {
  dispatch({ type: "cart/removeItem", payload: id }); // ✅ matches reducer
};
```

**Best practice to prevent this class of bugs permanently:** Define action type constants in a single file:

```js
// features/cart/cartActionTypes.js
export const ADD_ITEM = "cart/addItem";
export const REMOVE_ITEM = "cart/removeItem";
export const INCREASE_QTY = "cart/increaseQuantity";
export const DECREASE_QTY = "cart/decreaseQuantity";
export const CLEAR = "cart/clear";
export const INIT = "cart/init";
```

Then import these constants in both `CartContext.jsx` and `cartReducer.jsx`. This way a typo becomes a compile-time import error instead of a silent runtime bug.

---

### 🔴 CRITICAL BUG #4 — Missing `cart/init` handler in reducer

**File:** [CartContext.jsx L12](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/CartContext.jsx#L9-L14) dispatches `"cart/init"` to hydrate from localStorage, but [cartReducer.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/cartReducer.jsx) has no `case "cart/init"`.

**Why it matters:** On every page load, the localStorage data is parsed and dispatched, but it hits the broken `default` case — corrupting the state shape immediately on mount.

**How to fix:** Add a `cart/init` case to your reducer:

```js
case "cart/init":
  return { ...state, cartItems: action.payload };
```

---

### 🟠 BUG #5 — `totalPrice` doesn't account for quantity

**File:** [CartContext.jsx L41](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/CartContext.jsx#L41)

```js
const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
// ❌ Should be: sum + item.price * item.quantity
```

**Why it matters:** If someone adds 3 keyboards at 1200 ETB each, the total shows 1200 instead of 3600.

---

### 🟠 BUG #6 — Cart page reads from static `products` array, not cart state

**File:** [Cart.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/Cart.jsx#L1-L6)

```js
import products from "../../data/products";
// ...
const subtotal = products.reduce((acc, product) => acc + product.price, 0);
// ...
{products.map((product) => (
  <CartItems product={product} key={product.id} />
))}
```

**Why it matters:** The cart page always shows ALL products regardless of what the user actually added. It never uses your CartContext.

**How to fix:** Step by step:
1. Import `useCart` at the top of `Cart.jsx`
2. Destructure `{ cartItems, totalPrice, totalItems, clear }` from `useCart()`
3. Replace `products.map(...)` with `cartItems.map(...)`
4. Replace the hardcoded `subtotal` with `totalPrice` from context
5. Show an empty-cart state when `cartItems.length === 0`

---

### 🟠 BUG #7 — Cart item quantity is hardcoded to "1"

**File:** [CartItems.jsx L67](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/CartItems.jsx#L67)

```jsx
<span className="min-w-5 text-center text-sm font-medium">1</span>
```

**Why it matters:** Even when the user clicks "+", the displayed quantity never changes.

**How to fix:** Display `product.quantity` from the cart item. The cart reducer already maintains a `quantity` field.

---

### 🟠 BUG #8 — No `onClick` handlers on cart item buttons

**File:** [CartItems.jsx L63-L71](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/CartItems.jsx#L62-L72)

The `+`, `−`, and `✕` (remove) buttons have no `onClick` handlers. They render but do nothing.

**How to fix:** 
1. Import `useCart` in `CartItems.jsx`
2. Destructure `{ increaseQuantity, decreaseQuantity, removeItem }`
3. Attach handlers:

```jsx
<Button onClick={() => decreaseQuantity(product.id)} ...>
  <MinusIcon ... />
</Button>

<span>{product.quantity}</span>

<Button onClick={() => increaseQuantity(product.id)} ...>
  <PlusIcon ... />
</Button>

// Remove button:
<button onClick={() => removeItem(product.id)} ...>
  <XMarkIcon ... />
</button>
```

---

### 🟠 BUG #9 — "Add to Cart" button has no `onClick` handler

**File:** [ProductCard.jsx L23-L25](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/products/ProductCard.jsx#L22-L26)

```jsx
<Button variant="primary" size="sm">
  Add to cart   {/* ❌ No onClick */}
</Button>
```

**How to fix:**
1. Import `useCart` in `ProductCard.jsx`
2. Destructure `{ addItem }`
3. Add the handler:

```jsx
<Button variant="primary" size="sm" onClick={() => addItem(product)}>
  Add to cart
</Button>
```

---

### 🟠 ISSUE #10 — Signup calls `login()` instead of a separate signup flow

**File:** [signup.jsx L27](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/signup.jsx#L22-L31)

```js
login(newUser);        // ← calls login, not signup
navigate("/login");    // ← then navigates to login page (user is already logged in)
```

**Why it matters:** 
- There's no actual registration — signup just calls login with a new object.
- After signup, the user is logged in but gets sent to the login page, which is confusing UX.

**Recommended approach:**
- For now (no backend), navigate to `"/"` after signup, not `"/login"`.
- When you add a backend, create a separate `signup` action in your AuthContext that calls a registration API, then optionally auto-logs in.

---

### 🟠 ISSUE #11 — Unused import in `main.jsx`

**File:** [main.jsx L6](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/main.jsx#L6)

```js
import App from "./app/App";  // ❌ Never used — RouterProvider handles rendering
```

**How to fix:** Remove the line. Your `RouterProvider` with the `router` config handles everything. `App.jsx` itself is also unused and can be deleted.

---

### 🟠 ISSUE #12 — `Home.jsx` imports `Footer` but Layout already renders it

**File:** [Home.jsx L4](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/home/Home.jsx#L4)

```js
import Footer from "../../ui/Footer";  // ❌ Imported but not used in JSX
```

**Why it matters:** It's a dead import now, but if you ever render it here, you'll get a double footer.

**How to fix:** Remove the import.

---

### 🟠 ISSUE #13 — `ProtectedRoute` exists but is never used

**File:** [ProtectedRoute.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/ProtectedRoute.jsx)

You built a `ProtectedRoute` component, but none of your routes in [router.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/app/router.jsx) use it.

**How to fix:** Wrap protected pages (cart, profile, orders) in your router config:

```jsx
import ProtectedRoute from "../features/auth/ProtectedRoute";

// In your route config:
{ path: "cart", element: <ProtectedRoute><Cart /></ProtectedRoute> },
{ path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
```

---

### 🟠 ISSUE #14 — Hero buttons are not navigation-enabled

**File:** [Hero.jsx L23-L28](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/home/Hero.jsx#L22-L29)

```jsx
<Button variant="primary" size="md">
  Shop Products    {/* ❌ No `to` prop — doesn't navigate */}
</Button>
<Button variant="outlineHero" size="md">
  Book Repair      {/* ❌ Same issue */}
</Button>
```

**How to fix:** Add `to` props:

```jsx
<Button variant="primary" size="md" to="/products">Shop Products</Button>
<Button variant="outlineHero" size="md" to="/booking">Book Repair</Button>
```

Same issue exists in [Cta.jsx L15-L20](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/home/Cta.jsx#L14-L21).

---

### 🟡 ISSUE #15 — Missing relative path prefix in Categories

**File:** [Categories.jsx L38](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/home/Categories.jsx#L38)

```jsx
<Button variant="outline" size="sm" to="booking">  {/* ❌ Missing leading "/" */}
```

The other two buttons use `/products` (absolute path). This one uses `booking` (relative path). It works from the homepage (`/`), but would break on nested routes.

**How to fix:** Change to `to="/booking"`.

---

### 🟡 ISSUE #16 — `BookingForm` has no form state management

**File:** [BookingForm.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/booking/BookingForm.jsx)

Every input, select, and textarea is uncontrolled — no `value`, no `onChange`, no `onSubmit`. The "Book Repair" button does nothing.

**Why it matters:** No data can be captured, validated, or submitted.

**How to fix (step by step):**
1. Add `useState` for each field (name, phone, brand, serviceType, date, description)
2. Make each input controlled with `value` and `onChange`
3. Add a `handleSubmit` function on the form
4. Add validation before submission
5. Later: connect to an API or at minimum show a success toast

---

### 🟡 ISSUE #17 — `.jsx` file extension for non-JSX files

**Files:** [cartReducer.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/cartReducer.jsx), [authReducer.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/authReducer.jsx)

These files contain only plain JavaScript (no JSX syntax). Using `.jsx` extension is misleading.

**Best practice:** Rename to `.js`. This is a convention signal to other developers: "this file contains React components" vs "this is pure logic."

---

### 🟡 ISSUE #18 — Inconsistent file naming conventions

- Feature components: `login.jsx`, `signup.jsx` — lowercase
- UI components: `Button.jsx`, `Footer.jsx` — PascalCase
- Feature folder: `Order` — PascalCase vs `cart`, `auth` — lowercase

**Best practice:** React components should always be PascalCase (`Login.jsx`, `Signup.jsx`). Feature folders should be lowercase (`order/` not `Order/`). Be consistent.

---

### 🟡 ISSUE #19 — `<label>` elements not associated with inputs

**Files:** [login.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/login.jsx), [signup.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/signup.jsx), [BookingForm.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/booking/BookingForm.jsx)

```jsx
<label className="text-sm font-medium text-primary">Email Address</label>
<Input ... />
```

**Why it matters:** Screen readers can't associate the label with its input. Clicking the label doesn't focus the input. This is an accessibility violation (WCAG).

**How to fix:** Either:
- Add `htmlFor` on the label and `id` on the input (matching values)
- Or wrap the input inside the label element

Best approach: Update your `Input` component to accept an `id` prop and pass it through:

```jsx
<label htmlFor="email">Email Address</label>
<Input id="email" ... />
```

---

### 🟡 ISSUE #20 — Password visibility toggle is non-functional

**Files:** [login.jsx L85](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/login.jsx#L85), [signup.jsx L86](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/auth/signup.jsx#L86)

The `EyeIcon` is rendered but has no click handler to toggle between `type="password"` and `type="text"`.

**How to fix:**
1. Add a `const [showPassword, setShowPassword] = useState(false)` state
2. Toggle the input `type`: `type={showPassword ? "text" : "password"}`
3. Add `onClick={() => setShowPassword(prev => !prev)}` to the `EyeIcon`
4. Swap icon to `EyeSlashIcon` when password is visible

---

### 🟢 ISSUE #21 — `<title>` says "laptop-shop"

**File:** [index.html L15](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/index.html#L15)

**How to fix:** Change to `GelanaTech — Stationery & Repair` or your preferred brand title.

---

### 🟢 ISSUE #22 — Missing `<meta name="description">`

**File:** [index.html](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/index.html)

Add a meta description for SEO:
```html
<meta name="description" content="GelanaTech — Your trusted store for stationery, laptop parts, and repair services in Addis Ababa, Ethiopia." />
```

---

### 🟢 ISSUE #23 — Product card `alt` text is generic

**File:** [ProductCard.jsx L10](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/products/ProductCard.jsx#L10)

```jsx
alt="product image"  // ❌ Generic
```

**How to fix:** Use the product name: `alt={product.name}`

---

## 2. Add to Cart — Architectural Analysis

### Current State Summary

Your reducer logic in [cartReducer.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/cart/cartReducer.jsx) is **well-designed in concept** — it handles add, remove, increase, decrease, and clear. The architecture of using `useReducer` + Context is the right choice for this app size. The problems are all in the **wiring** (bugs listed above), not the architecture.

### How to Properly Wire `onClick` — Step by Step

**Step 1: Fix the 4 critical bugs first** (Issues #1–#4 above). Nothing will work until these are resolved.

**Step 2: Wire `ProductCard.jsx` (Add to Cart trigger)**

This is the component where the user first interacts with cart. It should:
- Import `useCart`
- Call `addItem(product)` on click
- Optionally show visual feedback (e.g., brief "Added!" text or a toast)

```jsx
// Inside ProductCard
const { addItem } = useCart();

<Button variant="primary" size="sm" onClick={() => addItem(product)}>
  Add to cart
</Button>
```

**Step 3: Wire `CartItems.jsx` (quantity controls and remove)**

This component needs access to `increaseQuantity`, `decreaseQuantity`, and `removeItem`:

```jsx
const { increaseQuantity, decreaseQuantity, removeItem } = useCart();
```

Then attach to the appropriate buttons (see Issue #8 above for specifics).

**Step 4: Wire `Cart.jsx` (use cart state, not static products)**

Replace the static `products` import with `useCart()` data (see Issue #6 above).

### Cart State Flow Diagram

```
ProductCard (Add to Cart click)
  → dispatch("cart/addItem")
    → cartReducer updates state
      → CartContext re-renders
        → Navbar badge updates (totalItems)
        → Cart page updates (cartItems, totalPrice)
```

### Which state should be local vs. global?

| State | Scope | Reason |
|-------|-------|--------|
| `cartItems` | **Global** (Context) | Needed by Navbar badge, Cart page, Checkout |
| `totalItems`, `totalPrice` | **Derived** (computed in Context) | Calculated from cartItems, shared across components |
| Quantity input field (if you add one) | **Local** (component) | Only relevant to that cart item's row |
| "Item added" toast visibility | **Local** (ProductCard) | Only relevant to that card |
| Mobile menu open/close | **Local** (Navbar) | Already correctly local ✅ |

### Is Context API enough?

**Yes, for your current scale.** Context + useReducer is the right tool here. You have:
- A single shared state (cart)
- Predictable actions (add, remove, increase, decrease, clear)
- No async operations on cart

**When you'd need to move to Zustand or Redux:** If you add complex features like:
- Server-side cart sync
- Optimistic updates
- Multiple independent stores that interact
- Middleware (logging, analytics)

For now, stay with Context + useReducer. It's perfectly appropriate.

### How to persist cart data properly

Your current approach (localStorage in `useEffect`) is correct in principle, but has the timing issue with `cart/init`. Here's the robust pattern:

**Step 1:** Use a lazy initializer for `useReducer` instead of a separate `useEffect`:

```js
function getInitialState() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    try {
      return { cartItems: JSON.parse(saved) };
    } catch {
      return initialState;
    }
  }
  return initialState;
}

const [{ cartItems }, dispatch] = useReducer(cartReducer, null, getInitialState);
```

**Step 2:** Keep the sync-to-localStorage `useEffect`:
```js
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}, [cartItems]);
```

**Step 3:** Remove the `cart/init` dispatch `useEffect` entirely — no longer needed.

**Why this is better:** 
- The lazy initializer runs synchronously before the first render
- No flash of empty cart on page load
- No need for the `cart/init` action type at all
- `try/catch` handles corrupted localStorage gracefully

### How to calculate totals cleanly

Your derived state approach in CartContext is correct. Fix the quantity bug:

```js
const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

**Advanced (memoization):** If your cart grows large or the provider re-renders often, you can memoize:

```js
const totalItems = useMemo(
  () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
  [cartItems]
);
```

But for 6-20 items, this is unnecessary optimization. Only add `useMemo` when you measure a real performance problem.

---

## 3. Dynamic Product Details Page — Implementation Guide

You don't currently have a `/products/:id` route. Here's exactly how to build it.

### Step 1: Create the route

In [router.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/app/router.jsx), add a new child route:

```jsx
{ path: "products/:productId", element: <ProductDetail /> },
```

Place it **after** `{ path: "products", element: <Products /> }`. React Router matches more specific routes first when using `createBrowserRouter`, so ordering doesn't strictly matter, but it's good convention.

### Step 2: Create the component file

Create `src/features/products/ProductDetail.jsx`.

The component responsibility chain:
1. Read `productId` from the URL
2. Find the matching product
3. Handle "not found" case
4. Render product details
5. Provide "Add to Cart" functionality
6. Show related products

### Step 3: Read route params

```jsx
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { productId } = useParams();  // string, e.g. "3"
  // ...
}
```

### Step 4: Fetch product by ID

Since your data is local (not from an API), find the product directly:

```jsx
import products from "../../data/products";

const product = products.find((p) => p.id === Number(productId));
```

**When you move to an API later:** Replace this with a `useEffect` + fetch pattern:

```jsx
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch(`/api/products/${productId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    })
    .then(setProduct)
    .catch(setError)
    .finally(() => setLoading(false));
}, [productId]);
```

Even better, extract this into a **custom hook**:

```jsx
// hooks/useProduct.js
function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ... fetch logic
  return { product, loading, error };
}
```

### Step 5: Handle loading and error states

For the static data approach:

```jsx
if (!product) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold">Product Not Found</h1>
      <p className="text-muted mt-2">The product you're looking for doesn't exist.</p>
      <Button to="/products" variant="primary" size="md" className="mt-6">
        Back to Products
      </Button>
    </section>
  );
}
```

For the API approach, add:
```jsx
if (loading) return <div className="text-center py-20">Loading...</div>;
if (error) return <div className="text-center py-20 text-red-500">{error.message}</div>;
```

### Step 6: Link product cards to the detail page

In [ProductCard.jsx](file:///home/e-b-b-a/Desktop/MyFiles/03_Full_Stack/FrontEnd/Projects/gelana-stationary-and-repair/src/features/products/ProductCard.jsx), wrap the card (or the image/name) in a link:

```jsx
import { Link } from "react-router-dom";

// Wrap the image and name:
<Link to={`/products/${product.id}`}>
  <img src={product.image} alt={product.name} ... />
  <h3 ...>{product.name}</h3>
</Link>
```

**Don't** wrap the entire card including the "Add to Cart" button — clicking the button shouldn't navigate.

### Step 7: Related products logic

Show products from the same category, excluding the current one:

```jsx
const relatedProducts = products
  .filter((p) => p.category === product.category && p.id !== product.id)
  .slice(0, 4);
```

Then render using your existing `ProductCard` component:

```jsx
{relatedProducts.length > 0 && (
  <section className="mt-16">
    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {relatedProducts.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  </section>
)}
```

### Step 8: Add to Cart integration

The detail page should allow adding to cart with a quantity selector:

```jsx
const [quantity, setQuantity] = useState(1);
const { addItem } = useCart();

function handleAddToCart() {
  // Add the item with selected quantity
  for (let i = 0; i < quantity; i++) {
    addItem(product);
  }
  // Or better: modify your reducer to accept a quantity parameter
}
```

**Better approach:** Modify `addItem` to accept a quantity:

```js
// In CartContext:
const addItem = (item, qty = 1) => {
  dispatch({ type: "cart/addItem", payload: { ...item, qty } });
};

// In cartReducer, update the addItem case:
case "cart/addItem": {
  const item = action.payload;
  const qty = item.qty || 1;
  const existing = state.cartItems.find((i) => i.id === item.id);
  if (existing) {
    return {
      ...state,
      cartItems: state.cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
      ),
    };
  }
  return {
    ...state,
    cartItems: [...state.cartItems, { ...item, quantity: qty }],
  };
}
```

### Component structure summary

```
src/features/products/
├── Products.jsx          — product listing page (/products)
├── ProductCard.jsx       — reusable card (used on listing & home)
├── ProductDetail.jsx     — [NEW] detail page (/products/:productId)
└── FeaturedProducts.jsx  — featured section on home
```

---

## 4. Context API State Management Review

### Current Architecture Assessment

You have two contexts:
- **AuthContext** — manages user, isAuthenticated, loading
- **CartContext** — manages cartItems, derived totals

**What's good:**
- ✅ Separating auth and cart into distinct contexts is correct
- ✅ Using `useReducer` for both is appropriate for the action complexity
- ✅ Custom hooks (`useAuth`, `useCart`) with error boundaries is best practice
- ✅ Provider wrapping order in `main.jsx` makes sense (auth above cart)

### Scalability Assessment

**Current structure scales fine for:** 2-5 contexts, up to ~20 components deep.

**When it stops scaling:**
- If you add more contexts (products, orders, notifications, theme) and provider nesting becomes 5+ levels deep
- If multiple contexts need to communicate with each other
- If you need middleware (logging, error tracking per action)

### Should contexts be split further?

**No, not yet.** Your two contexts have clean, separate responsibilities. Splitting cart into "CartItemsContext" and "CartTotalsContext" would be premature optimization.

**When to split:** If you notice that components that only read `totalItems` (like Navbar badge) are re-rendering when `cartItems` changes internally. But with 6 products, this is imperceptible.

### Are unnecessary re-renders happening?

**Yes, potentially.** The `CartProvider` value object is recreated on every render:

```jsx
value={{
  cartItems,   // new reference if items change ✅
  addItem,     // new function reference every render ❌
  removeItem,  // same ❌
  // ...
}}
```

Every time `CartProvider` re-renders, `addItem`, `removeItem`, etc. are new function references, causing all consumers to re-render even if `cartItems` hasn't changed.

**How to fix (when it matters):**

```jsx
const addItem = useCallback((item) => {
  dispatch({ type: "cart/addItem", payload: item });
}, []);

const removeItem = useCallback((id) => {
  dispatch({ type: "cart/removeItem", payload: id });
}, []);

// ... same for other action functions

const contextValue = useMemo(() => ({
  cartItems,
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
  clear,
  totalItems,
  totalPrice,
}), [cartItems, totalItems, totalPrice, addItem, removeItem, increaseQuantity, decreaseQuantity, clear]);

return (
  <CartContext.Provider value={contextValue}>
    {children}
  </CartContext.Provider>
);
```

**When it matters:** When you have 50+ components consuming the context, or expensive child trees that shouldn't re-render on every cart action. For your current app, this is a nice-to-have, not urgent.

### Should you switch to Zustand or Redux?

**Not yet.** Here's a decision framework:

| Feature Need | Context + useReducer | Zustand | Redux Toolkit |
|---|---|---|---|
| Simple shared state | ✅ Perfect | Overkill | Overkill |
| Async API calls in state | Possible but messy | ✅ Clean | ✅ RTK Query |
| Devtools debugging | ❌ None | ✅ Built-in | ✅ Built-in |
| Multiple stores | Nesting hell | ✅ Easy | ✅ Slices |
| Server state (caching, revalidation) | ❌ | ❌ | ✅ RTK Query |
| Learning curve | None | Low | Medium |

**My recommendation for your growth path:**
1. **Now:** Fix the bugs, keep Context + useReducer
2. **When you add a backend:** Consider Zustand for simplicity or RTK Query if you need server-state caching
3. **When you have 5+ state domains:** Consider Zustand (simpler) or Redux Toolkit (more structured)

### Async state handling

Your auth `loading` state exists in the reducer but is never toggled. When you add real API calls:

```js
async function login(email, password) {
  dispatch({ type: "auth/loading" });
  try {
    const res = await fetch("/api/auth/login", { ... });
    const userData = await res.json();
    dispatch({ type: "auth/login", payload: userData });
  } catch (err) {
    dispatch({ type: "auth/error", payload: err.message });
  }
}
```

You'll need to add an `auth/error` case to your reducer and an `error` field to your state.

---

## 5. Refactoring & Architecture Suggestions

### What's Good ✅

1. **Feature-based folder structure** (`features/cart`, `features/auth`) — this is industry best practice
2. **Reusable UI components** (`Button`, `Input`) with variant/size APIs — clean pattern
3. **Separation of layout** (Layout.jsx with Outlet) — correct use of React Router
4. **Reducer pattern** for complex state — right architectural choice
5. **Custom context hooks** (`useAuth`, `useCart`) — proper encapsulation
6. **`formatCurrency` utility** — good separation of concerns
7. **Product data structure** with category, rating, stock, featured — well thought out

### Folder Structure — Improvements

Current (good start):
```
src/
├── app/        ← router + App
├── data/       ← static data
├── features/   ← domain features
├── ui/         ← shared UI components
└── utils/      ← utility functions
```

Recommended additions:
```
src/
├── app/
├── data/
├── features/
│   ├── auth/
│   ├── cart/
│   ├── booking/
│   ├── home/
│   ├── order/       ← lowercase (rename from "Order")
│   ├── products/
│   └── user/
├── hooks/           ← [NEW] shared custom hooks
├── ui/
│   ├── components/  ← [NEW] organize further when you have 10+ UI components
│   └── layouts/     ← [NEW] move Layout.jsx here
└── utils/
```

### Custom Hooks You Should Extract

**1. `useLocalStorage` hook** — you repeat the localStorage pattern in both auth and cart:

```js
// hooks/useLocalStorage.js
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

**2. `useClickOutside` hook** — you use this in `UserDropdown`:

```js
// hooks/useClickOutside.js
import { useEffect, useRef } from "react";

export function useClickOutside(handler) {
  const ref = useRef();

  useEffect(() => {
    function listener(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [handler]);

  return ref;
}
```

Usage becomes much cleaner:
```jsx
const dropdownRef = useClickOutside(() => setIsOpen(false));
```

### Reusable UI Patterns to Add

**1. Section component** — you repeat the section layout pattern everywhere:

```jsx
// ui/Section.jsx
function Section({ title, subtitle, children, className = "" }) {
  return (
    <section className={`max-w-6xl mx-auto px-4 py-12 md:py-16 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center space-y-2 mb-8">
          {title && <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>}
          {subtitle && <p className="text-sm md:text-base text-muted">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
```

**2. EmptyState component** — for empty cart, no search results, etc.

**3. Badge component** — for the cart count in navbar.

### Error Boundaries

You have none. If any component throws, the entire app crashes to a white screen.

**How to implement:**

1. Create `ui/ErrorBoundary.jsx` (must be a class component — hooks can't catch render errors):

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <button onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

2. Wrap your Layout in it:

```jsx
// In router.jsx, use errorElement:
{
  path: "/",
  element: <Layout />,
  errorElement: <ErrorBoundary />,
  children: [...]
}
```

React Router v7 also has built-in `errorElement` support, which you should leverage.

### Lazy Loading & Code Splitting

Your app currently imports everything eagerly. For pages the user may never visit, this wastes bandwidth.

**How to implement:**

```jsx
// router.jsx
import { lazy, Suspense } from "react";

const Products = lazy(() => import("../features/products/Products"));
const Booking = lazy(() => import("../features/booking/Booking"));
const Cart = lazy(() => import("../features/cart/Cart"));
const Profile = lazy(() => import("../features/user/Profile"));
const Login = lazy(() => import("../features/auth/login"));
const Signup = lazy(() => import("../features/auth/signup"));

// In your route config, wrap with Suspense:
{
  path: "products",
  element: (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <Products />
    </Suspense>
  ),
},
```

**When this matters:** When your app grows to 20+ pages and the JS bundle exceeds 200KB. For 6 pages, it's a nice-to-have.

### Accessibility Quick Wins

1. **Add `aria-label` to icon-only buttons** (hamburger menu, cart icon, remove button)
2. **Add `role="navigation"` to nav elements** (already using `<nav>`, so this is fine)
3. **Add `aria-expanded` to dropdown triggers**:
   ```jsx
   <button aria-expanded={isOpen} aria-haspopup="true" ...>
   ```
4. **Trap focus in mobile menu** when open (prevents tabbing to elements behind it)
5. **Add `aria-live="polite"` to the cart badge** so screen readers announce count changes

### Type Safety

Your `package.json` includes `@types/react` and `@types/react-dom` but you're not using TypeScript. These packages do nothing for `.jsx` files.

**Options:**
- **Minimal:** Add JSDoc type annotations to your utility functions and context hooks
- **Full:** Migrate to TypeScript (rename `.jsx` → `.tsx`, add `tsconfig.json`). This prevents bugs like the action type mismatch (Issue #3) at compile time.

For a growing project, TypeScript is strongly recommended. You can migrate incrementally — rename one file at a time.

---

## Priority Action Plan

Here's the order I'd recommend implementing changes:

### Phase 1 — Fix Breaking Bugs (Do Today)
1. ⬜ Add `return context` to `useCart()` (Bug #1)
2. ⬜ Fix reducer default case: `return state` (Bug #2)
3. ⬜ Fix action type mismatch: `"cart/removeid"` → `"cart/removeItem"` (Bug #3)
4. ⬜ Add `cart/init` case to reducer OR use lazy initializer (Bug #4)
5. ⬜ Fix `totalPrice` calculation to use `price * quantity` (Bug #5)

### Phase 2 — Make Cart Functional (This Week)
6. ⬜ Wire `ProductCard` "Add to Cart" button with `onClick`
7. ⬜ Wire `CartItems` +/−/remove buttons with `onClick`
8. ⬜ Make `Cart.jsx` read from `useCart()` not static products
9. ⬜ Display actual `product.quantity` in CartItems
10. ⬜ Add empty cart state UI

### Phase 3 — Complete Broken Features (This Week)
11. ⬜ Make Hero and CTA buttons navigate (add `to` props)
12. ⬜ Fix Categories relative path (`booking` → `/booking`)
13. ⬜ Wire BookingForm with state management
14. ⬜ Use ProtectedRoute on cart/profile routes
15. ⬜ Remove dead imports (App, Footer in Home)

### Phase 4 — Product Detail Page (Next Week)
16. ⬜ Create `ProductDetail.jsx`
17. ⬜ Add route in `router.jsx`
18. ⬜ Link ProductCards to detail pages
19. ⬜ Implement related products section

### Phase 5 — Polish & Architecture (Ongoing)
20. ⬜ Fix file naming consistency
21. ⬜ Extract custom hooks (`useLocalStorage`, `useClickOutside`)
22. ⬜ Add error boundaries
23. ⬜ Improve accessibility (labels, aria attributes)
24. ⬜ Add password visibility toggle
25. ⬜ Consider lazy loading for routes
