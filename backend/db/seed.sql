-- SEED DATA FOR TESTING

-- 1. USERS
INSERT INTO users (
    first_name,
    last_name,
    email,
    password_hash,
    role
) VALUES (
    'Ebisa',
    'Getachew',
    'ebisagetachew@gmail.com',
    '$2b$10$EpI1Zl3O...examplehashed...', -- In reality, use bcrypt output
    'CUSTOMER'
) ,
(
    'Jonah',
    'Jane',
    'jonahjane@gmail.com',
    '$2b$10$EpI1Zl3O...examplehashed...',
    'CUSTOMER'
);

-- 2. CATEGORIES
INSERT INTO categories (name) 
VALUES 
    ('Electronics'),
    ('Stationary'),
    ('Accessories');

-- 3. PRODUCTS
INSERT INTO products (
    category_id,
    name, 
    description,
    price,
    stock_quantity,
    image_url,
    is_active
) VALUES (
    1,
    'Fast Charger 45W',
    '45 watt original fast charger with Type-C cable.',
    20.00,
    10,
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60',
    TRUE
),
(
    1,
    'Wireless Mouse',
    'Ergonomic wireless mouse with 2.4GHz USB receiver.',
    15.50,
    2,
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60',
    TRUE
),
(
    2,
    'Premium Notebook',
    'Leather-bound A5 notebook with 200 pages.',
    12.00,
    50,
    'https://images.unsplash.com/photo-1531346878377-a541e4a11340?w=500&auto=format&fit=crop&q=60',
    TRUE
);

-- 4. CARTS (1 Cart per user)
INSERT INTO carts (user_id) VALUES (1), (2);

-- 5. CART ITEMS
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES 
    (1, 1, 2), -- Ebisa's cart has 2 Chargers
    (1, 2, 1), -- Ebisa's cart has 1 Mouse
    (2, 3, 5); -- Jonah's cart has 5 Notebooks

-- 6. WISHLISTS (1 Wishlist per user)
INSERT INTO wishlists (user_id) VALUES (1), (2);

-- 7. WISHLIST ITEMS
INSERT INTO wishlist_items (wishlist_id, product_id)
VALUES 
    (1, 3), -- Ebisa wants a Notebook
    (2, 1); -- Jonah wants a Fast Charger
