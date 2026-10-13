//Kelompok2-Backend\controllers\PengeluaranController.js
import { Op } from "sequelize";
import Pengeluaran from "../models/PengeluaranModel.js";
import PengeluaranCategory from "../models/PengeluaranCategoryModel.js";

const metodeValid = ["tunai", "transfer", "qris"];

const validasiTanggal = (tanggal) => {
  if (typeof tanggal !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) {
    return false;
  }

  const date = new Date(`${tanggal}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === tanggal;
};

const validasiInput = (body, parsial = false) => {
  if (!parsial || body.tanggal !== undefined) {
    if (!validasiTanggal(body.tanggal)) {
      return "Tanggal harus valid dengan format YYYY-MM-DD";
    }
  }

  if (!parsial || body.kategori_id !== undefined) {
    if (
      !Number.isInteger(Number(body.kategori_id)) ||
      Number(body.kategori_id) <= 0
    ) {
      return "kategori_id harus berupa ID kategori yang valid";
    }
  }

  if (!parsial || body.nominal !== undefined) {
    if (
      typeof body.nominal === "boolean" ||
      body.nominal === null ||
      body.nominal === "" ||
      !Number.isFinite(Number(body.nominal)) ||
      Number(body.nominal) <= 0
    ) {
      return "Nominal harus berupa angka lebih besar dari 0";
    }
  }

  if (
    body.metode_pembayaran !== undefined &&
    !metodeValid.includes(body.metode_pembayaran)
  ) {
    return "Metode pembayaran harus tunai, transfer, atau qris";
  }

  return null;
};

const includeKategori = {
  model: PengeluaranCategory,
  as: "kategori",
  attributes: ["id", "nama_kategori"],
};

const filterTanggal = (query) => {
  const { tanggal_mulai, tanggal_akhir } = query;
  const where = {};

  if (tanggal_mulai && !validasiTanggal(tanggal_mulai)) {
    throw new Error("tanggal_mulai tidak valid");
  }

  if (tanggal_akhir && !validasiTanggal(tanggal_akhir)) {
    throw new Error("tanggal_akhir tidak valid");
  }

  if (tanggal_mulai && tanggal_akhir &&
      tanggal_mulai > tanggal_akhir) {
    throw new Error("tanggal_mulai tidak boleh melewati tanggal_akhir");
  }

  if (tanggal_mulai || tanggal_akhir) {
    where.tanggal = {};

    if (tanggal_mulai) where.tanggal[Op.gte] = tanggal_mulai;
    if (tanggal_akhir) where.tanggal[Op.lte] = tanggal_akhir;
  }

  if (query.kategori_id !== undefined) {
    const id = Number(query.kategori_id);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("kategori_id tidak valid");
    }

    where.kategori_id = id;
  }

  return where;
};

// GET /api/pengeluaran
export const getPengeluaran = async (req, res) => {
  try {
    const where = filterTanggal(req.query);

    const data = await Pengeluaran.findAll({
      where,
      include: [includeKategori],
      order: [["tanggal", "DESC"], ["id", "DESC"]],
    });

    res.json({ message: "Data pengeluaran berhasil diambil", data });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Gagal mengambil pengeluaran",
    });
  }
};

// GET /api/pengeluaran/:id
export const getPengeluaranById = async (req, res) => {
  try {
    const data = await Pengeluaran.findByPk(req.params.id, {
      include: [includeKategori],
    });

    if (!data) {
      return res.status(404).json({
        message: "Pengeluaran tidak ditemukan",
      });
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil pengeluaran",
      error: error.message,
    });
  }
};

// POST /api/pengeluaran
export const createPengeluaran = async (req, res) => {
  try {
    const pesanError = validasiInput(req.body);

    if (pesanError) {
      return res.status(400).json({ message: pesanError });
    }

    const kategori = await PengeluaranCategory.findByPk(
      Number(req.body.kategori_id)
    );

    if (!kategori) {
      return res.status(400).json({
        message: "Kategori pengeluaran tidak ditemukan",
      });
    }

    const data = await Pengeluaran.create({
      tanggal: req.body.tanggal,
      kategori_id: Number(req.body.kategori_id),
      nominal: req.body.nominal,
      metode_pembayaran: req.body.metode_pembayaran || "tunai",
      keterangan: req.body.keterangan?.trim() || null,
    });

    const hasil = await Pengeluaran.findByPk(data.id, {
      include: [includeKategori],
    });

    res.status(201).json({
      message: "Pengeluaran berhasil ditambahkan",
      data: hasil,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menambahkan pengeluaran",
      error: error.message,
    });
  }
};

// PUT /api/pengeluaran/:id
export const updatePengeluaran = async (req, res) => {
  try {
    const data = await Pengeluaran.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Pengeluaran tidak ditemukan",
      });
    }

    const gabungan = {
      tanggal: data.tanggal,
      kategori_id: data.kategori_id,
      nominal: data.nominal,
      metode_pembayaran: data.metode_pembayaran,
      ...req.body,
    };

    const pesanError = validasiInput(gabungan);

    if (pesanError) {
      return res.status(400).json({ message: pesanError });
    }

    if (req.body.keterangan !== undefined &&
        req.body.keterangan !== null &&
        typeof req.body.keterangan !== "string") {
      return res.status(400).json({
        message: "Keterangan harus berupa teks",
      });
    }

    const kategori = await PengeluaranCategory.findByPk(
      Number(gabungan.kategori_id)
    );

    if (!kategori) {
      return res.status(400).json({
        message: "Kategori pengeluaran tidak ditemukan",
      });
    }

    await data.update({
      tanggal: gabungan.tanggal,
      kategori_id: Number(gabungan.kategori_id),
      nominal: gabungan.nominal,
      metode_pembayaran: gabungan.metode_pembayaran,
      keterangan:
        req.body.keterangan === undefined
          ? data.keterangan
          : req.body.keterangan?.trim() || null,
    });

    const hasil = await Pengeluaran.findByPk(data.id, {
      include: [includeKategori],
    });

    res.json({
      message: "Pengeluaran berhasil diperbarui",
      data: hasil,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui pengeluaran",
      error: error.message,
    });
  }
};

// DELETE /api/pengeluaran/:id
export const deletePengeluaran = async (req, res) => {
  try {
    const data = await Pengeluaran.findByPk(req.params.id);

    if (!data) {
      return res.status(404).json({
        message: "Pengeluaran tidak ditemukan",
      });
    }

    await data.destroy();

    res.json({ message: "Pengeluaran berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus pengeluaran",
      error: error.message,
    });
  }
};

// GET /api/pengeluaran/laporan
export const getLaporanPengeluaran = async (req, res) => {
  try {
    const where = filterTanggal(req.query);

    const data = await Pengeluaran.findAll({
      where,
      include: [includeKategori],
      order: [["tanggal", "DESC"]],
    });

    const total = data.reduce(
      (sum, item) => sum + Number(item.nominal),
      0
    );

    const rekap = {};

    for (const item of data) {
      const nama = item.kategori.nama_kategori;
      rekap[nama] = (rekap[nama] || 0) + Number(item.nominal);
    }

    res.json({
      message: "Laporan pengeluaran berhasil diambil",
      periode: {
        tanggal_mulai: req.query.tanggal_mulai || null,
        tanggal_akhir: req.query.tanggal_akhir || null,
      },
      jumlah_transaksi: data.length,
      total_pengeluaran: total,
      per_kategori: Object.entries(rekap).map(
        ([nama_kategori, nominal]) => ({
          nama_kategori,
          nominal,
        })
      ),
      data,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Gagal membuat laporan",
    });
  }
};