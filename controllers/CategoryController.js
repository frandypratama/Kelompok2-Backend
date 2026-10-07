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



// GET SEMUA KATEGORI
export const getKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      message: "Data kategori berhasil diambil",
      data: kategori,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data kategori",
      error: error.message,
    });
  }
};

// GET KATEGORI BERDASARKAN ID
export const getKategoriById = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);

    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    res.status(200).json({
      message: "Data kategori berhasil diambil",
      data: kategori,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message,
    });
  }
};

// TAMBAH KATEGORI
export const createKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    const existingKategori = await Kategori.findOne({
      where: { nama_kategori },
    });

    if (existingKategori) {
      return res.status(400).json({
        message: "Kategori sudah ada",
      });
    }

    const kategori = await Kategori.create({
      nama_kategori,
      deskripsi,
    });

    res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data: kategori,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan kategori",
      error: error.message,
    });
  }
};

// UPDATE KATEGORI
export const updateKategori = async (req, res) => {
  try {
    const { nama_kategori, deskripsi } = req.body;

    const kategori = await Kategori.findByPk(req.params.id);

    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    await kategori.update({
      nama_kategori,
      deskripsi,
    });

    res.status(200).json({
      message: "Kategori berhasil diperbarui",
      data: kategori,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui kategori",
      error: error.message,
    });
  }
};

// DELETE KATEGORI
export const deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);

    if (!kategori) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    await kategori.destroy();

    res.status(200).json({
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};