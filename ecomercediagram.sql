
USE ecommerce;

-- Bảng base
CREATE TABLE base (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    created_date DATETIME DEFAULT GETDATE(),
    created_by NVARCHAR(255),
    last_modified_date DATETIME,
    last_modified_by NVARCHAR(255),
    deleted BIT DEFAULT 0
);

-- Bảng user_table
CREATE TABLE user_table (
    id BIGINT PRIMARY KEY,
    username NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(255),
    last_name NVARCHAR(255),
    CONSTRAINT FK_user_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng role
CREATE TABLE role (
    id BIGINT PRIMARY KEY,
    name NVARCHAR(255),
    description NVARCHAR(255),
    CONSTRAINT FK_role_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng user_role
CREATE TABLE user_role (
    user_id BIGINT,
    role_id BIGINT,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT FK_user_role_user FOREIGN KEY (user_id) REFERENCES user_table(id),
    CONSTRAINT FK_user_role_role FOREIGN KEY (role_id) REFERENCES role(id)
);

-- Bảng category
CREATE TABLE category (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_category_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng brand
CREATE TABLE brand (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    CONSTRAINT FK_brand_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng product
CREATE TABLE product (
    id BIGINT PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    price FLOAT,
    description NVARCHAR(MAX),
    image_url NVARCHAR(255),
    quantity INT,
    is_sold_out BIT DEFAULT 0,
    is_available BIT DEFAULT 1,
    category_id BIGINT,
    brand_id BIGINT,
    CONSTRAINT FK_product_base FOREIGN KEY (id) REFERENCES base(id),
    CONSTRAINT FK_product_category FOREIGN KEY (category_id) REFERENCES category(id),
    CONSTRAINT FK_product_brand FOREIGN KEY (brand_id) REFERENCES brand(id)
);

-- Bảng order_table
CREATE TABLE order_table (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT,
    CONSTRAINT FK_order_user FOREIGN KEY (user_id) REFERENCES user_table(id),
    CONSTRAINT FK_order_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng order_item
CREATE TABLE order_item (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    quantity INT,
    price FLOAT,
    CONSTRAINT FK_order_item_order FOREIGN KEY (order_id) REFERENCES order_table(id),
    CONSTRAINT FK_order_item_product FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT FK_order_item_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng cart
CREATE TABLE cart (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT,CONSTRAINT FK_cart_user FOREIGN KEY (user_id) REFERENCES user_table(id),
    CONSTRAINT FK_cart_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng cart_item
CREATE TABLE cart_item (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    cart_id BIGINT,
    product_id BIGINT,
    quantity INT,
    price FLOAT,
    CONSTRAINT FK_cart_item_cart FOREIGN KEY (cart_id) REFERENCES cart(id),
    CONSTRAINT FK_cart_item_product FOREIGN KEY (product_id) REFERENCES product(id),
    CONSTRAINT FK_cart_item_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng address
CREATE TABLE address (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    recipient NVARCHAR(255),
    street NVARCHAR(255),
    city NVARCHAR(255),
    state NVARCHAR(255),
    zip_code NVARCHAR(20),
    user_id BIGINT,
    CONSTRAINT FK_address_user FOREIGN KEY (user_id) REFERENCES user_table(id),
    CONSTRAINT FK_address_base FOREIGN KEY (id) REFERENCES base(id)
);

-- Bảng token
CREATE TABLE token (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id BIGINT,
    token NVARCHAR(255) NOT NULL,
	is_revoked BIT,
	is_expired BIT,
	token_type nvarchar(20),
    CONSTRAINT FK_token_user FOREIGN KEY (user_id) REFERENCES user_table(id)
);
