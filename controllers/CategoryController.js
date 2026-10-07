import Category from "../models/CategoryModel.js";

// READ: Ambil seluruh kategori secara hierarki bertingkat (3 Level)
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parent_id: null }, // Level 1 (Kategori Utama: Fisik, Digital)
            include: [
                {
                    model: Category,
                    as: 'subcategories', // Level 2 (Subkategori: Voucher, Pulsa, dll)
                    include: [
                        {
                            model: Category,
                            as: 'subcategories' // Level 3 (Sub-Subkategori: Telkomsel, Free Fire, dll)
                        }
                    ]
                }
            ]
        });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { category_name, parent_id } = req.body;
        if (!category_name) {
            return res.status(400).json({ success: false, message: "Nama kategori wajib diisi!" });
        }

        const newCategory = await Category.create({
            category_name,
            parent_id: parent_id || null
        });

        res.status(201).json({
            success: true,
            message: "Kategori berhasil ditambahkan",
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, parent_id } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
        }

        await Category.update({
            category_name: category_name || category.category_name,
            parent_id: parent_id !== undefined ? parent_id : category.parent_id
        }, {
            where: { id }
        });

        res.status(200).json({ success: true, message: "Kategori berhasil diperbarui" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
        }

        await Category.destroy({ where: { id } });
        res.status(200).json({ success: true, message: "Kategori berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};