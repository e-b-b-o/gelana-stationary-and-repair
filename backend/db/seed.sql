-- CLEAR EXISTING DATA
TRUNCATE TABLE reviews, order_items, orders, wishlist_items, wishlists, cart_items, carts, products, categories, addresses, users RESTART IDENTITY CASCADE;

-- 1. USERS (Passwords are 'password123' hashed for example)
INSERT INTO users (first_name, last_name, email, password_hash, role, email_verified) VALUES 
('Admin', 'User', 'admin@gelana.com', '$2b$10$EpI1Zl3O...example...', 'ADMIN', TRUE),
('John', 'Doe', 'john@example.com', '$2b$10$EpI1Zl3O...example...', 'CUSTOMER', TRUE),
('Jane', 'Smith', 'jane@example.com', '$2b$10$EpI1Zl3O...example...', 'CUSTOMER', FALSE);

-- 2. ADDRESSES
INSERT INTO addresses (user_id, country, city, street, postal_code, is_default) VALUES 
(2, 'USA', 'New York', '123 Tech Lane', '10001', TRUE),
(3, 'Canada', 'Toronto', '456 Maple Drive', 'M5V 2T6', TRUE);

-- 3. CATEGORIES
INSERT INTO categories (name) VALUES 
('Laptops'), ('Accessories'), ('Stationary'), ('Repairs');

-- 4. PRODUCTS (Note: if you add the product_images table, you can drop image_url here)
INSERT INTO products (category_id, name, description, price, stock_quantity, image_url, is_active) VALUES 
(1, 'MacBook Pro 16"', 'M3 Max, 36GB RAM, 1TB SSD', 2499.99, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', TRUE),
(2, 'Logitech MX Master 3S', 'Ergonomic wireless mouse', 99.99, 50, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', TRUE),
(3, 'Moleskine Classic', 'Hard cover notebook, dotted', 24.50, 100, 'https://images.unsplash.com/photo-1531346878377-a541e4a11340', TRUE),
(4, 'Screen Replacement Kit', 'Toolkit and adhesive for screen repair', 45.00, 30, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837', TRUE);

-- 5. CARTS & ITEMS
INSERT INTO carts (user_id) VALUES (2), (3);
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES 
(1, 2, 1), 
(1, 3, 2);

-- 6. WISHLISTS
INSERT INTO wishlists (user_id) VALUES (1), (2);
INSERT INTO wishlist_items (wishlist_id, product_id) VALUES 
(1, 3), (2, 1);

-- 7. ORDERS & ITEMS
INSERT INTO orders (user_id, address_id, order_status, total_amount) VALUES 
(2, 1, 'delivered', 124.49);
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES 
(1, 2, 1, 99.99),
(1, 3, 2, 24.50);

-- 8. REVIEWS
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES 
(2, 2, 5, 'Best mouse I have ever used!'),
(3, 1, 4, 'Great laptop, but very expensive.');
