# Senior Frontend Engineer Mentorship Guide: React Architecture & Best Practices

Hello! It's great to see you diving into a professional React architecture. Feature-based structure (`features/auth`, `features/cart`, etc.) is exactly how enterprise applications are built. It scales beautifully because components, state, and logic related to a specific domain stay together.

Below, I'll walk you through each of your 10 requests. I'll explain the *why*, point out common beginner mistakes, and provide production-ready snippets that you can drop into your project.

---

## 1. Filter + Search Implementation

### 🧠 Architectural Explanation
**Common Beginner Mistake:** Putting search and filter state in `useState` inside the `Products.jsx` component. If a user filters for "Laptops", clicks a product, and then clicks the "Back" button, their filters are completely lost. Also, they can't share a link to their search results.

**Professional Approach:** The Source of Truth for filters should be the **URL**. We use React Router's `useSearchParams`. 
- **Should search be its own component?** Yes, extract it into a `ProductFilters.jsx` component to keep `Products.jsx` clean.
- **Context vs Local State?** Neither. The URL *is* the global state. 

### 💻 Implementation Snippets

**`ProductFilters.jsx`**
```jsx
import { useSearchParams } from 'react-router-dom';

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read current values from URL, default to empty string/all
  const currentSearch = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'all';

  const handleSearch = (e) => {
    const value = e.target.value;
    // Update the 'q' param, but keep other params like category intact
    setSearchParams(prev => {
      if (value) prev.set('q', value);
      else prev.delete('q');
      return prev;
    });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSearchParams(prev => {
      if (value !== 'all') prev.set('category', value);
      else prev.delete('category');
      return prev;
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
      <input
        type="text"
        placeholder="Search products..."
        value={currentSearch}
        onChange={handleSearch}
        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full"
      />
      
      <select 
        value={currentCategory} 
        onChange={handleCategoryChange}
        className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
    </div>
  );
}
```

**`Products.jsx`**
```jsx
import { useSearchParams } from 'react-router-dom';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
// Assuming you have a custom hook or data array
import { products } from '../../data/products'; 

export default function Products() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q')?.toLowerCase() || '';
  const category = searchParams.get('category') || 'all';

  // Derived state: compute the filtered list on the fly
  // No need to store filteredProducts in useState!
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(q);
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <ProductFilters />
      
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 2. Add to Cart Feedback

### 🧠 Architectural Explanation
**Common Beginner Mistake:** Adding an `isAdded` boolean to the global Cart Context. If you do this, clicking "Add" on one product will make *every* button on the page suddenly say "Added!". 

**Professional Approach:** Visual feedback is **Transient UI State**. It belongs strictly as local component state inside the button component itself. The cart data goes to the context, but the green checkmark UI stays local. We use `setTimeout` to revert the visual state.

### 💻 Implementation Snippet

**`AddToCartButton.jsx`**
```jsx
import { useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react'; // Example icon library
import { useCart } from '../cart/CartContext'; // Your custom hook

export default function AddToCartButton({ product }) {
  const { dispatch } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    // 1. Dispatch global data
    dispatch({ type: 'ADD_ITEM', payload: product });
    
    // 2. Set local transient UI state
    setIsAdded(true);

    // 3. Revert back after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdded}
      className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-md font-medium transition-all duration-300 ${
        isAdded 
          ? 'bg-green-500 text-white cursor-default' 
          : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
      }`}
    >
      {isAdded ? (
        <>
          <Check size={18} />
          <span>Added</span>
        </>
      ) : (
        <>
          <ShoppingCart size={18} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
```

---

## 3. Wishlist Implementation

### 🧠 Architectural Explanation
**Professional Approach:** Wishlist is **Global Application State**. Why? Because a user can add a product from the home page, view the filled heart on the products page, see a badge count in the Navbar, and view the full list on the Profile page.
Because it spans multiple feature areas, it needs its own Context/Reducer (just like the Cart).

### 💻 Implementation Snippets

**`wishlistReducer.js`**
```javascript
export const initialState = {
  items: []
};

export default function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_WISHLIST': {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (exists) {
        // Remove it
        return { ...state, items: state.items.filter(item => item.id !== action.payload.id) };
      } else {
        // Add it
        return { ...state, items: [...state.items, action.payload] };
      }
    }
    default:
      return state;
  }
}
```

**`WishlistButton.jsx`**
```jsx
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistButton({ product }) {
  const { state, dispatch } = useWishlist();
  
  // Derived state: check if this specific product is in the wishlist
  const isWishlisted = state.items.some(item => item.id === product.id);

  const toggleWishlist = (e) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    dispatch({ type: 'TOGGLE_WISHLIST', payload: product });
  };

  return (
    <button 
      onClick={toggleWishlist}
      className="p-2 rounded-full bg-white shadow-md hover:scale-110 transition-transform"
      aria-label="Toggle Wishlist"
    >
      <Heart 
        size={20} 
        className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} 
      />
    </button>
  );
}
```

---

## 4. Cart Select + Remove System

### 🧠 Architectural Explanation
**Professional Approach:** Selecting items to remove them in bulk is **Local UI State** on the Cart Page. We don't need to pollute the global Cart Context with `isSelected` booleans because if the user navigates away and comes back, it's totally fine if the checkboxes reset.
We use an array (or a `Set`) of selected IDs in local state.

### 💻 Implementation Snippet

**`Cart.jsx`**
```jsx
import { useState } from 'react';
import { useCart } from './CartContext';

export default function Cart() {
  const { state, dispatch } = useCart();
  const [selectedIds, setSelectedIds] = useState(new Set()); // Using Set for quick lookups

  const handleSelectToggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === state.items.length) {
      setSelectedIds(new Set()); // Unselect all
    } else {
      setSelectedIds(new Set(state.items.map(item => item.id))); // Select all
    }
  };

  const handleRemoveSelected = () => {
    // Ideally your reducer supports a bulk remove action
    dispatch({ type: 'REMOVE_MULTIPLE_ITEMS', payload: Array.from(selectedIds) });
    setSelectedIds(new Set()); // Reset selection
  };

  if (state.items.length === 0) return <div>Your cart is empty.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={selectedIds.size === state.items.length}
            onChange={handleSelectAll}
            className="w-5 h-5 accent-blue-600"
          />
          <span className="font-medium">Select All</span>
        </label>
        
        {selectedIds.size > 0 && (
          <button 
            onClick={handleRemoveSelected}
            className="text-red-500 font-medium hover:text-red-700"
          >
            Remove Selected ({selectedIds.size})
          </button>
        )}
      </div>

      <div className="space-y-4">
        {state.items.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
            <input 
              type="checkbox"
              checked={selectedIds.has(item.id)}
              onChange={() => handleSelectToggle(item.id)}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Realistic Authentication Without Backend

### 🧠 Architectural Explanation
**Professional Approach:** To simulate auth professionally, we use `localStorage` as our fake database. 
- `users_db`: An array of user objects saved in local storage.
- `current_user`: The currently logged-in user, also in local storage (simulating a JWT).
- Context initializes state from `current_user`. 
- Signup adds to `users_db`. Login checks against `users_db`.

### 💻 Implementation Snippets

**`authService.js` (Fake API)**
```javascript
// Simulating an API call with a small delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async register(email, password, name) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = { id: crypto.randomUUID(), email, password, name };
    users.push(newUser);
    localStorage.setItem('users_db', JSON.stringify(users));
    
    // Auto-login after register
    const { password: _, ...userWithoutPass } = newUser;
    localStorage.setItem('current_user', JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  async login(email, password) {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('users_db') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPass } = user;
    localStorage.setItem('current_user', JSON.stringify(userWithoutPass));
    return userWithoutPass;
  },

  logout() {
    localStorage.removeItem('current_user');
  }
};
```

**`AuthContext.jsx`**
```jsx
import { createContext, useReducer, useEffect, useContext } from 'react';
import { authService } from './authService';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('current_user')) || null,
  isLoading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START': return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS': return { ...state, isLoading: false, user: action.payload };
    case 'AUTH_FAIL': return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT': return { ...state, user: null };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (err) {
      dispatch({ type: 'AUTH_FAIL', payload: err.message });
      throw err; // So component can show error
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## 6. Booking Form Implementation

### 🧠 Architectural Explanation
**Professional Approach:** Form state (`formData`) is strictly local. Validation should happen on submit (or on blur). Once submitted successfully, show a local success message, and reset the form. If bookings need to be shown elsewhere (like a profile page), dispatch to a `BookingContext` or mock API upon successful submission.

### 💻 Implementation Snippet

**`BookingForm.jsx`**
```jsx
import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({ name: '', date: '', service: 'repair' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg('Booking confirmed successfully!');
      setFormData({ name: '', date: '', service: 'repair' }); // Reset form
      
      // Optionally dispatch to global state here: dispatch({ type: 'ADD_BOOKING', payload: ... })
      
      setTimeout(() => setSuccessMsg(''), 5000); // Hide success after 5s
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
      
      {successMsg && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 rounded-md">
          {successMsg}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Date</label>
        <input 
          type="date" 
          value={formData.date}
          onChange={e => setFormData({...formData, date: e.target.value})}
          className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
```

---

## 7. Professional Sticky Navbar Behavior

### 🧠 Architectural Explanation
**Professional Approach:** We attach an event listener to `window.scroll` inside a `useEffect`. We track a boolean `isScrolled` when the scroll Y passes a certain threshold (e.g., 20px). Using conditional classes in Tailwind makes the transition perfectly smooth. Always remember to clean up the event listener!

### 💻 Implementation Snippet

**`Navbar.jsx`**
```jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // If scrolled past 20px, set to true
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function - CRITICAL for preventing memory leaks
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-3 text-gray-900' 
          : 'bg-transparent py-5 text-white' // Adjust initial text color based on your Hero image
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">BRAND</Link>
        
        <div className="space-x-6 font-medium">
          <Link to="/products" className="hover:text-blue-500 transition-colors">Shop</Link>
          <Link to="/about" className="hover:text-blue-500 transition-colors">About</Link>
        </div>
      </div>
    </nav>
  );
}
```

---

## 8. Featured Products CTA

### 🧠 Architectural Explanation
**Professional Approach:** Layouts like "Heading on left, Button on right" are best handled by Flexbox. `flex justify-between items-end` ensures they push apart and align to the bottom baseline.

### 💻 Implementation Snippet

**`FeaturedSection.jsx`**
```jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FeaturedSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-gray-500 mt-2">Discover our top-rated stationery and repair tools.</p>
        </div>
        
        <Link 
          to="/products" 
          className="group flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          View All Products 
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid goes here... */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Product Cards... */}
      </div>

    </section>
  );
}
```

---

## 9. Product Details Page

### 🧠 Architectural Explanation
**Professional Approach:** Dynamic routing `/products/:id`. The page extracts the `id` from the URL using `useParams()`. In a real app, it triggers a fetch. In a local app, it finds the product from a data array. 
The file structure is feature-centric:
- `features/products/ProductDetails.jsx` (Main layout, handles fetching)
- `features/products/ProductGallery.jsx` (Handles main image and thumbnails)

### 💻 Implementation Snippet

**`ProductDetails.jsx`**
```jsx
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import AddToCartButton from '../cart/AddToCartButton';
import WishlistButton from '../wishlist/WishlistButton';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find product by ID
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <button onClick={() => navigate('/products')} className="mt-4 text-blue-600">Back to Shop</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left: Image Gallery */}
        <div className="bg-gray-50 p-8 rounded-2xl relative">
          <div className="absolute top-4 right-4 z-10">
             <WishlistButton product={product} />
          </div>
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto object-contain mix-blend-multiply"
          />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900 mb-6">${product.price}</p>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "Detailed professional description of the product goes here. Highlighting features and specs."}
          </p>

          <div className="w-full max-w-xs">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 10. Checkout + Orders Architecture

### 🧠 Architectural Explanation
**Professional Approach:**
- **Checkout** is its own feature: `features/checkout/Checkout.jsx`. It consumes the `CartContext` to know *what* is being bought, and `AuthContext` to know *who* is buying.
- **Orders** is part of the user domain: `features/user/Orders.jsx`.
- **The Flow:**
  1. User fills Checkout Form.
  2. Submits.
  3. Create an Order object (Date, Items, Total, UserID).
  4. Save Order to `OrdersContext` or mock API (`localStorage`).
  5. Dispatch `CLEAR_CART` to empty the cart.
  6. Redirect to `/orders` or `/success`.

### 💻 Implementation Snippet

**`Checkout.jsx`**
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';

export default function Checkout() {
  const { state: cartState, dispatch: cartDispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Derived state
  const totalAmount = cartState.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    // Simulate Payment / Server Request
    setTimeout(() => {
      const newOrder = {
        id: crypto.randomUUID(),
        userId: user.id,
        items: [...cartState.items],
        total: totalAmount,
        date: new Date().toISOString(),
        status: 'Processing'
      };

      // 1. Save order to fake DB
      const existingOrders = JSON.parse(localStorage.getItem('orders_db') || '[]');
      localStorage.setItem('orders_db', JSON.stringify([...existingOrders, newOrder]));

      // 2. Clear Cart
      cartDispatch({ type: 'CLEAR_CART' });

      // 3. Redirect
      navigate('/profile', { state: { message: 'Order placed successfully!' }});
    }, 1500);
  };

  if (cartState.items.length === 0) return <div>Cart is empty!</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Form Column */}
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Details</h2>
          <input type="text" placeholder="Full Name" required className="w-full p-2 border rounded" defaultValue={user?.name} />
          <input type="text" placeholder="Address" required className="w-full p-2 border rounded" />
          
          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full bg-black text-white py-3 rounded-md font-semibold mt-4"
          >
            {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
          </button>
        </form>

        {/* Summary Column */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartState.items.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity || 1}</span>
              <span>${(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4 font-bold flex justify-between text-lg">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
```

---
*Happy coding! Feel free to ask if you want me to expand on any specific feature or pattern.*
