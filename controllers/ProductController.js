import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Konfigurasi Multer (Menggunakan ES Module)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir); // Folder penyimpanan gambar
    },
    filename: (req, file, cb) => {
        // Membuat nama file unik berdasarkan timestamp + angka random
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Batas ukuran file maks 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Hanya file gambar (jpg, jpeg, png, webp) yang diizinkan!"));
    }
});

// READ (Semua produk + Search + Filter Kategori)[cite: 11]
export const getProducts = async (req, res) => {
    try {
        const { category_id } = req.query;

        let filterCondition = {};
        if (category_id) {
            filterCondition.category_id = category_id;
        }
        if (search) {
            filterCondition.product_name = { [Op.like]: `%${search}%` };
        }

        const { count, rows } = await Product.findAndCountAll({
            where: filterCondition,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'category_name', 'parent_id']
                }
            ],
            order: [[sort, order.toUpperCase()]],
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data produk",
            data: rows,
            pagination: {
                page,
                limit,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
            }
        });
    } catch (error) {
        console.error("Error getProducts:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// READ (Berdasarkan ID)[cite: 11]
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: Category, as: 'category', attributes: ['id', 'category_name', 'parent_id'] }]
        });
        if (!product) return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        res.status(200).json({ success: true, message: "Berhasil mengambil detail produk", data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// CREATE (Tambah Produk dengan dukungan gambar)
export const createProduct = async (req, res) => {
    const image = req.file ? req.file.filename : null;
    try {
        const { product_name, purchase_price, selling_price, stock, category_id } = req.body;
        
        if (!product_name || !purchase_price || !selling_price || stock === undefined || !category_id) {
            hapusFile(image); 
            return res.status(400).json({ success: false, message: "Semua field wajib diisi!" });
        }

        // Ambil nama file gambar jika di-upload, jika tidak set null
        const image = req.file ? req.file.filename : null;

        const newProduct = await Product.create({ 
            product_name, 
            purchase_price: Number(purchase_price), 
            selling_price: Number(selling_price), 
            stock: Number(stock), 
            category_id: Number(category_id),
            image 
        });

        res.status(201).json({ success: true, message: "Produk berhasil ditambahkan", data: newProduct });
    } catch (error) {
        hapusFile(image);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE (Edit Produk dengan dukungan gambar)
export const updateProduct = async (req, res) => {
    const imageBaru = req.file ? req.file.filename : null;
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            hapusFile(imageBaru);
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        }

        const { product_name, purchase_price, selling_price, stock, category_id } = req.body;
        
        // Jika ada file gambar baru yang di-upload, gunakan file baru. Jika tidak, tetap pakai gambar lama.
        const image = req.file ? req.file.filename : product.image;

        await Product.update({
            product_name: product_name || product.product_name,
            purchase_price: purchase_price !== undefined ? Number(purchase_price) : product.purchase_price,
            selling_price: selling_price !== undefined ? Number(selling_price) : product.selling_price,
            stock: stock !== undefined ? Number(stock) : product.stock,
            category_id: category_id ? Number(category_id) : product.category_id,
            image
        }, { where: { id: req.params.id } });

        if (imageBaru) {
            hapusFile(imageLama);
        }

        res.status(200).json({ success: true, message: "Produk berhasil diperbarui" });
    } catch (error) {
        hapusFile(imageBaru);
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE (Hapus Produk)[cite: 11]
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });

        // Opsional: Hapus file fisik gambar dari folder uploads jika ada
        if (product.image && fs.existsSync(`uploads/${product.image}`)) {
            fs.unlinkSync(`uploads/${product.image}`);
        }

        await Product.destroy({ where: { id: req.params.id } });
        
        hapusFile(image);

        res.status(200).json({ success: true, message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};