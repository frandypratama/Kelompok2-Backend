import Product from "../models/ProductModel.js";

// Ambil semua produk
export const getProducts = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Ambil produk berdasarkan ID
export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!response) return res.status(404).json({ message: "Produk tidak ditemukan" });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Tambah produk baru
export const createProduct = async (req, res) => {
    try {
        await Product.create(req.body);
        res.status(201).json({ message: "Produk Berhasil Ditambahkan" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Update produk
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

        await Product.update(req.body, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ message: "Produk Berhasil Diupdate" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Hapus produk
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!product) return res.status(404).json({ message: "Produk tidak ditemukan" });

        await Product.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ message: "Produk Berhasil Dihapus" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}