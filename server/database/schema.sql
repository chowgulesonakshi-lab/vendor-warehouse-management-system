-- ===========================================
-- DATABASE
-- ===========================================

CREATE DATABASE IF NOT EXISTS warehouse_management;
USE warehouse_management;

-- ===========================================
-- USERS
-- ===========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('Admin','Manager','Staff') NOT NULL,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===========================================
-- WAREHOUSES
-- ===========================================

CREATE TABLE warehouses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    capacity INT DEFAULT 0,
    manager_id INT,
    status ENUM('Active','Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- ===========================================
-- CATEGORIES
-- ===========================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- PRODUCTS
-- ===========================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_id INT NOT NULL,
    category_id INT NOT NULL,

    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100),

    purchase_price DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,

    minimum_stock INT DEFAULT 0,
    unit VARCHAR(20),
    description TEXT,

    status ENUM('Available','Inactive') DEFAULT 'Available',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- ===========================================
-- INVENTORY
-- ===========================================

CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,
    warehouse_id INT NOT NULL,

    quantity INT DEFAULT 0,
    reserved_quantity INT DEFAULT 0,
    available_quantity INT DEFAULT 0,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);

-- ===========================================
-- SUPPLIERS
-- ===========================================

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    supplier_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(150),

    email VARCHAR(100),
    phone VARCHAR(15),

    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),

    gst_number VARCHAR(30),

    status ENUM('Active','Inactive') DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- PURCHASE ORDERS
-- ===========================================

CREATE TABLE purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    supplier_id INT NOT NULL,
    warehouse_id INT NOT NULL,

    order_date DATE,
    expected_delivery DATE,

    total_amount DECIMAL(12,2) DEFAULT 0,

    status ENUM(
        'Pending',
        'Approved',
        'Received',
        'Cancelled'
    ) DEFAULT 'Pending',

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- ===========================================
-- PURCHASE ORDER ITEMS
-- ===========================================

CREATE TABLE purchase_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    purchase_order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),

    total_price DECIMAL(12,2),

    FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- ===========================================
-- DISPATCH ORDERS
-- ===========================================

CREATE TABLE dispatch_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(100),
    customer_phone VARCHAR(15),
    customer_address TEXT,

    dispatch_date DATE,

    total_amount DECIMAL(12,2),

    status ENUM(
        'Pending',
        'Packed',
        'Dispatched',
        'Delivered'
    ) DEFAULT 'Pending',

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
        REFERENCES users(id)
);

-- ===========================================
-- DISPATCH ITEMS
-- ===========================================

CREATE TABLE dispatch_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    dispatch_order_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT,
    selling_price DECIMAL(10,2),

    total_price DECIMAL(12,2),

    FOREIGN KEY (dispatch_order_id)
        REFERENCES dispatch_orders(id),

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- ===========================================
-- STOCK TRANSACTIONS
-- ===========================================

CREATE TABLE stock_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,
    warehouse_id INT NOT NULL,

    transaction_type ENUM(
        'Stock In',
        'Stock Out',
        'Adjustment'
    ),

    quantity INT,

    reference_id INT,

    remarks TEXT,

    performed_by INT,

    transaction_date TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES products(id),

    FOREIGN KEY (warehouse_id)
        REFERENCES warehouses(id),

    FOREIGN KEY (performed_by)
        REFERENCES users(id)
);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    title VARCHAR(150),
    message TEXT,

    type ENUM(
        'Info',
        'Warning',
        'Success',
        'Error'
    ) DEFAULT 'Info',

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);

-- ===========================================
-- SETTINGS
-- ===========================================

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    company_name VARCHAR(150),
    company_email VARCHAR(100),
    company_phone VARCHAR(15),
    company_address TEXT,

    tax_percentage DECIMAL(5,2),

    currency VARCHAR(10),

    low_stock_threshold INT,

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);