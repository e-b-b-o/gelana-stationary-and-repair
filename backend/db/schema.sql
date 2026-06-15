// Schema for the eccomerce


-- USERS TABLE

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    
    -- basic info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL.
    email VARCHAR(255) UNIQUE NOT NULL,

    -- security
    password_hash TEXT NOT NULL,


    -- profile
    phone VARCHAR(20),
    profile_image TEXT,

    -- role system
    role VARCHAR DEFAULT 'CUSTOMER',


    -- account status
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,

    -- timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );  

-- ADDRESS

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,

    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,

    postal_code VARCHAR(20),

    is_default BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);


-- CATEGORIES

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS 

CREATE TABLE products (
    id SERIAL PRIMARY KEY,

    categories_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    discreption TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quanity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (categories_id)
    REFERENCES categories(id)
);

-- CART TABLE

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- CART ITEMS

CREATE TABLE  cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    FOREIGN KEY (cart_id)
    REFERENCES carts(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
);



-- WISHLIST TABLE 

CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- WISHLIST ITEMS

CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    wishlist_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,

    FOREIGN KEY (wishlist_id)
    REFERENCES wishlists(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id),

    UNIQUE (wishlist_id , product_id)
);


  -- ORDERS TABLE

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    address_id INTEGER NOT NULL,

    order_status VARCHAR(30) DEFAULT 'pending',

    total_amount DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id),
    
    FOREIGN KEY (address_id)
    REFERENCES addresses(id)
);


  -- ORDERS ITEMS

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,

    order_id INTEGER NOT NULL,

    product_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL,

    price_at_purchase DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (order_id) 
    REFERENCES orders(id)
    ON DELETE CASCADE,

    FOREIGN KEY (product_id)
    REFERENCES products(id)
);

-- REVIEWS

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    rating INTEGER NOT NULL
      CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
    REFERENCES users(id),

    FOREIGN KEY (product_id)
    REFERENCES products(id)
);


