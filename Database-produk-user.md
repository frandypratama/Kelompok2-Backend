-- ==========================================================
-- 1. PEMBUATAN DATABASE DAN TABEL
-- ==========================================================

-- Membuat database baru
CREATE DATABASE IF NOT EXISTS db_konter;
USE db_konter;

-- Tabel Kategori Bertingkat (Kategori Utama -> Subkategori -> Sub-Subkategori)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT NULL,
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabel Produk dengan ID Auto Increment (Dimulai dari 1)
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    purchase_price INT NOT NULL,
    selling_price INT NOT NULL,
    stock INT NOT NULL,
    category_id INT,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabel Users untuk Sistem Login Multi-Role
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);


-- ==========================================================
-- 2. MEMASUKKAN DATA USERS (LOGIN)
-- ==========================================================

INSERT IGNORE INTO users (name, username, password, role) VALUES 
('abc1', 'abc1', '12345', 'owner'),
('abc2', 'abc2', '12345', 'admin'),
('abc3', 'abc3', '12345', 'user');


-- ==========================================================
-- 3. MEMASUKKAN DATA KATEGORI (BERTINGKAT)
-- ==========================================================

-- Level 1: Kategori Utama
INSERT INTO categories (id, category_name, parent_id) VALUES 
(1, 'Fisik', NULL),
(2, 'Digital', NULL);

-- Level 2: Subkategori
INSERT INTO categories (id, category_name, parent_id) VALUES 
(3, 'Voucher', 1),
(4, 'Kartu Prabayar', 1),
(5, 'Aksesoris', 1),
(6, 'Pulsa', 2),
(7, 'Token Listrik', 2),
(8, 'E-Wallet', 2),
(9, 'Voucher Game', 2),
(10, 'Transfer Antar Bank', 2);

-- Level 3: Sub-Subkategori (Brand / Jenis)
INSERT INTO categories (id, category_name, parent_id) VALUES 
-- Di bawah Voucher (ID 3)
(11, 'Telkomsel', 3),
(12, 'Tri (3)', 3),
(13, 'Axis', 3),
-- Di bawah Kartu Prabayar (ID 4)
(14, 'Telkomsel Prabayar', 4),
(15, 'Tri Prabayar', 4),
(16, 'Axis Prabayar', 4),
-- Di bawah Aksesoris (ID 5)
(17, 'Kabel Charger', 5),
(18, 'Adapter Charger', 5),
-- Di bawah Pulsa (ID 6)
(19, 'Pulsa Telkomsel', 6),
(20, 'Pulsa Tri', 6),
(21, 'Pulsa Axis', 6),
-- Di bawah Token Listrik (ID 7)
(22, 'Token PLN', 7),
-- Di bawah E-Wallet (ID 8)
(23, 'Gopay', 8),
(24, 'DANA', 8),
(25, 'ShopeePay', 8),
-- Di bawah Voucher Game (ID 9)
(26, 'Free Fire', 9),
(27, 'Mobile Legends', 9),
-- Di bawah Transfer Antar Bank (ID 10)
(28, 'Bank BRI', 10),
(29, 'Bank Seabank', 10);


-- ==========================================================
-- 4. MEMASUKKAN DATA PRODUK (ID AUTO INCREMENT)
-- ==========================================================

-- Kategori Fisik: Voucher Paket Data & Perdana & Aksesoris
INSERT INTO products (product_name, purchase_price, selling_price, stock, category_id) VALUES
-- Voucher Telkomsel (category_id: 11)
('Telkomsel Paket Data 1 Hari 1.5 GB', 5000, 7000, 50, 11),
('Telkomsel Paket Data 2 Hari 3 GB', 8500, 11000, 45, 11),
('Telkomsel Paket Data 3 Hari 5 GB', 13000, 16000, 40, 11),
('Telkomsel Paket Data 5 Hari 7 GB', 18000, 22000, 35, 11),
('Telkomsel Paket Data 7 Hari 10 GB', 25000, 30000, 60, 11),
('Telkomsel Paket Data 14 Hari 15 GB', 45000, 52000, 30, 11),
('Telkomsel Paket Data 28 Hari 25 GB', 70000, 80000, 100, 11),

-- Voucher Tri (category_id: 12)
('Tri AON / Data 1 Hari 2 GB', 4500, 6500, 50, 12),
('Tri Data 2 Hari 4 GB', 7500, 10000, 45, 12),
('Tri Data 3 Hari 6 GB', 11000, 14000, 40, 12),
('Tri Data 5 Hari 9 GB', 15000, 19000, 35, 12),
('Tri Data 7 Hari 15 GB', 22000, 27000, 55, 12),
('Tri Data 14 Hari 25 GB', 38000, 45000, 30, 12),
('Tri Data 28 Hari 32 GB', 60000, 70000, 90, 12),

-- Voucher Axis (category_id: 13)
('Axis Data 1 Hari 1.5 GB', 4000, 6000, 50, 13),
('Axis Data 2 Hari 3 GB', 7000, 9500, 45, 13),
('Axis Data 3 Hari 5 GB', 10500, 13500, 40, 13),
('Axis Data 5 Hari 8 GB', 14000, 18000, 35, 13),
('Axis Data 7 Hari 12 GB', 20000, 25000, 60, 13),
('Axis Data 14 Hari 20 GB', 35000, 42000, 25, 13),
('Axis Data 28 Hari 30 GB', 58000, 68000, 85, 13),

-- Kartu Prabayar Telkomsel (category_id: 14)
('Perdana Telkomsel 0812-3456-7890', 12000, 15000, 2, 14),
('Perdana Telkomsel 0813-9876-5432', 12000, 15000, 1, 14),
('Perdana Telkomsel 0821-1122-3344', 12000, 15000, 3, 14),
('Perdana Telkomsel 0822-5566-7788', 12000, 15000, 1, 14),
('Perdana Telkomsel 0852-9900-1122', 12000, 15000, 2, 14),

-- Kartu Prabayar Tri (category_id: 15)
('Perdana Tri (3) 0896-1234-5678', 10000, 13000, 4, 15),
('Perdana Tri (3) 0895-8765-4321', 10000, 13000, 2, 15),
('Perdana Tri (3) 0897-3344-5566', 10000, 13000, 3, 15),
('Perdana Tri (3) 0898-7788-9900', 10000, 13000, 1, 15),
('Perdana Tri (3) 0899-2233-4455', 10000, 13000, 2, 15),

-- Kartu Prabayar Axis (category_id: 16)
('Perdana Axis 0838-1234-5678', 10000, 13000, 3, 16),
('Perdana Axis 0831-9876-5432', 10000, 13000, 2, 16),
('Perdana Axis 0832-4455-6677', 10000, 13000, 4, 16),
('Perdana Axis 0833-8899-0011', 10000, 13000, 1, 16),
('Perdana Axis 0838-5544-3322', 10000, 13000, 2, 16),

-- Aksesoris (category_id: 17 & 18)
('Kabel Charger Micro USB', 10000, 18000, 15, 17),
('Kabel Charger Type C', 15000, 25000, 20, 17),
('Kabel Charger Lightning (iPhone)', 20000, 35000, 10, 17),
('Adapter Charger Digital / Kepala Charger', 25000, 40000, 12, 18);


-- Kategori Digital: Pulsa, Token, E-Wallet, Voucher Game, Transfer Bank
INSERT INTO products (product_name, purchase_price, selling_price, stock, category_id) VALUES
-- Pulsa (category_id: 19, 20, 21)
('Pulsa Telkomsel 10.000', 10300, 12000, 999, 19),
('Pulsa Tri (3) 10.000', 10100, 11500, 999, 20),
('Pulsa Axis 10.000', 10100, 11500, 999, 21),

-- Token Listrik (category_id: 22)
('Token Listrik PLN 20.000', 20150, 22000, 999, 22),

-- E-Wallet (category_id: 23, 24, 25)
('Top Up Gopay 50.000', 50500, 52000, 999, 23),
('Top Up DANA 50.000', 50500, 52000, 999, 24),
('Top Up ShopeePay 50.000', 50500, 52000, 999, 25),

-- Voucher Game Free Fire (category_id: 26)
('Free Fire 5 Diamonds', 1000, 1500, 999, 26),
('Free Fire 12 Diamonds', 2000, 3000, 999, 26),
('Free Fire 50 Diamonds', 7000, 8500, 999, 26),
('Free Fire 70 Diamonds', 9500, 11500, 999, 26),
('Free Fire 140 Diamonds', 18000, 21000, 999, 26),
('Free Fire 355 Diamonds', 45000, 50000, 999, 26),
('Free Fire 720 Diamonds', 90000, 98000, 999, 26),

-- Voucher Game Mobile Legends (category_id: 27)
('Mobile Legends 11 Diamonds', 3500, 5000, 999, 27),
('Mobile Legends 36 Diamonds', 10000, 12000, 999, 27),
('Mobile Legends 85 Diamonds', 23000, 26000, 999, 27),
('Mobile Legends 172 Diamonds', 46000, 51000, 999, 27),
('Mobile Legends 284 Diamonds', 75000, 82000, 999, 27),
('Mobile Legends 408 Diamonds', 105000, 115000, 999, 27),
('Mobile Legends 875 Diamonds', 220000, 235000, 999, 27),

-- Transfer Antar Bank (category_id: 28 & 29)
('Jasa Transfer Antar Bank BRI (s.d 1 Juta)', 2500, 5000, 999, 28),
('Jasa Transfer Antar Bank Seabank (s.d 1 Juta)', 1000, 3000, 999, 29);