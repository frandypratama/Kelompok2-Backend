-- ==========================================================
-- 1. PEMBUATAN DATABASE DAN TABEL
-- ==========================================================

-- Hapus database lama jika ada untuk menghindari konflik data
DROP DATABASE IF EXISTS db_konter;

-- Membuat database baru
CREATE DATABASE db_konter;
USE db_konter;

-- Tabel Kategori 2 Level (Kategori Utama -> Subkategori)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    parent_id INT DEFAULT NULL,
    CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabel Produk dengan tambahan kolom 'image' untuk Multer
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    purchase_price INT NOT NULL,
    selling_price INT NOT NULL,
    stock INT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
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

INSERT INTO users (id, name, username, password, role) VALUES 
(1, 'abc1', 'abc1', '12345', 'owner'),
(2, 'abc2', 'abc2', '12345', 'admin'),
(3, 'abc3', 'abc3', '12345', 'user');


-- ==========================================================
-- 3. MEMASUKKAN DATA KATEGORI (2 LEVEL)
-- ==========================================================

-- Level 1: Kategori Utama
INSERT INTO categories (id, category_name, parent_id) VALUES 
(1, 'Voucher', NULL),
(2, 'Kartu Prabayar', NULL),
(3, 'Aksesoris HP', NULL),
(4, 'Sembako', NULL),
(5, 'Non-Sembako', NULL);

-- Level 2: Subkategori
INSERT INTO categories (id, category_name, parent_id) VALUES 
-- Di bawah Voucher (ID 1)
(6, 'Telkomsel', 1),
(7, 'Tri (3)', 1),
(8, 'Axis', 1),
-- Di bawah Kartu Prabayar (ID 2)
(9, 'Telkomsel Prabayar', 2),
(10, 'Tri Prabayar', 2),
(11, 'Axis Prabayar', 2),
-- Di bawah Aksesoris HP (ID 3)
(12, 'Kabel Charger', 3),
(13, 'Adapter Charger', 3),
-- Di bawah Sembako (ID 4)
(14, 'Beras', 4),
(15, 'Gula', 4),
(16, 'Minyak Goreng', 4),
(17, 'Gas Elpiji', 4),
(18, 'Garam', 4),
(19, 'Telur', 4),
(20, 'Tepung', 4),
(21, 'Susu', 4),
-- Di bawah Non-Sembako (ID 5)
(22, 'Air Mineral', 5),
(23, 'Kopi', 5),
(24, 'Aneka Snack', 5),
(25, 'Rokok', 5);


-- ==========================================================
-- 4. MEMASUKKAN DATA PRODUK
-- ==========================================================

INSERT INTO products (product_name, purchase_price, selling_price, stock, image, category_id) VALUES
-- Voucher Telkomsel (category_id: 6)
('Telkomsel Paket Data 1 Hari 1.5 GB', 5000, 7000, 50, NULL, 6),
('Telkomsel Paket Data 7 Hari 10 GB', 25000, 30000, 60, NULL, 6),

-- Voucher Tri (category_id: 7)
('Tri AON / Data 1 Hari 2 GB', 4500, 6500, 50, NULL, 7),
('Tri Data 7 Hari 15 GB', 22000, 27000, 55, NULL, 7),

-- Voucher Axis (category_id: 8)
('Axis Data 1 Hari 1.5 GB', 4000, 6000, 50, NULL, 8),
('Axis Data 7 Hari 12 GB', 20000, 25000, 60, NULL, 8),

-- Kartu Prabayar Telkomsel (category_id: 9)
('Perdana Telkomsel 0812-3456-7890', 12000, 15000, 2, NULL, 9),
('Perdana Telkomsel 0813-9876-5432', 12000, 15000, 1, NULL, 9),

-- Kartu Prabayar Tri (category_id: 10)
('Perdana Tri (3) 0896-1234-5678', 10000, 13000, 4, NULL, 10),

-- Kartu Prabayar Axis (category_id: 11)
('Perdana Axis 0838-1234-5678', 10000, 13000, 3, NULL, 11),

-- Aksesoris HP (category_id: 12 & 13)
('Kabel Charger Micro USB', 10000, 18000, 15, NULL, 12),
('Kabel Charger Type C', 15000, 25000, 20, NULL, 12),
('Adapter Charger Digital / Kepala Charger', 25000, 40000, 12, NULL, 13),

-- SEMBAKO --
('Beras Premium 5 Kg', 65000, 72000, 25, NULL, 14),
('Beras Medium 5 Kg', 55000, 61000, 30, NULL, 14),
('Gula Pasir 1 Kg', 16000, 18500, 40, NULL, 15),
('Minyak Goreng 1 Liter', 15000, 17500, 35, NULL, 16),
('Minyak Goreng 2 Liter', 30000, 34500, 20, NULL, 16),
('Gas Elpiji 3 Kg', 19000, 22000, 15, NULL, 17),
('Garam Beryodium 250g', 2500, 4000, 50, NULL, 18),
('Telur Ayam 1 Kg', 24000, 28000, 30, NULL, 19),
('Tepung Terigu 1 Kg', 11000, 13500, 25, NULL, 20),
('Susu Kental Manis Kaleng', 11500, 14000, 25, NULL, 21),

-- NON-SEMBAKO --
('Air Mineral Botol 600ml', 3000, 5000, 48, NULL, 22),
('Air Mineral Dus 24x600ml', 45000, 52000, 10, NULL, 22),
('Kopi Sachet Renceng (isi 10)', 11000, 14000, 20, NULL, 23),
('Kopi Bubuk Hitam 200g', 12000, 15000, 15, NULL, 23),
('Keripik Singkong Balado', 7000, 10000, 20, NULL, 24),
('Wafer Coklat Pack', 5000, 8000, 25, NULL, 24),
('Rokok Filter Bungkus A', 30000, 33000, 10, NULL, 25),
('Rokok Filter Bungkus B', 28000, 31000, 10, NULL, 25);