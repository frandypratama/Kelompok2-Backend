//Kelompok2-Backend\controllers\PengeluaranCategoryController.js
import PengeluaranCategory from "../models/PengeluaranCategoryModel.js";
import Pengeluaran from "../models/PengeluaranModel.js";

export const getKategori = async (req, res) => {
  try {
    const data = await PengeluaranCategory.findAll({
      order: [["nama_kategori", "ASC"]],
    });

    res.json({ message: "Kategori berhasil diambil", data });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message,
    });
  }
};

export const getKategoriById = async (req, res) => {
  try {
    const data = await PengeluaranCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message,
    });
  }
};

export const createKategori = async (req, res) => {
  try {
    const body = req.body || {};
    const nama = body.nama_kategori?.trim();

    if (!nama) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    const existing = await PengeluaranCategory.findOne({
      where: { nama_kategori: nama },
    });

    if (existing) {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan",
      });
    }

    const data = await PengeluaranCategory.create({
      nama_kategori: nama,
      deskripsi: body.deskripsi || null,
    });

    return res.status(201).json({
      message: "Kategori berhasil ditambahkan",
      data,
    });
  } catch (error) {
    console.error("Gagal menambahkan kategori:", error);

    return res.status(500).json({
      message: "Gagal menambahkan kategori",
      error: error.message,
    });
  }
};

export const updateKategori = async (req, res) => {
  try {
    const data = await PengeluaranCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const nama = req.body.nama_kategori?.trim();

    if (!nama) {
      return res.status(400).json({
        message: "Nama kategori wajib diisi",
      });
    }

    const existing = await PengeluaranCategory.findOne({
      where: { nama_kategori: nama },
    });

    if (existing && existing.id !== data.id) {
      return res.status(409).json({
        message: "Nama kategori sudah digunakan",
      });
    }

    await data.update({
      nama_kategori: nama,
      deskripsi: req.body.deskripsi ?? data.deskripsi,
    });

    res.json({
      message: "Kategori berhasil diperbarui",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui kategori",
      error: error.message,
    });
  }
};

export const deleteKategori = async (req, res) => {
  try {
    const data = await PengeluaranCategory.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const jumlahTransaksi = await Pengeluaran.count({
      where: { kategori_id: data.id },
    });

    if (jumlahTransaksi > 0) {
      return res.status(409).json({
        message:
          "Kategori tidak dapat dihapus karena masih digunakan transaksi",
      });
    }

    await data.destroy();

    res.json({ message: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};