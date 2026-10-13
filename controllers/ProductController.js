import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// Helper untuk menghapus file foto fisik di folder uploads
const hapusFile = (namaFile) => {
    if (!namaFile) return;
    fs.unlink(path.join("uploads", namaFile), () => {});
};

// READ (Semua produk + Filter Kategori)
export const getProducts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
        const offset = (page - 1) * limit;

        // Nilai default sort dan order
        const { search, category_id, sort = "id", order = "DESC" } = req.query;

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
// READ (Berdasarkan ID)
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

// CREATE (Tambah Produk)
export const createProduct = async (req, res) => {
    const image = req.file ? req.file.filename : null;
    try {
        const { product_name, purchase_price, selling_price, stock, category_id } = req.body;
        
        if (!product_name || !purchase_price || !selling_price || stock === undefined || !category_id) {
            hapusFile(image); 
            return res.status(400).json({ success: false, message: "Semua field wajib diisi!" });
        }

        const newProduct = await Product.create({ 
            product_name, 
            purchase_price, 
            selling_price, 
            stock, 
            category_id,
            image 
        });

        res.status(201).json({ success: true, message: "Produk berhasil ditambahkan", data: newProduct });
    } catch (error) {
        hapusFile(image);
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE (Edit Produk)
export const updateProduct = async (req, res) => {
    const imageBaru = req.file ? req.file.filename : null;
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            hapusFile(imageBaru);
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        }

        const { product_name, purchase_price, selling_price, stock, category_id } = req.body;
        const imageLama = product.image;

        await Product.update({
            product_name: product_name || product.product_name,
            purchase_price: purchase_price !== undefined ? purchase_price : product.purchase_price,
            selling_price: selling_price !== undefined ? selling_price : product.selling_price,
            stock: stock !== undefined ? stock : product.stock,
            category_id: category_id || product.category_id,
            image: imageBaru || imageLama 
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

// DELETE (Hapus Produk)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });

        const image = product.image;
        await Product.destroy({ where: { id: req.params.id } });
        
        hapusFile(image);

        res.status(200).json({ success: true, message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};