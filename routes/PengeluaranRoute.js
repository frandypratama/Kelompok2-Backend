//Kelompok2-Backend\routes\PengeluaranRoute.js
import express from "express";

import {
  getPengeluaran,
  getPengeluaranById,
  createPengeluaran,
  updatePengeluaran,
  deletePengeluaran,
  getLaporanPengeluaran,
} from "../controllers/PengeluaranController.js";

const router = express.Router();

// Route laporan harus diletakkan sebelum /:id
router.get("/laporan", getLaporanPengeluaran);
router.get("/", getPengeluaran);
router.get("/:id", getPengeluaranById);
router.post("/", createPengeluaran);
router.put("/:id", updatePengeluaran);
router.delete("/:id", deletePengeluaran);

export default router;