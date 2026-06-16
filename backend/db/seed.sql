-- PRODUCTS FOR TESTING 

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
    'hashedpassword',
    'CUSTOMER'
) ,
(
    'Jonah',
    'Jane',
    'jonahjane@gmail.com',
    'jonahjane',
    'CUSTOMER'
);

INSERT INTO categories ( name ) 
VALUES ('electronics'),
( 'stationary'),
 ('all');

INSERT INTO products (
    categories_id,
    name , 
    discreption,
    price,
    stock_quanity
) VALUES (
    1,
    'Charger',
    '45 watt original charger from somewhere',
    201,
    10
),(
    1,
    'Mouse',
    'Wireless Mouse',
    104,
    2
);

INSERT INTO carts (user_id) VALUES (1);

INSERT INTO cart_items (cart_id , product_id ,quantity)
VALUES (1,1,2), (1,2,2);

