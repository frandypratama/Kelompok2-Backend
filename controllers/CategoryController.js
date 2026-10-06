import Category from "../models/CategoryModel.js";

// Mendapatkan semua kategori beserta subkategorinya
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            where: { parent_id: null }, // Ambil kategori utama saja
            include: [{
                model: Category,
                as: 'subcategories',
                include: [{
                    model: Category,
                    as: 'subcategories' // Untuk level 3 (sub-sublategori)
                }]
            }]
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};