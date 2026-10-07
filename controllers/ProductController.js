import { Op } from "sequelize";
import Product from "../models/ProductModel.js";
import Category from "../models/CategoryModel.js";

// READ (Semua produk + Search + Filter Kategori)
export const getProducts = async (req, res) => {
    try {
        const { category_id } = req.query; // Ambil parameter ?category_id=... dari URL

        // Buat kondisi filter dinamis
        let filterCondition = {};
        if (category_id) {
            filterCondition.category_id = category_id;
        }

        const products = await Product.findAll({
            where: filterCondition,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'category_name', 'parent_id']
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: category_id 
                ? `Berhasil mengambil produk untuk kategori ID: ${category_id}` 
                : "Berhasil mengambil semua data produk",
            data: products
        });
    } catch (error) {
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
    try {
        const { product_name, purchase_price, selling_price, stock, category_id } = req.body;
        if (!product_name || !purchase_price || !selling_price || stock === undefined || !category_id) {
            return res.status(400).json({ success: false, message: "Semua field wajib diisi!" });
        }
        const newProduct = await Product.create({ product_name, purchase_price, selling_price, stock, category_id });
        res.status(201).json({ success: true, message: "Produk berhasil ditambahkan", data: newProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE (Edit Produk)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });

        const { product_name, purchase_price, selling_price, stock, category_id } = req.body;
        await Product.update({
            product_name: product_name || product.product_name,
            purchase_price: purchase_price !== undefined ? purchase_price : product.purchase_price,
            selling_price: selling_price !== undefined ? selling_price : product.selling_price,
            stock: stock !== undefined ? stock : product.stock,
            category_id: category_id || product.category_id
        }, { where: { id: req.params.id } });

        res.status(200).json({ success: true, message: "Produk berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE (Hapus Produk)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });

        await Product.destroy({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: "Produk berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
