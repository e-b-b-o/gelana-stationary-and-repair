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
    role VARCHAR DEFAULT "CUSTOMER"


    -- account status
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,

    -- timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )

-- PRODUCT TABLE 

CREATE TABLE products (
    
)