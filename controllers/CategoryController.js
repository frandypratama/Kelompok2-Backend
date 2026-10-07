import Category from "../models/CategoryModel.js";

// Ambil seluruh kategori secara hierarki lengkap
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parent_id: null },
            include: [
                {
                    model: Category,
                    as: 'subcategories',
                    include: [
                        {
                            model: Category,
                            as: 'subcategories'
                        }
                    ]
                }
            ]
        });
        res.status(200).json({ success: true, message: "Berhasil mengambil data kategori", data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ambil Kategori Level 1 (parent_id = null) untuk dropdown pertama
export const getCategoriesLevel1 = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parent_id: null }
        });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ambil Subkategori berdasarkan parent_id (Untuk dropdown level 2 dan level 3)
export const getCategoriesByParent = async (req, res) => {
    try {
        const { parentId } = req.params;
        const categories = await Category.findAll({
            where: { parent_id: parentId }
        });
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};