-- CLEAR EXISTING DATA
TRUNCATE TABLE reviews, order_items, orders, wishlist_items, wishlists, cart_items, carts, product_images, products, categories, addresses, users RESTART IDENTITY CASCADE;

-- 1. USERS (Password for all is 'password123')
INSERT INTO users (first_name, last_name, email, password_hash, role, email_verified) VALUES 
('Admin', 'User', 'admin@gelana.com', '$2b$10$VG7jQtZw9KRnhOZ2G7KQz.BivzkrvDFVZJZfYBWCXePd3Hck0I.8S', 'ADMIN', TRUE),
('John', 'Doe', 'john@example.com', '$2b$10$VG7jQtZw9KRnhOZ2G7KQz.BivzkrvDFVZJZfYBWCXePd3Hck0I.8S', 'CUSTOMER', TRUE),
('Jane', 'Smith', 'jane@example.com', '$2b$10$VG7jQtZw9KRnhOZ2G7KQz.BivzkrvDFVZJZfYBWCXePd3Hck0I.8S', 'CUSTOMER', FALSE);

-- 2. ADDRESSES
INSERT INTO addresses (user_id, country, city, street, postal_code, is_default) VALUES 
(2, 'USA', 'New York', '123 Tech Lane', '10001', TRUE),
(3, 'Canada', 'Toronto', '456 Maple Drive', 'M5V 2T6', TRUE);

-- 3. CATEGORIES
INSERT INTO categories (name) VALUES 
('Laptops'), ('Accessories'), ('Stationary'), ('Repairs');

-- 4. PRODUCTS
INSERT INTO products (category_id, name, description, price, stock_quantity, thumbnail_url, is_active, rating) VALUES 
-- Laptops
(1, 'MacBook Pro 16"', 'M3 Max, 36GB RAM, 1TB SSD', 2499.99, 15, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.8),
(1, 'Dell XPS 15', 'Intel Core i9, 32GB RAM, 1TB SSD', 1999.99, 10, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.5),
(1, 'Lenovo ThinkPad X1 Carbon', 'Intel Core i7, 16GB RAM, 512GB SSD', 1499.99, 20, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.7),
(1, 'HP Spectre x360', 'Intel Core i7, 16GB RAM, 1TB SSD', 1399.99, 12, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.6),
(1, 'Asus ROG Zephyrus', 'AMD Ryzen 9, 32GB RAM, 1TB SSD', 1799.99, 8, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.9),

-- Accessories
(2, 'Logitech MX Master 3S', 'Ergonomic wireless mouse', 99.99, 50, '/uploads/products/wireless-mouse.png', TRUE, 4.8),
(2, 'Keychron K2', 'Mechanical keyboard, Brown switches', 89.99, 30, '/uploads/products/mechanicalkeyboard.png', TRUE, 4.6),
(2, 'Anker 65W Charger', 'Fast laptop and phone charger', 45.00, 100, '/uploads/products/laptopcharger.png', TRUE, 4.5),
(2, 'Apple Magic Mouse', 'Wireless Bluetooth mouse', 79.99, 25, '/uploads/products/wireless-mouse.png', TRUE, 4.3),
(2, 'Corsair K70 RGB', 'Mechanical gaming keyboard', 129.99, 15, '/uploads/products/mechanicalkeyboard.png', TRUE, 4.7),

-- Stationary
(3, 'Moleskine Classic Notebook', 'Hard cover notebook, dotted', 24.50, 100, '/uploads/products/NoteBook.png', TRUE, 4.7),
(3, 'Pilot G2 Pens Pack', 'Premium gel roller pens, pack of 5', 12.99, 200, '/uploads/products/penspack.png', TRUE, 4.8),
(3, 'Post-it Notes', 'Sticky notes 3x3 inches, colorful', 5.99, 150, '/uploads/products/sticky-notes.png', TRUE, 4.5),
(3, 'Leuchtturm1917 Notebook', 'Medium A5 dotted notebook', 22.50, 80, '/uploads/products/NoteBook.png', TRUE, 4.6),
(3, 'Faber-Castell Grip Pens', 'Ballpoint pens, pack of 10', 9.99, 120, '/uploads/products/penspack.png', TRUE, 4.4),
(3, 'Neon Sticky Notes', 'Bright sticky notes set', 6.50, 90, '/uploads/products/sticky-notes.png', TRUE, 4.3),

-- Repairs
(4, 'Screen Replacement Kit', 'Toolkit and adhesive for screen repair', 45.00, 30, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.2),
(4, 'Battery Replacement Tool', 'Essential tools for battery swap', 25.00, 50, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.5),
(4, 'Thermal Paste', 'High-performance thermal paste', 12.50, 100, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.8),
(4, 'Precision Screwdriver Set', '64-bit precision repair tool kit', 35.00, 60, '/uploads/products/Gemini_Generated_Image_fgzpy2fgzpy2fgzp.png', TRUE, 4.9);

-- 5. CARTS & ITEMS
INSERT INTO carts (user_id) VALUES (2), (3);
INSERT INTO cart_items (cart_id, product_id, quantity) VALUES 
(1, 6, 1), 
(1, 11, 2),
(2, 3, 1);

-- 6. WISHLISTS
INSERT INTO wishlists (user_id) VALUES (1), (2);
INSERT INTO wishlist_items (wishlist_id, product_id) VALUES 
(1, 11), (2, 1), (2, 7);

-- 7. ORDERS & ITEMS
INSERT INTO orders (user_id, address_id, order_status, total_amount) VALUES 
(2, 1, 'delivered', 148.99),
(3, 2, 'pending', 1499.99);

INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES 
(1, 6, 1, 99.99),
(1, 11, 2, 24.50),
(2, 3, 1, 1499.99);

-- 8. REVIEWS
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES 
(2, 6, 5, 'Best mouse I have ever used!'),
(3, 1, 4, 'Great laptop, but very expensive.'),
(2, 11, 5, 'Love the quality of this notebook.');
